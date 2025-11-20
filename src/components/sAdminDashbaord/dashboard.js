// src/components/Dashboard/SuperAdminDashboard.js
"use client";

import React from "react";
import DashboardCard from "./card";

export default function SuperAdminDashboard({
  cities = [],
  areas = [],
  masjids = [],
  users = [],
}) {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Cities Card */}
      <DashboardCard
        title="Cities"
        count={cities.length}
        items={cities}
        addLink="/dashboard/super-admin/cities/add"
      />

      {/* Areas Card */}
      <DashboardCard
        title="Areas"
        count={areas.length}
        items={areas}
        addLink="/dashboard/super-admin/areas/add"
      />

      {/* Masjids Card */}
      <DashboardCard
        title="Masjids"
        count={masjids.length}
        items={masjids}
        addLink="/dashboard/super-admin/masjids/add"
      />

      {/* Masjids Card */}
      <DashboardCard
        title="Users"
        count={users.length}
        items={users}
        addLink="/dashboard/super-admin/users/add"
      />
    </div>
  );
}
