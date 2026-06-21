"use client";

import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";
import { API_BASE } from "@/lib/api";

export function StartupMessage() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Ping the backend to wake it up immediately
    fetch(`${API_BASE}/api/auth/profile`, { 
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }).catch(() => {
        console.log("Wake up ping sent");
    });

    // Show popup only after page is fully loaded (not during init)
    const hasSeenMessage = sessionStorage.getItem("hasSeenStartupMessage");
    if (!hasSeenMessage) {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem("hasSeenStartupMessage", "true");
      }, 1000);

      // Auto-dismiss after 6 seconds
      const dismissTimer = setTimeout(() => {
        setIsVisible(false);
      }, 7000); // 1s delay + 6s visible

      return () => {
        clearTimeout(showTimer);
        clearTimeout(dismissTimer);
      };
    }
  }, []);

  if (!mounted || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg rounded-xl p-4 flex items-start gap-3 relative overflow-hidden backdrop-blur-xl transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 dark:from-zinc-800/50 to-transparent pointer-events-none transition-colors" />
        <div className="flex-shrink-0 relative z-10">
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 transition-colors">
            <Info className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
          </div>
        </div>
        <div className="flex-1 pt-1 relative z-10">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 transition-colors">System Notice</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed transition-colors">
            This is a solo project and is not funded, so the backend takes 20 to 30 seconds to wake up. Thank you for your patience!
          </p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors p-1 relative z-10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
