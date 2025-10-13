"use client";

import { useCallback, useEffect, useState } from "react";

export interface User {
  id: number;
  email: string;
  name?: string;
  is_premium: boolean;
  is_admin?: boolean;
  premium_since?: string;
  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    
    const userData = window.localStorage.getItem("bgremover_user");
    const tokenData = window.localStorage.getItem("bgremover_token");
    
    if (userData && tokenData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setToken(tokenData);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, name?: string) => {
    try {
      let response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.status === 404) {
        response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name }),
        });
      }
      
      if (!response.ok) {
        throw new Error("Authentication failed");
      }
      
      const { user: userData, token: userToken } = await response.json();
      window.localStorage.setItem("bgremover_user", JSON.stringify(userData));
      window.localStorage.setItem("bgremover_token", userToken);
      setUser(userData);
      setToken(userToken);
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window === "undefined") return;
    
    window.localStorage.removeItem("bgremover_user");
    window.localStorage.removeItem("bgremover_token");
    setUser(null);
    setToken(null);
  }, []);

  const upgradeToPremium = useCallback(() => {
    if (typeof window === "undefined" || !user) return;
    
    const updatedUser = {
      ...user,
      is_premium: true,
      premium_since: new Date().toISOString()
    };
    
    window.localStorage.setItem("bgremover_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, [user]);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await fetch("/api/auth/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
      }
      
      const userData: User = await response.json();
      window.localStorage.setItem("bgremover_user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error refreshing user:", error);
      if (error instanceof Error && (error.message.includes("401") || error.message.includes("403"))) {
        logout();
      }
      else if (error instanceof Error && token) {
        if (error.message.includes("Failed to fetch user profile")) {
          logout();
        }
      }
    }
  }, [token, logout]);

  return {
    user,
    token,
    loading,
    login,
    logout,
    upgradeToPremium,
    refreshUser
  };
}