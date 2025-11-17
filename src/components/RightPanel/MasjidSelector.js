"use client";
import React, { useEffect, useState } from "react";

export default function MasjidSelector({
  cities,
  areas,
  masjids,
  selectedCity,
  selectedArea,
  selectedMasjid,
  setSelectedCity,
  setSelectedArea,
  setSelectedMasjid,
}) {
  const [localMasjidId, setLocalMasjidId] = useState(selectedMasjid?._id || "");

  // Sync local dropdown selection when selectedMasjid changes externally
  useEffect(() => {
    setLocalMasjidId(selectedMasjid?._id || "");
  }, [selectedMasjid]);

  const handleMasjidChange = (e) => {
    const masjid = masjids.find((m) => m._id === e.target.value);
    setSelectedMasjid(masjid || null);
  };

  return (
    <div className="space-y-2">
      {/* City Dropdown */}
      <select
        className="border rounded p-2 w-full"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="">Select City</option>
        {cities.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Area Dropdown */}
      <select
        className="border rounded p-2 w-full"
        value={selectedArea}
        onChange={(e) => setSelectedArea(e.target.value)}
        disabled={!areas.length}
      >
        <option value="">Select Area</option>
        {areas.map((a) => (
          <option key={a._id} value={a._id}>
            {a.name}
          </option>
        ))}
      </select>

      {/* Masjid Dropdown */}
      <select
        className="border rounded p-2 w-full"
        value={localMasjidId}
        onChange={handleMasjidChange}
        disabled={!masjids.length} // only disable if no masjids at all
      >
        <option value="">Select Masjid</option>
        {masjids.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
}
