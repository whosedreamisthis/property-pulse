import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { resolveRouteAccess } from "@/lib/routes";

// Edge-safe config shared by the proxy and src/auth.ts. No adapter or Prisma imports here.
export default {
  providers: [Google],
  // Default NextAuth pages follow the OS theme; force light to match the app.
  theme: { colorScheme: "light" },
  callbacks: {
    // `user` is only present on sign-in; with the adapter it is the DB row, so role defaults to RENTER.
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const access = resolveRouteAccess(nextUrl.pathname, auth?.user?.role);

      if (access === "sign-in") return false;
      if (access === "wrong-role") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
