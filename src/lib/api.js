const BASE_URL = "/api"; // base API path

export const authAPI = {
  login: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json(); // parse JSON once
    if (!res.ok) throw new Error(result.message || "Login failed");
    return result; // parsed JSON
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
};
