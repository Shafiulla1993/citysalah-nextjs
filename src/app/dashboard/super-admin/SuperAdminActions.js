// app/dashboard/super-admin/SuperAdminActions.js
"use client";

import { useState, useEffect } from "react";
import { publicAPI } from "@/lib/api/public";

export default function SuperAdminActions({ userId }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      try {
        const data = await publicAPI.getCities();
        setCities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  if (loading) return <p>Loading cities...</p>;

  return (
    <div>
      <h2 className="text-xl mb-2">Manage Cities</h2>
      <ul>
        {cities.map((city) => (
          <li key={city._id}>{city.name}</li>
        ))}
      </ul>
      {/* Add buttons/forms to add/remove cities */}
    </div>
  );
}
