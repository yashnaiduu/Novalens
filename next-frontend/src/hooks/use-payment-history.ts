"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export interface PaymentRecord {
  id: number;
  user_id: number;
  stripe_payment_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export function usePaymentHistory() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentHistory = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/payments/history", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch payment history");
      }
      
      const data: PaymentRecord[] = await response.json();
      setPayments(data);
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchPaymentHistory();
    }
  }, [token, fetchPaymentHistory]);

  return {
    payments,
    loading,
    error,
    refresh: fetchPaymentHistory
  };
}