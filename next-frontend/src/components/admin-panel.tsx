"use client";

import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export function AdminPanel() {
  const { users, loading, error, refresh } = useUsers();
  const { user: currentUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show admin panel to admin users
  if (!currentUser?.is_admin) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="glass rounded-2xl p-6 soft-shadow">
        <div className="h-6 bg-white/10 rounded animate-pulse w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 soft-shadow">
        <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300">Error loading users: {error}</p>
          <button 
            onClick={refresh}
            className="mt-2 px-4 py-2 bg-primary rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 soft-shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <button 
          onClick={refresh}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Created</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="py-3 px-4">{user.id}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.name || "-"}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.is_premium 
                        ? "bg-green-500/20 text-green-300" 
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}>
                      {user.is_premium ? "Premium" : "Free"}
                    </span>
                    {user.is_admin && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 ml-2">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm opacity-80">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-sm px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors">
                      View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="text-center py-8 opacity-80">
              <p>No users found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}