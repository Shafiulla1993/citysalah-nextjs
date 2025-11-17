"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // optional, for SSR

  // Fetch login state from server
  const fetchLoginState = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // 👈 important to send HttpOnly cookies
        cache: "no-store",
      });

      if (!res.ok) {
        setLoggedIn(false);
        setUser(null);
        return;
      }

      const data = await res.json();
      setLoggedIn(data.loggedIn);
      setUser(data.user || null);
    } catch (err) {
      setLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginState();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, user, fetchLoginState, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier usage
export const useAuth = () => useContext(AuthContext);
