"use server";

import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export interface RegisterResult {
  success: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof RegisterInput, string[]>>;
}

const DUPLICATE_EMAIL_ERROR = "An account with this email already exists.";

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
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
