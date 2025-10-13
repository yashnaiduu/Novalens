"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "bgremover_trial_uses";
const LIMIT = 4;

export function useTrial() {
  const [uses, setUses] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(KEY);
    setUses(raw ? parseInt(raw, 10) || 0 : 0);
  }, []);

  const increment = useCallback(() => {
    if (typeof window === "undefined") return;
    const next = Math.min(LIMIT, uses + 1);
    setUses(next);
    window.localStorage.setItem(KEY, String(next));
  }, [uses]);

  const reset = useCallback(() => {
    if (typeof window === "undefined") return;
    setUses(0);
    window.localStorage.removeItem(KEY);
  }, []);

  return {
    uses,
    limit: LIMIT,
    remaining: Math.max(0, LIMIT - uses),
    isExhausted: uses >= LIMIT,
    increment,
    reset,
  } as const;
}


