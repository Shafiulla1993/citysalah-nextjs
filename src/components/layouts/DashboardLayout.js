// src/components/Layouts/DashboardLayout.js
import React from "react";

export default function DashboardLayout({ left, right }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 min-h-screen bg-gray-50">
      {/* Left Panel - 40% */}
      <div className="md:w-2/5 w-full space-y-4">{left}</div>

      {/* Right Panel - 60% */}
      <div className="md:w-3/5 w-full space-y-4">{right}</div>
    </div>
  );
}
