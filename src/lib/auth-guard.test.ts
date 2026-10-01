import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCurrentUser, requireRole } from "@/lib/auth-guard";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

// `auth` is overloaded (also a proxy wrapper); tests only use the no-arg session form.
const mockAuth = auth as unknown as ReturnType<
  typeof vi.fn<() => Promise<Session | null>>
>;

function sessionFor(role: Session["user"]["role"]): Session {
  return {
    user: { id: "user-1", role, name: "Test User", email: "test@example.com" },
    expires: "2099-01-01T00:00:00.000Z",
  };
}

beforeEach(() => {
  vi.mocked(redirect).mockImplementation((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  });
});

describe("getCurrentUser", () => {
  it("returns the session user", async () => {
    mockAuth.mockResolvedValue(sessionFor("OWNER"));
    await expect(getCurrentUser()).resolves.toMatchObject({
      id: "user-1",
      role: "OWNER",
    });
  });

  it("returns null when there is no session", async () => {
    mockAuth.mockResolvedValue(null);
    await expect(getCurrentUser()).resolves.toBeNull();
  });
});

describe("requireRole", () => {
  it("returns the user when the role is allowed", async () => {
    mockAuth.mockResolvedValue(sessionFor("RENTER"));
    await expect(requireRole("RENTER")).resolves.toMatchObject({
      role: "RENTER",
    });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("accepts any of several allowed roles", async () => {
    mockAuth.mockResolvedValue(sessionFor("ADMIN"));
    await expect(requireRole("OWNER", "ADMIN")).resolves.toMatchObject({
      role: "ADMIN",
    });
  });

  it("redirects to sign-in when signed out", async () => {
    mockAuth.mockResolvedValue(null);
    await expect(requireRole("RENTER")).rejects.toThrow(
      "REDIRECT:/api/auth/signin",
    );
  });

  it("redirects to /dashboard when the role does not match", async () => {
    mockAuth.mockResolvedValue(sessionFor("ADMIN"));
    await expect(requireRole("OWNER")).rejects.toThrow("REDIRECT:/dashboard");
  });

  it("propagates auth failures", async () => {
    mockAuth.mockRejectedValue(new Error("JWT decode failed"));
    await expect(requireRole("RENTER")).rejects.toThrow("JWT decode failed");
  });
});
