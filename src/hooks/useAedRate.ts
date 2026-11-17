import { useEffect, useState } from "react";

/**
 * USD -> AED for the services prices. The dirham is pegged at 3.6725, so the
 * fallback is exact; the live rate comes from open.er-api.com (free, no key)
 * and is cached for the browser session.
 */
const PEG = 3.6725;
const CACHE_KEY = "usd-aed-rate";

export interface AedRate {
  rate: number;
  live: boolean;
  updated?: string;
}

export function useAedRate(): AedRate {
  const [state, setState] = useState<AedRate>(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached) as AedRate;
    } catch {
      /* ignore */
    }
    return { rate: PEG, live: false };
  });

  useEffect(() => {
    if (state.live) return;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    fetch("https://open.er-api.com/v6/latest/USD", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        const rate = Number(d?.rates?.AED);
        if (!rate || rate < 3 || rate > 4.5) return;
        const next = { rate, live: true, updated: d?.time_last_update_utc as string | undefined };
        setState(next);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        /* offline or blocked: keep the peg */
      })
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [state.live]);

  return state;
}

export const toAed = (usd: number, rate: number) => Math.round(usd * rate);
