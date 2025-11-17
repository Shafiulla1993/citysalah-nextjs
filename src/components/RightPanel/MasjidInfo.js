// src/components/RightPanel/MasjidInfo.js
"use client";
import React from "react";
import Image from "next/image";

export default function MasjidInfo({ masjid }) {
  if (!masjid) return null;

  return (
    <div className="bg-white shadow rounded p-4">
      {masjid.imageUrl && (
        <div className="w-full h-64 relative mb-4">
          <Image
            src={masjid.imageUrl || "https://placehold.co/600x400"}
            alt={masjid.name}
            fill
            className="object-cover rounded"
            priority
            unoptimized
          />
        </div>
      )}
      <h2 className="text-2xl font-bold">{masjid.name}</h2>
      {masjid.address && <p className="text-gray-600 mt-1">{masjid.address}</p>}
    </div>
  );
}
