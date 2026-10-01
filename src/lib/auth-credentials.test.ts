import { beforeEach, describe, expect, it, vi } from "vitest";
import { authorizeCredentials } from "@/lib/auth-credentials";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

vi.mock("@/lib/db", () => ({ db: { user: { findUnique: vi.fn() } } }));
vi.mock("@/lib/password", () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
}));

const findUnique = vi.mocked(db.user.findUnique);
const verify = vi.mocked(verifyPassword);

const storedUser = {
  id: "user-1",
  name: "Riley Renter",
  email: "riley@example.com",
  image: null,
  role: "USER",
  password: "stored-hash",
};

beforeEach(() => {
  vi.mocked(hashPassword).mockResolvedValue("dummy-hash");
  findUnique.mockResolvedValue(storedUser as never);
  verify.mockResolvedValue(true);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("authorizeCredentials", () => {
  it("returns the user without the password hash on a correct password", async () => {
    const result = await authorizeCredentials({
      email: " Riley@Example.com ",
      password: "Password123!",
    });

    expect(result).toEqual({
      id: "user-1",
      name: "Riley Renter",
      email: "riley@example.com",
      image: null,
      role: "USER",
    });
    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { email: "riley@example.com" } }),
    );
    expect(verify).toHaveBeenCalledWith("Password123!", "stored-hash");
  });

  it("returns null for a wrong password", async () => {
    verify.mockResolvedValue(false);
    await expect(
      authorizeCredentials({ email: "riley@example.com", password: "nope" }),
    ).resolves.toBeNull();
  });

  it("returns null for an unknown email but still runs a bcrypt compare", async () => {
    findUnique.mockResolvedValue(null);
    verify.mockResolvedValue(false);

    await expect(
      authorizeCredentials({ email: "ghost@example.com", password: "x" }),
    ).resolves.toBeNull();
    expect(verify).toHaveBeenCalledTimes(1);
  });

  it("returns null for a Google-only account with no password", async () => {
    findUnique.mockResolvedValue({ ...storedUser, password: null } as never);

    await expect(
      authorizeCredentials({ email: "riley@example.com", password: "x" }),
    ).resolves.toBeNull();
    expect(verify).not.toHaveBeenCalledWith("x", "stored-hash");
  });

  it("returns null for invalid input without querying the database", async () => {
    await expect(
      authorizeCredentials({ email: "not-an-email", password: "" }),
    ).resolves.toBeNull();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("returns null when the database fails", async () => {
    findUnique.mockRejectedValue(new Error("connection refused"));
    await expect(
      authorizeCredentials({ email: "riley@example.com", password: "x" }),
    ).resolves.toBeNull();
  });
});
