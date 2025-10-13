"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { UserDashboard } from "@/components/user-dashboard";

export function UserProfile() {
  const { user, loading, refreshUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="glass rounded-2xl p-6 soft-shadow">
        <div className="h-6 bg-white/10 rounded animate-pulse w-1/3 mb-4"></div>
        <div className="space-y-4">
          <div className="h-16 bg-white/5 rounded animate-pulse"></div>
          <div className="h-16 bg-white/5 rounded animate-pulse"></div>
          <div className="h-16 bg-white/5 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 soft-shadow">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass rounded-2xl p-6 soft-shadow">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 soft-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            <p className="opacity-80">Manage your account settings and preferences</p>
          </div>
          <button
            onClick={refreshUser}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4">Account Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm opacity-80">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Name</p>
                <p className="font-medium">{user.name || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Account Status</p>
                <p className={user.is_premium ? "text-green-500 font-medium" : "text-yellow-500 font-medium"}>
                  {user.is_premium ? "Premium User" : "Free User"}
                </p>
              </div>
              {user.is_premium && user.premium_since && (
                <div>
                  <p className="text-sm opacity-80">Premium Since</p>
                  <p className="font-medium">{new Date(user.premium_since).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="glass rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4">Account Timeline</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm opacity-80">Member Since</p>
                <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Last Updated</p>
                <p className="font-medium">{new Date(user.updated_at).toLocaleDateString()}</p>
              </div>
              {user.is_admin && (
                <div className="pt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300">
                    Administrator
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <UserDashboard />
    </div>
  );
}