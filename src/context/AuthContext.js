"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // optional, for SSR

  const fetchLoginState = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setLoggedIn(data.loggedIn);
    } catch {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchLoginState();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedIn, setLoggedIn, fetchLoginState, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier usage
export const useAuth = () => useContext(AuthContext);
