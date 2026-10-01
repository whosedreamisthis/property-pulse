"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { getSafeCallbackUrl } from "@/lib/routes";
import {
  registerSchema,
  signInSchema,
  type RegisterInput,
  type SignInInput,
} from "@/lib/validations/auth";

export interface RegisterResult {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof RegisterInput, string[]>>;
}

export interface SignInResult {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof SignInInput, string[]>>;
}

const DUPLICATE_EMAIL_ERROR = "An account with this email already exists.";
const INVALID_CREDENTIALS_ERROR = "Invalid email or password";
const GENERIC_ERROR = "Something went wrong. Please try again.";

// On success signIn() throws Next's redirect, which must propagate; only auth
// failures are returned, so the form keeps what the user typed.
export async function signInWithCredentials(
  input: unknown,
  callbackUrl?: string | null,
): Promise<SignInResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: getSafeCallbackUrl(callbackUrl),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error:
          error.type === "CredentialsSignin"
            ? INVALID_CREDENTIALS_ERROR
            : GENERIC_ERROR,
      };
    }
    throw error;
  }
}

export async function signInWithGoogle(callbackUrl?: string | null) {
  await signIn("google", { redirectTo: getSafeCallbackUrl(callbackUrl) });
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}

export async function registerUser(input: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) return { success: false, error: DUPLICATE_EMAIL_ERROR };

    // No role is set here: new users always get the schema default, USER.
    await db.user.create({
      data: { name, email, password: await hashPassword(password) },
      select: { id: true },
    });

    return { success: true };
  } catch (error) {
    // A concurrent registration can still hit the unique constraint.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: false, error: DUPLICATE_EMAIL_ERROR };
    }
    console.error("registerUser failed", error);
    return { success: false, error: GENERIC_ERROR };
  }
}
