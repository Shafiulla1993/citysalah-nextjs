"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { loggedIn } = useAuth(); // just read auth state, no hooks in layout

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 md:flex md:items-center md:justify-between md:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex justify-between items-center p-4 md:p-0">
          <Link href="/" className="text-xl font-bold">
            City Salah
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-lg focus:outline-none focus:shadow-outline"
          >
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Right side menu */}
        <nav
          className={`flex-col md:flex md:flex-row md:items-center md:justify-end ${
            open ? "flex" : "hidden"
          }`}
        >
          <Link
            href="/contact"
            className="block px-4 py-2 md:py-0 md:px-2 hover:text-blue-600"
          >
            Contact Us
          </Link>

          {loggedIn ? (
            <>
              <Link
                href="/profile"
                className="block px-4 py-2 md:py-0 md:px-2 hover:text-blue-600"
              >
                Profile
              </Link>
              <Link
                href="/logout" // redirect to logout page
                className="block px-4 py-2 md:py-0 md:px-2 hover:text-red-500"
              >
                Logout
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="block px-4 py-2 md:py-0 md:px-2 hover:text-blue-600"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
