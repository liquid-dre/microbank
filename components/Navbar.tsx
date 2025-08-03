"use client";

import React, { Fragment, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/client/providers/AuthProvider";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  LogOut,
  User,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // 1) Split path, remove empty segments and "/client"
  const raw = pathname.split("/").filter((seg) => seg && seg !== "client");
  // 2) Remove duplicates (just in case)
  const segments = raw.filter((seg, i) => raw.indexOf(seg) === i);
  // 3) Build breadcrumbs, inserting Dashboard only if not already first
  const breadcrumbs = [
    ...(segments[0] !== "dashboard"
      ? [{ name: "Dashboard", href: "/client/dashboard" }]
      : []),
    ...segments.map((seg, idx) => ({
      name: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
      href: "/client/" + segments.slice(0, idx + 1).join("/"),
    })),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-primary hover:text-primary-dark"
        >
          Microbanker
        </Link>

        {/* Breadcrumbs */}
        {user ? (
          <Breadcrumb className="hidden md:flex list-none items-center text-sm text-gray-600">
            {breadcrumbs.map((crumb, idx) => (
              <Fragment key={crumb.href}>
                <BreadcrumbItem>
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="font-semibold text-gray-800">
                      {crumb.name}
                    </span>
                  ) : (
                    <BreadcrumbLink
                      href={crumb.href}
                      className="hover:underline"
                    >
                      {crumb.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {idx < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="mx-1" />
                )}
              </Fragment>
            ))}
          </Breadcrumb>
        ) : (
          <div className="flex-1" />
        )}

        {/* Desktop actions */}
        <div className="hidden md:flex items-center space-x-3">
          {!user ? (
            <>
              <Link href="/client/login">
                <Button variant="outline" className="flex items-center gap-1">
                  <LogIn size={16} /> Login
                </Button>
              </Link>
              <Link href="/client/register">
                <Button className="flex items-center gap-1">
                  <UserPlus size={16} /> Register
                </Button>
              </Link>
            </>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer border hover:shadow">
                  <AvatarImage src={user.avatar || ""} alt={user.name} />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-44 p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => router.push("/client/edit-profile")}
                >
                  <User size={16} /> Edit Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-500 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </Button>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm px-4 py-2 space-y-2">
          {!user ? (
            <>
              <Link href="/client/login">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-1"
                >
                  <LogIn size={16} /> Login
                </Button>
              </Link>
              <Link href="/client/register">
                <Button className="w-full flex items-center justify-center gap-1">
                  <UserPlus size={16} /> Register
                </Button>
              </Link>
            </>
          ) : (
            <>
              {breadcrumbs.map((crumb) => (
                <Link
                  key={crumb.href}
                  href={crumb.href}
                  className="block text-gray-700 hover:text-primary py-2"
                >
                  {crumb.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 hover:bg-red-50 py-2 px-2 rounded"
              >
                <LogOut size={16} className="inline mr-1" /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}