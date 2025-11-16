"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await authAPI.logout(); // call logout API route
        router.replace("/login"); // redirect to login page
      } catch (err) {
        console.error("Logout failed:", err.message);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Logging out...</p>
    </div>
  );
}
