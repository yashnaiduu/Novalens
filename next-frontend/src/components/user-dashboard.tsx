"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { PaymentHistory } from "@/components/payment-history";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";

interface UsageRecord {
  id: number;
  action: string;
  timestamp: string;
  metadata_json: any;
}

export function UserDashboard() {
  const { user, token } = useAuth();
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "payments">("overview");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUsageData = async () => {
      if (!token) return;
      
      try {
        const response = await fetch("/api/usage/history", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch usage data");
        }
        
        const data: UsageRecord[] = await response.json();
        setUsageRecords(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching usage data:", error);
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [token]);

  const processDataForChart = () => {
    if (!usageRecords.length) return [];
    
    const groupedByDate: Record<string, number> = {};
    
    usageRecords.forEach(record => {
      const date = new Date(record.timestamp).toLocaleDateString();
      groupedByDate[date] = (groupedByDate[date] || 0) + 1;
    });
    
    return Object.entries(groupedByDate).map(([date, count]) => ({
      date,
      count
    }));
  };

  const chartData = processDataForChart();

  if (!mounted) {
    return (
      <div className="glass rounded-2xl p-6 soft-shadow">
        <div className="h-6 bg-white/10 rounded animate-pulse w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-4 h-24 bg-white/5 animate-pulse"></div>
          ))}
        </div>
        <div className="glass rounded-xl p-4 h-64 bg-white/5 animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass rounded-2xl p-6 soft-shadow">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 soft-shadow">
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "overview"
              ? "bg-primary text-white"
              : "bg-white/10 hover:bg-white/20"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "analytics"
              ? "bg-primary text-white"
              : "bg-white/10 hover:bg-white/20"
          }`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === "payments"
              ? "bg-primary text-white"
              : "bg-white/10 hover:bg-white/20"
          }`}
          onClick={() => setActiveTab("payments")}
        >
          Payment History
        </button>
      </div>

      {activeTab === "overview" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Account Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-xl p-4">
              <h3 className="text-lg font-medium mb-2">Account Status</h3>
              <p className={user.is_premium ? "text-green-500" : "text-yellow-500"}>
                {user.is_premium ? "Premium User" : "Free User"}
              </p>
              {user.is_premium && user.premium_since && (
                <p className="text-sm opacity-80 mt-1">
                  Since: {new Date(user.premium_since).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <div className="glass rounded-xl p-4">
              <h3 className="text-lg font-medium mb-2">Total Usage</h3>
              <p className="text-2xl font-bold">{usageRecords.length}</p>
              <p className="text-sm opacity-80">background removals</p>
            </div>
            
            <div className="glass rounded-xl p-4">
              <h3 className="text-lg font-medium mb-2">Member Since</h3>
              <p>{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="glass rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-white/10 rounded animate-pulse"></div>
                ))}
              </div>
            ) : usageRecords.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {[...usageRecords].reverse().slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                    <div>
                      <p className="font-medium">{record.action.replace('_', ' ')}</p>
                      <p className="text-sm opacity-80">
                        {new Date(record.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="opacity-80">No activity yet.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "analytics" && <AnalyticsDashboard />}

      {activeTab === "payments" && <PaymentHistory />}
    </div>
  );
}