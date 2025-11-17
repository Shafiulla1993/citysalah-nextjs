"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ModernNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { loggedIn } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-800 dark:text-white"
            >
              City Salah
            </Link>
          </div>

          {/* Right side desktop menu */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link
              href="/contact"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
            >
              Contact Us
            </Link>

            {loggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
                >
                  Profile
                </Link>
                <Link
                  href="/logout"
                  className="text-red-600 hover:text-red-400 transition"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md">
          <nav className="flex flex-col space-y-2 p-4">
            <Link
              href="/contact"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>

            {loggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/logout"
                  className="text-red-600 hover:text-red-400 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
