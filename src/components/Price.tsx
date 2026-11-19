import { useMemo } from "react";
import { useAedRate, toAed } from "@/hooks/useAedRate";
import { formatMoney, visitorCurrency } from "@/lib/visitor";
import { cn } from "@/lib/utils";

/** "$35 / hour ≈ AED 129", plus the visitor's own currency (₹, £, €…) when we know it and have a live rate */
const Price = ({ usd, unit, className, compact = false }: { usd: number; unit: string; className?: string; compact?: boolean }) => {
  const { rate, live, rates } = useAedRate();
  const cur = useMemo(() => visitorCurrency(), []);
  const local = cur && rates?.[cur] ? usd * rates[cur] : null;
  return (
    <span className={cn("inline-flex items-baseline gap-x-1.5 gap-y-0.5 flex-wrap", className)}>
      <span className={cn("font-display font-bold tint", compact ? "text-[18px]" : "text-[30px] leading-none")}>${usd}</span>
      <span className="text-[13px] text-muted-foreground">{unit}</span>
      <span
        className="font-mono text-[14px] text-muted-foreground"
        title={live ? `Converted at 1 USD = ${rate.toFixed(4)} AED (live rate)` : "Converted at the fixed peg, 1 USD = 3.6725 AED"}
      >
        ≈ AED {toAed(usd, rate)}
      </span>
      {local !== null && cur && (
        <span className="font-mono text-[14px] text-muted-foreground" title={`Your currency, at 1 USD = ${rates![cur].toFixed(2)} ${cur} (live rate)`}>
          · ≈ {formatMoney(local, cur)}
        </span>
      )}
    </span>
  );
};

export default Price;
