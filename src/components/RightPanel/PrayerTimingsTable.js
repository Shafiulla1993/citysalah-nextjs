// src/components/RightPanel/PrayerTimingsTable.js
"use client";
import React from "react";

export default function PrayerTimingsTable({ prayerTimings }) {
  if (!prayerTimings?.length) return null;

  return (
    <div className="bg-white shadow rounded p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-2">Prayer Timings</h2>
      <table className="table-auto w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left border-b">Prayer</th>
            <th className="p-2 text-left border-b">Azaan</th>
            <th className="p-2 text-left border-b">Iqaamat</th>
          </tr>
        </thead>
        <tbody>
          {prayerTimings.map((timing, idx) =>
            timing.prayers.map((prayer, i) => (
              <tr key={`${idx}-${i}`} className="border-b">
                <td className="p-2">{prayer.name}</td>
                <td className="p-2">{prayer.azaantime || "-"}</td>
                <td className="p-2">{prayer.iqaamattime || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
