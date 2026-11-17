import { useEffect, useState } from "react";

/**
 * USD -> AED for the services prices. The dirham is pegged at 3.6725, so the
 * fallback is exact; the live rate comes from open.er-api.com (free, no key)
 * (falling back to a second free source) and is cached for the browser session.
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
    let cancelled = false;
    // two free, key-less sources; the first that answers wins
    const sources: [string, (d: any) => number | undefined][] = [
      ["https://open.er-api.com/v6/latest/USD", (d) => d?.rates?.AED],
      ["https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json", (d) => d?.usd?.aed],
    ];
    (async () => {
      for (const [url, pick] of sources) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 4000);
        try {
          const res = await fetch(url, { signal: ctrl.signal });
          if (!res.ok) continue;
          const rate = Number(pick(await res.json()));
          if (!rate || rate < 3 || rate > 4.5) continue;
          const next = { rate, live: true, updated: new Date().toISOString() };
          if (!cancelled) setState(next);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
          } catch {
            /* ignore */
          }
          return;
        } catch {
          /* try the next source */
        } finally {
          clearTimeout(timer);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [state.live]);

  return state;
}

export const toAed = (usd: number, rate: number) => Math.round(usd * rate);
