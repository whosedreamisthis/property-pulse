import NextAuth from "next-auth";
import authConfig from "@/auth.config";

// Optimistic check only (see `authorized` in auth.config.ts); pages re-verify with requireRole().
const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile",
    "/favorites",
    "/inquiries",
  ],
};
