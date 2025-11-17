"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/Layouts/DashboardLayout";
import MasjidAnnouncements from "@/components/LeftPanel/MasjidAnnouncements";
import GeneralAnnouncements from "@/components/LeftPanel/GeneralAnnouncements";
import ThoughtOfDay from "@/components/LeftPanel/ThoughtOfDay";
import MasjidSelector from "@/components/RightPanel/MasjidSelector";
import MasjidInfo from "@/components/RightPanel/MasjidInfo";
import PrayerTimingsTable from "@/components/RightPanel/PrayerTimingsTable";
import ContactInfo from "@/components/RightPanel/ContactInfo";
import { publicAPI, authAPI } from "@/lib/api";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [masjids, setMasjids] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedMasjid, setSelectedMasjid] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch current user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authAPI.me();
        if (data.loggedIn !== false) setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 2️⃣ Fetch cities on mount
  useEffect(() => {
    publicAPI.getCities().then(setCities).catch(console.error);
  }, []);

  // 3️⃣ Geolocation + fallback logic
  useEffect(() => {
    if (loading) return;

    const fallbackToUserArea = async () => {
      if (!user?.area || !user?.city) return;
      try {
        setSelectedCity(user.city);
        setSelectedArea(user.area);
        const userMasjids = await publicAPI.getMasjids({ areaId: user.area });
        if (userMasjids?.length) setSelectedMasjid(userMasjids[0]);
        setMasjids(userMasjids);
      } catch (err) {
        console.error("Failed to fetch masjids for user area:", err);
      }
    };

    if (!navigator.geolocation) return fallbackToUserArea();

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const nearest = await publicAPI.getNearestMasjids({
            lat: latitude,
            lng: longitude,
            limit: 5,
          });
          if (nearest?.length) {
            // Directly set nearest masjids and selectedMasjid
            setMasjids(nearest);
            setSelectedMasjid(nearest[0]);
            return;
          }
          fallbackToUserArea();
        } catch (err) {
          console.error("Failed to fetch nearest masjids:", err);
          fallbackToUserArea();
        }
      },
      (err) => {
        console.warn("Geolocation denied or failed:", err);
        fallbackToUserArea();
      }
    );
  }, [user, loading]);

  // 4️⃣ Fetch areas when city changes
  useEffect(() => {
    if (!selectedCity) return;
    publicAPI.getAreas(selectedCity).then(setAreas).catch(console.error);
    setSelectedArea(""); // reset area when city changes
    setMasjids([]);
    setSelectedMasjid(null);
  }, [selectedCity]);

  // 5️⃣ Fetch masjids when area changes
  useEffect(() => {
    if (!selectedArea) return;
    publicAPI
      .getMasjids({ areaId: selectedArea })
      .then(setMasjids)
      .catch(console.error);
    setSelectedMasjid(null);
  }, [selectedArea]);

  if (loading) return <p className="p-4 text-center">Loading...</p>;

  return (
    <DashboardLayout
      left={
        <>
          <MasjidAnnouncements masjidId={selectedMasjid?._id} />
          <GeneralAnnouncements />
          <ThoughtOfDay />
        </>
      }
      right={
        <>
          <MasjidSelector
            cities={cities}
            areas={areas}
            masjids={masjids}
            selectedCity={selectedCity}
            selectedArea={selectedArea}
            selectedMasjid={selectedMasjid}
            setSelectedCity={setSelectedCity}
            setSelectedArea={setSelectedArea}
            setSelectedMasjid={setSelectedMasjid}
          />
          <MasjidInfo masjid={selectedMasjid} />
          <PrayerTimingsTable prayerTimings={selectedMasjid?.prayerTimings} />
          <ContactInfo contacts={selectedMasjid?.contacts} />

          {/* Role-based panels */}
          {user?.role === "masjid_admin" && <MasjidAdminPanel />}
          {user?.role === "super_admin" && <SuperAdminPanel />}
        </>
      }
    />
  );
}
