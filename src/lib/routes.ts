import type { Role } from "@/generated/prisma/enums";

const ROLE_ROUTE_PREFIXES: [prefix: string, role: Role][] = [
  ["/admin", "ADMIN"],
];

const SIGNED_IN_ROUTES = ["/dashboard", "/profile", "/favorites", "/inquiries"];

export type RouteAccess = "allow" | "sign-in" | "wrong-role";

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
