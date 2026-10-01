import { describe, expect, it } from "vitest";
import {
  getRequiredRole,
  getSafeCallbackUrl,
  resolveRouteAccess,
} from "@/lib/routes";

describe("getSafeCallbackUrl", () => {
  it("defaults to /dashboard when there is no callback", () => {
    expect(getSafeCallbackUrl(undefined)).toBe("/dashboard");
    expect(getSafeCallbackUrl("")).toBe("/dashboard");
  });

  it("keeps relative paths with their query and hash", () => {
    expect(getSafeCallbackUrl("/admin")).toBe("/admin");
    expect(getSafeCallbackUrl("/properties?city=nanaimo#map")).toBe(
      "/properties?city=nanaimo#map",
    );
  });

  it("reduces an absolute URL (as sent by the proxy) to its path", () => {
    expect(getSafeCallbackUrl("http://localhost:3000/admin/users")).toBe(
      "/admin/users",
    );
  });

  it("never redirects off-site", () => {
    expect(getSafeCallbackUrl("https://evil.example/phish")).toBe("/phish");
    expect(getSafeCallbackUrl("//evil.example/phish")).toBe("/dashboard");
    expect(getSafeCallbackUrl("/\\evil.example")).toBe("/dashboard");
    expect(getSafeCallbackUrl("javascript:alert(1)")).toBe("/dashboard");
  });

  it("does not loop back to the sign-in page", () => {
    expect(getSafeCallbackUrl("/sign-in?error=x")).toBe("/dashboard");
  });
});

describe("getRequiredRole", () => {
  it("requires ADMIN for the admin area", () => {
    expect(getRequiredRole("/admin")).toBe("ADMIN");
    expect(getRequiredRole("/admin/users")).toBe("ADMIN");
  });

  it("requires no specific role for the dashboard", () => {
    expect(getRequiredRole("/dashboard")).toBeNull();
    expect(getRequiredRole("/dashboard/properties/new")).toBeNull();
  });

  it("does not match paths that only share a prefix string", () => {
    expect(getRequiredRole("/administrator")).toBeNull();
  });
});

describe("resolveRouteAccess", () => {
  it("allows public routes when signed out", () => {
    expect(resolveRouteAccess("/", undefined)).toBe("allow");
    expect(resolveRouteAccess("/properties", undefined)).toBe("allow");
  });

  it("requires sign-in for protected routes when signed out", () => {
    for (const path of [
      "/dashboard",
      "/dashboard/properties",
      "/admin",
      "/profile",
      "/favorites",
      "/inquiries",
    ]) {
      expect(resolveRouteAccess(path, undefined)).toBe("sign-in");
    }
  });

  it("allows users and admins on the dashboard and signed-in routes", () => {
    expect(resolveRouteAccess("/dashboard", "USER")).toBe("allow");
    expect(resolveRouteAccess("/dashboard/inquiries", "USER")).toBe("allow");
    expect(resolveRouteAccess("/dashboard", "ADMIN")).toBe("allow");
    expect(resolveRouteAccess("/profile", "ADMIN")).toBe("allow");
  });

  it("allows admins in the admin area", () => {
    expect(resolveRouteAccess("/admin", "ADMIN")).toBe("allow");
    expect(resolveRouteAccess("/admin/users", "ADMIN")).toBe("allow");
  });

  it("flags regular users in the admin area", () => {
    expect(resolveRouteAccess("/admin", "USER")).toBe("wrong-role");
    expect(resolveRouteAccess("/admin/properties", "USER")).toBe("wrong-role");
  });
});
