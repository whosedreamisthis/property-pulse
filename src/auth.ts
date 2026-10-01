import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig, { CREDENTIAL_FIELDS } from "@/auth.config";
import { authorizeCredentials } from "@/lib/auth-credentials";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  // Same providers as auth.config.ts, with the real Credentials check.
  providers: [
    Google,
    Credentials({
      credentials: CREDENTIAL_FIELDS,
      authorize: authorizeCredentials,
    }),
  ],
});
