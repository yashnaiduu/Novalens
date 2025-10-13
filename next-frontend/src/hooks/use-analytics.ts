"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export interface UsageRecord {
  id: number;
  user_id: number;
  action: string;
  timestamp: string;
  metadata_json: any;
}

export interface AnalyticsData {
  totalUsage: number;
  usageByDate: { date: string; count: number }[];
  usageByAction: { action: string; count: number }[];
  recentActivity: UsageRecord[];
  metadataStats: Record<string, any>;
}

export function useAnalytics() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsage: 0,
    usageByDate: [],
    usageByAction: [],
    recentActivity: [],
    metadataStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/usage/history", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }
      
      const data: UsageRecord[] = await response.json();
      
      const totalUsage = data.length;
      
      const usageByDate: Record<string, number> = {};
      data.forEach(record => {
        const date = new Date(record.timestamp).toLocaleDateString();
        usageByDate[date] = (usageByDate[date] || 0) + 1;
      });
      
      const usageByAction: Record<string, number> = {};
      data.forEach(record => {
        usageByAction[record.action] = (usageByAction[record.action] || 0) + 1;
      });
      
      const recentActivity = [...data].reverse().slice(0, 10);
      
      const metadataStats: Record<string, any> = {};
      data.forEach(record => {
        if (record.metadata_json) {
          Object.keys(record.metadata_json).forEach(key => {
            if (!metadataStats[key]) {
              metadataStats[key] = {};
            }
            const value = record.metadata_json[key];
            metadataStats[key][value] = (metadataStats[key][value] || 0) + 1;
          });
        }
      });
      
      setAnalytics({
        totalUsage,
        usageByDate: Object.entries(usageByDate).map(([date, count]) => ({ date, count })),
        usageByAction: Object.entries(usageByAction).map(([action, count]) => ({ action, count })),
        recentActivity,
        metadataStats
      });
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
  }, [token, fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refresh: fetchAnalytics
  };
}