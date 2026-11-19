import { useEffect, useState } from "react";

/**
 * USD exchange rates for the services prices. AED is always shown (it is pegged
 * at 3.6725, so the fallback is exact); the visitor's own currency is added when
 * a live rate is available. Rates come from open.er-api.com (free, no key), with
 * a second free source as fallback, cached for the browser session.
 */
const PEG = 3.6725;
const CACHE_KEY = "usd-rates-v2";

export interface AedRate {
  rate: number;
  live: boolean;
  updated?: string;
  /** USD → currency, upper-case codes; only present when a live source answered */
  rates?: Record<string, number>;
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
    const sources: [string, (d: any) => Record<string, number> | undefined][] = [
      ["https://open.er-api.com/v6/latest/USD", (d) => d?.rates],
      [
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
        (d) => (d?.usd ? Object.fromEntries(Object.entries(d.usd).map(([k, v]) => [k.toUpperCase(), Number(v)])) : undefined),
      ],
    ];
    (async () => {
      for (const [url, pick] of sources) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 4000);
        try {
          const res = await fetch(url, { signal: ctrl.signal });
          if (!res.ok) continue;
          const rates = pick(await res.json());
          const rate = Number(rates?.AED);
          if (!rates || !rate || rate < 3 || rate > 4.5) continue;
          const next = { rate, live: true, updated: new Date().toISOString(), rates };
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
