// app/dashboard/masjid-admin/MasjidAdminActions.js
"use client";

import { useState, useEffect } from "react";
import { publicAPI } from "@/lib/api";

export default function MasjidAdminActions({ userId }) {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAreas() {
      try {
        const data = await publicAPI.getAreas("CITY_ID_HERE"); // replace with proper cityId
        setAreas(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAreas();
  }, []);

  if (loading) return <p>Loading areas...</p>;

  return (
    <div>
      <h2 className="text-xl mb-2">Manage Areas</h2>
      <ul>
        {areas.map((area) => (
          <li key={area._id}>{area.name}</li>
        ))}
      </ul>
      {/* Add buttons/forms to add/remove announcements */}
    </div>
  );
}
