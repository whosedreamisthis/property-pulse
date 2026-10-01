import type { Role } from "@/generated/prisma/enums";

const ROLE_ROUTE_PREFIXES: [prefix: string, role: Role][] = [
  ["/admin", "ADMIN"],
];

const SIGNED_IN_ROUTES = ["/dashboard", "/profile", "/favorites", "/inquiries"];

export type RouteAccess = "allow" | "sign-in" | "wrong-role";

export const SIGN_IN_PATH = "/sign-in";
export const DEFAULT_SIGN_IN_REDIRECT = "/dashboard";

// Reduces a callbackUrl to a path on this site, so sign-in can never redirect off-site.
// The proxy sends absolute same-origin URLs; their origin is dropped.
export function getSafeCallbackUrl(callbackUrl: string | null | undefined) {
  if (!callbackUrl) return DEFAULT_SIGN_IN_REDIRECT;

  const isRelativePath =
    callbackUrl.startsWith("/") &&
    !callbackUrl.startsWith("//") &&
    !callbackUrl.startsWith("/\\");

  try {
    const url = isRelativePath
      ? new URL(callbackUrl, "http://localhost")
      : new URL(callbackUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return DEFAULT_SIGN_IN_REDIRECT;
    }
    const path = `${url.pathname}${url.search}${url.hash}`;
    return path.startsWith(SIGN_IN_PATH) ? DEFAULT_SIGN_IN_REDIRECT : path;
  } catch {
    return DEFAULT_SIGN_IN_REDIRECT;
  }
}

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function getRequiredRole(pathname: string): Role | null {
  const match = ROLE_ROUTE_PREFIXES.find(([prefix]) =>
    matchesPrefix(pathname, prefix),
  );
  return match ? match[1] : null;
}

export function isProtectedRoute(pathname: string) {
  return (
    getRequiredRole(pathname) !== null ||
    SIGNED_IN_ROUTES.some((route) => matchesPrefix(pathname, route))
  );
}

export function resolveRouteAccess(
  pathname: string,
  role: Role | undefined,
): RouteAccess {
  if (!isProtectedRoute(pathname)) return "allow";
  if (!role) return "sign-in";

  const requiredRole = getRequiredRole(pathname);
  if (requiredRole && requiredRole !== role) return "wrong-role";

  return "allow";
}
