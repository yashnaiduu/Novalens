"use client";

import { useState, useEffect } from "react";
import { usePaymentHistory } from "@/hooks/use-payment-history";
import { motion } from "framer-motion";

export function PaymentHistory() {
  const { payments, loading, error } = usePaymentHistory();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300">Error loading payment history: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 soft-shadow">
      <h2 className="text-2xl font-semibold mb-6">Payment History</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-8">
          <p className="opacity-80">No payment history found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div>
                <p className="font-medium">
                  Payment #{payment.id}
                </p>
                <p className="text-sm opacity-80">
                  {new Date(payment.created_at).toLocaleString()}
                </p>
              </div>
              
              <div className="text-right">
                <p className="font-medium">
                  ${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                </p>
                <p className="text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'completed' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {payment.status}
                  </span>
                </p>
              </div>
              
              <div>
                <p className="text-xs opacity-60 truncate max-w-[150px]">
                  {payment.stripe_payment_id}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}