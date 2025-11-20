// src/components/Dashboard/Card.js
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

export default function DashboardCard({
  title,
  items = [],
  count = 0,
  addLink,
  itemKey = "name",
}) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col w-full md:w-1/3 min-w-[250px]">
      {/* Card Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-bold">
          {title} ({count})
        </div>
        {addLink && (
          <button
            onClick={() => router.push(addLink)}
            className="p-1 rounded-full hover:bg-gray-200 transition"
          >
            <FiPlus size={20} />
          </button>
        )}
      </div>

      {/* List of items */}
      <div className="flex-1 overflow-y-auto max-h-64 space-y-2">
        {items.map((item) => (
          <div
            key={item._id || item[itemKey]}
            className="flex justify-between items-center p-2 bg-gray-50 rounded-lg shadow-sm"
          >
            <span className="truncate">{item[itemKey]}</span>
            <div className="flex gap-2">
              <button className="hover:bg-gray-200 p-1 rounded" title="Edit">
                <FiEdit size={16} />
              </button>
              <button className="hover:bg-gray-200 p-1 rounded" title="Delete">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
