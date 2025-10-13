"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

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

export function useUsers() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    // Only admins can fetch all users
    if (!token || !user?.is_premium) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const getUser = useCallback(async (userId: number) => {
    if (!token) return null;
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      
      const userData: User = await response.json();
      return userData;
    } catch (err) {
      console.error("Error fetching user:", err);
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (token && user?.is_premium) {
      fetchUsers();
    }
  }, [token, user, fetchUsers]);

  return {
    users,
    loading,
    error,
    refresh: fetchUsers,
    getUser
  };
}