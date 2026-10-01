"use client";

import { LayoutDashboard, LogOut, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { signOutUser } from "@/actions/auth";
import UserAvatar from "@/components/layout/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Role } from "@/generated/prisma/enums";

interface UserMenuProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}

export default function UserMenu({ name, email, image, role }: UserMenuProps) {
  const [isSigningOut, startSignOut] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
      >
        <UserAvatar name={name} email={email} image={image} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="grid font-normal">
          <span className="truncate text-sm font-semibold text-gray-950">
            {name ?? "Your account"}
          </span>
          {email && (
            <span className="truncate text-xs text-gray-500">{email}</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard">
            <LayoutDashboard aria-hidden="true" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        {/* Hiding the link is cosmetic; /admin enforces the role on the server. */}
        {role === "ADMIN" && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/admin">
              <Shield aria-hidden="true" />
              Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile">
            <UserRound aria-hidden="true" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={isSigningOut}
          onSelect={() => startSignOut(() => signOutUser())}
        >
          <LogOut aria-hidden="true" />
          {isSigningOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
