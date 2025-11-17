const BASE_URL = "/api"; // base API path

export const authAPI = {
  login: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include", // important for HttpOnly cookies
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Login failed");
    console.log(result);
    return result;
  },

  register: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Registration failed");
    return result;
  },

  logout: async () => {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Logout failed");
    }

    return await res.json();
  },
  me: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include", // 👈 important
    });

    if (!res.ok) {
      return { loggedIn: false };
    }

    const data = await res.json();
    return data;
  },
};

export const publicAPI = {
  getCities: async () => {
    const res = await fetch(`${BASE_URL}/public/cities`);
    if (!res.ok) throw new Error("Failed to fetch cities");
    return res.json();
  },

  getAreas: async (cityId) => {
    const res = await fetch(`${BASE_URL}/public/areas?cityId=${cityId}`);
    if (!res.ok) throw new Error("Failed to fetch areas");
    return res.json();
  },

  getMasjids: async ({ cityId, areaId, search }) => {
    const params = new URLSearchParams();
    if (cityId) params.append("cityId", cityId);
    if (areaId) params.append("areaId", areaId);
    if (search) params.append("search", search);

    const res = await fetch(`${BASE_URL}/public/masjids?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch masjids");
    return res.json();
  },

  getNearestMasjids: async ({ lat, lng, limit = 5 }) => {
    const res = await fetch(
      `${BASE_URL}/public/masjids/nearest?lat=${lat}&lng=${lng}&limit=${limit}`
    );
    if (!res.ok) throw new Error("Failed to fetch nearest masjids");
    return res.json();
  },

  getMasjidById: async (id) => {
    const res = await fetch(`${BASE_URL}/public/masjids/${id}`);
    if (!res.ok) throw new Error("Failed to fetch masjid details");
    return res.json();
  },

  getGeneralAnnouncements: async () => {
    try {
      const res = await fetch(`${BASE_URL}/public/general-announcements`);
      if (!res.ok) return []; // return empty array if nothing
      return res.json();
    } catch (err) {
      console.error("Failed to fetch general announcements", err);
      return [];
    }
  },

  getMasjidAnnouncements: async (masjidId) => {
    const res = await fetch(
      `${BASE_URL}/public/masjid-announcements?masjidId=${masjidId}`
    );
    if (!res.ok) throw new Error("Failed to fetch masjid announcements");
    return res.json();
  },

  getThoughtOfDay: async () => {
    try {
      const res = await fetch(`${BASE_URL}/public/thought-of-day`);
      if (!res.ok) return []; // return empty array if nothing
      return res.json();
    } catch (err) {
      console.error("Failed to fetch thought of the day", err);
      return [];
    }
  },
};
