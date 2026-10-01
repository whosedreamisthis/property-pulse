import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthError, CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { registerUser, signInWithCredentials } from "@/actions/auth";

vi.mock("@/auth", () => ({ signIn: vi.fn(), signOut: vi.fn() }));
vi.mock("@/lib/db", () => ({
  db: { user: { findUnique: vi.fn(), create: vi.fn() } },
}));
vi.mock("@/lib/password", () => ({ hashPassword: vi.fn() }));

const mockSignIn = vi.mocked(signIn);

const findUnique = vi.mocked(db.user.findUnique);
const create = vi.mocked(db.user.create);

const validInput = {
  name: "Riley Renter",
  email: "  Riley@Example.com ",
  password: "Password123!",
  confirmPassword: "Password123!",
};

beforeEach(() => {
  vi.mocked(hashPassword).mockResolvedValue("hashed-password");
  findUnique.mockResolvedValue(null);
  create.mockResolvedValue({ id: "user-1" } as never);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("registerUser", () => {
  it("creates the user with a normalized email and hashed password", async () => {
    await expect(registerUser(validInput)).resolves.toEqual({ success: true });

    expect(create).toHaveBeenCalledWith({
      data: {
        name: "Riley Renter",
        email: "riley@example.com",
        password: "hashed-password",
      },
      select: { id: true },
    });
  });

  it("ignores a client-sent role so new users get the default USER role", async () => {
    await registerUser({ ...validInput, role: "ADMIN" });

    const { data } = create.mock.calls[0][0];
    expect(data).not.toHaveProperty("role");
  });

  it("rejects an email that is already registered", async () => {
    findUnique.mockResolvedValue({ id: "existing" } as never);

    await expect(registerUser(validInput)).resolves.toEqual({
      success: false,
      error: "An account with this email already exists.",
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("returns a field error when passwords don't match", async () => {
    const result = await registerUser({
      ...validInput,
      confirmPassword: "Different123!",
    });

    expect(result.success).toBe(false);
    expect(result.fieldErrors?.confirmPassword).toEqual([
      "Passwords don't match",
    ]);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("returns a field error for an invalid email", async () => {
    const result = await registerUser({ ...validInput, email: "not-an-email" });

    expect(result.success).toBe(false);
    expect(result.fieldErrors?.email).toEqual(["Enter a valid email address"]);
  });

  it("returns a field error for a short password", async () => {
    const result = await registerUser({
      ...validInput,
      password: "short",
      confirmPassword: "short",
    });

    expect(result.fieldErrors?.password).toEqual([
      "Password must be at least 8 characters",
    ]);
  });

  it("treats a unique-constraint race as a duplicate email", async () => {
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "7.10.0",
      }),
    );

    await expect(registerUser(validInput)).resolves.toEqual({
      success: false,
      error: "An account with this email already exists.",
    });
  });

  it("returns a generic error when the database fails", async () => {
    create.mockRejectedValue(new Error("connection refused"));

    await expect(registerUser(validInput)).resolves.toEqual({
      success: false,
      error: "Something went wrong. Please try again.",
    });
  });

  it("never returns the password hash", async () => {
    const result = await registerUser(validInput);
    expect(JSON.stringify(result)).not.toContain("hashed-password");
  });
});

describe("signInWithCredentials", () => {
  const credentials = { email: " Riley@Example.com ", password: "Password123!" };

  it("signs in with the normalized email and a safe callback path", async () => {
    await signInWithCredentials(credentials, "http://localhost:3000/admin");

    expect(mockSignIn).toHaveBeenCalledWith("credentials", {
      email: "riley@example.com",
      password: "Password123!",
      redirectTo: "/admin",
    });
  });

  it("defaults the redirect to /dashboard", async () => {
    await signInWithCredentials(credentials);

    expect(mockSignIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ redirectTo: "/dashboard" }),
    );
  });

  it("returns field errors for invalid input without calling signIn", async () => {
    const result = await signInWithCredentials({ email: "nope", password: "" });

    expect(result.success).toBe(false);
    expect(result.fieldErrors?.email).toEqual(["Enter a valid email address"]);
    expect(result.fieldErrors?.password).toEqual(["Password is required"]);
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("returns the generic invalid-credentials error on a failed sign-in", async () => {
    mockSignIn.mockRejectedValue(new CredentialsSignin());

    await expect(signInWithCredentials(credentials)).resolves.toEqual({
      success: false,
      error: "Invalid email or password",
    });
  });

  it("returns a generic error for other auth errors", async () => {
    mockSignIn.mockRejectedValue(new AuthError("adapter failed"));

    await expect(signInWithCredentials(credentials)).resolves.toEqual({
      success: false,
      error: "Something went wrong. Please try again.",
    });
  });

  it("rethrows non-auth errors such as Next's success redirect", async () => {
    const redirect = new Error("NEXT_REDIRECT");
    mockSignIn.mockRejectedValue(redirect);

    await expect(signInWithCredentials(credentials)).rejects.toBe(redirect);
  });
});
