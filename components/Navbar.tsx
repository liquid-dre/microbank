"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/"); // Redirect to home after logout
  };

  return (
    <nav className="w-full shadow-sm border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary">
            Microbank
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            
            {user && (
              <Link href="/client/dashboard" className="text-gray-600 hover:text-primary">
                Dashboard
              </Link>
            )}

            {!user ? (
              <>
                <Link
                  href="/register"
                  className="flex items-center gap-1 text-gray-600 hover:text-primary"
                >
                  <UserPlus size={18} /> Register
                </Link>
              </>
            ) : (
              <Button
                variant="outline"
                className="flex items-center gap-1 text-red-500 border-red-300 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut size={18} /> Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="h-6 w-6 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 border-t bg-white">
          
          {user && (
            <Link href="/client/dashboard" className="block text-gray-600 hover:text-primary py-2">
              Dashboard
            </Link>
          )}

          {!user ? (
            <>
              <Link href="/register" className="block text-gray-600 hover:text-primary py-2">
                <UserPlus size={18} className="inline mr-1" /> Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="block w-full text-left text-red-500 hover:bg-red-50 py-2 px-2 rounded"
            >
              <LogOut size={18} className="inline mr-1" /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}