import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { SIGN_IN_PATH, resolveRouteAccess } from "@/lib/routes";

// Fields for NextAuth's default sign-in form; shared with the real provider in src/auth.ts.
export const CREDENTIAL_FIELDS = {
  email: { label: "Email", type: "email" },
  password: { label: "Password", type: "password" },
};

// Edge-safe config shared by the proxy and src/auth.ts. No adapter or Prisma imports here.
export default {
  providers: [
    Google,
    // Placeholder: the real bcrypt check is in src/auth.ts, which the proxy never loads.
    Credentials({ credentials: CREDENTIAL_FIELDS, authorize: () => null }),
  ],
  // Sign-in errors (e.g. OAuthAccountNotLinked) also land here as ?error=.
  pages: { signIn: SIGN_IN_PATH },
  // NextAuth's remaining built-in pages follow the OS theme; force light to match the app.
  theme: { colorScheme: "light" },
  callbacks: {
    // `user` is only present on sign-in; with the adapter it is the DB row, so role defaults to USER.
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
