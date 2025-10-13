"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { CheckCircle, Crown } from "lucide-react";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Refresh user data to get updated premium status
      await refreshUser();
      setLoading(false);
    };

    // Check payment status after a short delay to allow webhook to process
    const timer = setTimeout(() => {
      checkPaymentStatus();
    }, 3000);

    return () => clearTimeout(timer);
  }, [user, refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
          <h1 className="text-2xl font-bold">Verifying Payment...</h1>
          <p className="mt-2 opacity-80">Please wait while we verify your payment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass rounded-2xl p-8 soft-shadow text-center"
      >
        <div className="mx-auto h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="mb-6 opacity-80">
          Thank you for your purchase. You now have lifetime access to all premium features.
        </p>
        
        <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-3 mb-6">
          <Crown className="h-5 w-5 text-primary" />
          <span className="font-medium text-primary">Premium Access Activated</span>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="gradient-border w-full rounded-xl px-4 py-3 font-semibold text-[--foreground]"
          >
            <span className="relative z-10 block rounded-[calc(theme(borderRadius.xl)-2px)] bg-[--surface] px-4 py-3">
              Start Using Premium Features
            </span>
          </button>
          
          <button
            onClick={() => router.push("/")}
            className="w-full rounded-xl border px-4 py-3 text-sm opacity-80 hover:opacity-100"
          >
            Return to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}