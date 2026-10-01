import { describe, expect, it } from "vitest";
import { getRequiredRole, resolveRouteAccess } from "@/lib/routes";

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
