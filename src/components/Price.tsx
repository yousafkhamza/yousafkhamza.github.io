import { useAedRate, toAed } from "@/hooks/useAedRate";
import { cn } from "@/lib/utils";

/** "$35 / hour" with the AED amount at today's rate next to it */
const Price = ({ usd, unit, className, compact = false }: { usd: number; unit: string; className?: string; compact?: boolean }) => {
  const { rate, live } = useAedRate();
  return (
    <span className={cn("inline-flex items-baseline gap-1.5 flex-wrap", className)}>
      <span className={cn("font-display font-bold tint", compact ? "text-[18px]" : "text-[30px] leading-none")}>${usd}</span>
      <span className="text-[13px] text-muted-foreground">{unit}</span>
      <span
        className="font-mono text-[14px] text-muted-foreground"
        title={live ? `Converted at 1 USD = ${rate.toFixed(4)} AED (live rate)` : "Converted at the fixed peg, 1 USD = 3.6725 AED"}
      >
        ≈ AED {toAed(usd, rate)}
      </span>
    </span>
  );
};

export default Price;
