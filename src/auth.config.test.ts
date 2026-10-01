import { describe, expect, it } from "vitest";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import authConfig from "@/auth.config";

const { jwt, session, authorized } = authConfig.callbacks;

type JwtParams = Parameters<typeof jwt>[0];
type SessionParams = Parameters<typeof session>[0];
type AuthorizedParams = Parameters<typeof authorized>[0];

function runJwt(token: Partial<JWT>, user?: Partial<User>) {
  return jwt({ token, user } as unknown as JwtParams);
}

function runAuthorized(pathname: string, role?: Session["user"]["role"]) {
  const auth = role
    ? { user: { id: "user-1", role }, expires: "2099-01-01T00:00:00.000Z" }
    : null;
  const request = { nextUrl: new URL(pathname, "http://localhost:3000") };
  return authorized({ auth, request } as unknown as AuthorizedParams);
}

describe("jwt callback", () => {
  it("copies id and role from the user on sign-in", () => {
    const token = runJwt({ sub: "user-1" }, { id: "user-1", role: "RENTER" });
    expect(token).toMatchObject({ id: "user-1", role: "RENTER" });
  });

  it("keeps the existing id and role on later requests without a user", () => {
    const token = runJwt({ sub: "user-1", id: "user-1", role: "OWNER" });
    expect(token).toMatchObject({ id: "user-1", role: "OWNER" });
  });
});

describe("session callback", () => {
  it("exposes id and role from the token on session.user", () => {
    const result = session({
      session: {
        user: { name: "Test User", email: "test@example.com" },
        expires: "2099-01-01T00:00:00.000Z",
      },
      token: { id: "user-1", role: "ADMIN" },
    } as unknown as SessionParams) as Session;

    expect(result.user).toMatchObject({
      id: "user-1",
      role: "ADMIN",
      email: "test@example.com",
    });
  });
});

describe("authorized callback", () => {
  it("allows public routes when signed out", () => {
    expect(runAuthorized("/")).toBe(true);
  });

  it("returns false for protected routes when signed out, so NextAuth redirects to sign-in", () => {
    expect(runAuthorized("/renter/dashboard")).toBe(false);
  });

  it("allows a role on its own dashboard", () => {
    expect(runAuthorized("/owner/dashboard", "OWNER")).toBe(true);
  });

  it("redirects the wrong role to /dashboard", () => {
    const result = runAuthorized("/admin", "RENTER");

    expect(result).toBeInstanceOf(Response);
    expect((result as Response).headers.get("location")).toBe(
      "http://localhost:3000/dashboard",
    );
  });
});
