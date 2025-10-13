"use client";

import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { motion } from "framer-motion";

export function AnalyticsDashboard() {
  const { analytics, loading, error } = useAnalytics();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="glass rounded-2xl p-6 soft-shadow">
        <div className="h-6 bg-white/10 rounded animate-pulse w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-xl p-4 h-64 bg-white/5 animate-pulse"></div>
          <div className="glass rounded-xl p-4 h-64 bg-white/5 animate-pulse"></div>
        </div>
        <div className="glass rounded-xl p-4 h-64 bg-white/5 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 soft-shadow">
        <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300">Error loading analytics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 soft-shadow">
      <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-xl p-4">
              <h3 className="text-lg font-medium mb-2">Total Usage</h3>
              <p className="text-3xl font-bold">{analytics.totalUsage}</p>
              <p className="text-sm opacity-80">background removals</p>
            </div>
            
            <div className="glass rounded-xl p-4">
              <h3 className="text-lg font-medium mb-2">Active Days</h3>
              <p className="text-3xl font-bold">{analytics.usageByDate.length}</p>
              <p className="text-sm opacity-80">days of usage</p>
            </div>
            
            <div className="glass rounded-xl p-4">
              <h3 className="text-lg font-medium mb-2">Actions</h3>
              <p className="text-3xl font-bold">{analytics.usageByAction.length}</p>
              <p className="text-sm opacity-80">different actions</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="glass rounded-xl p-4">
              <h3 className="text-lg font-medium mb-4">Usage Over Time</h3>
              {analytics.usageByDate.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {analytics.usageByDate.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-32 text-sm opacity-80">{item.date}</div>
                      <div className="flex-1 ml-2">
                        <div className="h-4 bg-primary/20 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (item.count / Math.max(...analytics.usageByDate.map(d => d.count)) * 100))}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div className="w-8 text-right text-sm">{item.count}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center opacity-80">
                  <p>No usage data yet.</p>
                </div>
              )}
            </div>
            
            <div className="glass rounded-xl p-4">
              <h3 className="text-lg font-medium mb-4">Actions Breakdown</h3>
              {analytics.usageByAction.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {analytics.usageByAction.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-32 text-sm opacity-80">{item.action.replace('_', ' ')}</div>
                      <div className="flex-1 ml-2">
                        <div className="h-4 bg-primary/20 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-secondary rounded-full" 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (item.count / Math.max(...analytics.usageByAction.map(a => a.count)) * 100))}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          ></motion.div>
                        </div>
                      </div>
                      <div className="w-8 text-right text-sm">{item.count}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center opacity-80">
                  <p>No action data yet.</p>
                </div>
              )}
            </div>
          </div>
          
          {Object.keys(analytics.metadataStats).length > 0 && (
            <div className="glass rounded-xl p-4 mb-8">
              <h3 className="text-lg font-medium mb-4">Metadata Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analytics.metadataStats).map(([key, values]) => (
                  <div key={key} className="glass rounded-lg p-3">
                    <h4 className="font-medium mb-2">{key}</h4>
                    <div className="space-y-1">
                      {Object.entries(values as Record<string, number>).map(([value, count]) => (
                        <div key={value} className="flex justify-between text-sm">
                          <span className="opacity-80">{value}</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="glass rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            {analytics.recentActivity.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {analytics.recentActivity.map((record) => (
                  <div key={record.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                    <div>
                      <p className="font-medium">{record.action.replace('_', ' ')}</p>
                      <p className="text-sm opacity-80">
                        {new Date(record.timestamp).toLocaleString()}
                      </p>
                      {record.metadata_json && (
                        <div className="text-xs mt-1 flex flex-wrap gap-1">
                          {Object.entries(record.metadata_json).map(([key, value]) => (
                            <span key={key} className="inline-block bg-white/10 px-2 py-1 rounded">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
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
    </div>
  );
}