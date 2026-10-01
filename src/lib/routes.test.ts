import { describe, expect, it } from "vitest";
import { getRequiredRole, resolveRouteAccess } from "@/lib/routes";

describe("getRequiredRole", () => {
  it("maps role-specific prefixes to their role", () => {
    expect(getRequiredRole("/renter/dashboard")).toBe("RENTER");
    expect(getRequiredRole("/owner/dashboard")).toBe("OWNER");
    expect(getRequiredRole("/admin")).toBe("ADMIN");
    expect(getRequiredRole("/admin/users")).toBe("ADMIN");
  });

  it("does not match paths that only share a prefix string", () => {
    expect(getRequiredRole("/administrator")).toBeNull();
    expect(getRequiredRole("/owners")).toBeNull();
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
      "/renter/dashboard",
      "/owner/dashboard",
      "/admin",
      "/profile",
      "/favorites",
      "/inquiries",
    ]) {
      expect(resolveRouteAccess(path, undefined)).toBe("sign-in");
    }
  });

  it("allows any signed-in role on shared signed-in routes", () => {
    expect(resolveRouteAccess("/dashboard", "OWNER")).toBe("allow");
    expect(resolveRouteAccess("/profile", "ADMIN")).toBe("allow");
  });

  it("allows a role on its own dashboard", () => {
    expect(resolveRouteAccess("/renter/dashboard", "RENTER")).toBe("allow");
    expect(resolveRouteAccess("/owner/dashboard", "OWNER")).toBe("allow");
    expect(resolveRouteAccess("/admin", "ADMIN")).toBe("allow");
  });

  it("flags the wrong role, including admins on other dashboards", () => {
    expect(resolveRouteAccess("/owner/dashboard", "RENTER")).toBe("wrong-role");
    expect(resolveRouteAccess("/admin", "OWNER")).toBe("wrong-role");
    expect(resolveRouteAccess("/renter/dashboard", "ADMIN")).toBe("wrong-role");
  });
});
