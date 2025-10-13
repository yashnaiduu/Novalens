"use client";

import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";

export function usePayment() {
  const { token } = useAuth();
  
  const createCheckoutSession = useCallback(async () => {
    if (!token) {
      throw new Error("User not authenticated");
    }
    
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { id: sessionId } = await response.json();
      return sessionId;
    } catch (error) {
      console.error("Payment error:", error);
      throw error;
    }
  }, [token]);

  return {
    createCheckoutSession,
  };
}