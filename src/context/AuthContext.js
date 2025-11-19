"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { httpFetch } from "@/lib/http/fetchClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLoginState = async () => {
    try {
      const data = await httpFetch("/auth/me", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      setLoggedIn(data.loggedIn ?? false);
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
      value={{
        loggedIn,
        setLoggedIn, // 🔥 very important
        user,
        setUser, // 🔥 needed for logout
        loading,
        fetchLoginState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
