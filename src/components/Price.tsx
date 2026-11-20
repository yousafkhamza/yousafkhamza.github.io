import { useAedRate } from "@/hooks/useAedRate";
import { formatMoney } from "@/lib/visitor";
import { useVisitor } from "@/hooks/useVisitor";
import { cn } from "@/lib/utils";

/** converted prices read as round numbers: AED 129 → 130, ₹2,940 → 2,950, £28 → 30 */
export const roundNice = (n: number) => {
  const step = n < 100 ? 5 : n < 1000 ? 10 : n < 10000 ? 50 : 100;
  return Math.max(step, Math.round(n / step) * step);
};

/**
 * One price, in the visitor's own currency: AED in the UAE, ₹ in India, PKR in
 * Pakistan, € in the euro area, £ in the UK, $ in the US. Prices are set in USD;
 * AED uses the fixed peg until the live rate arrives, other currencies show $
 * until then rather than guess.
 */
/** the price text a visitor sees, as a plain function (the contact form reuses it) */
export const priceFor = (usd: number, cur: string, aedRate: number, rates: Record<string, number> | undefined, live: boolean) => {
  if (cur === "USD") return { text: formatMoney(usd, "USD"), cur: "USD", converted: false, live };
  if (cur === "AED") return { text: `AED ${roundNice(usd * aedRate).toLocaleString("en")}`, cur, converted: true, live };
  const r = rates?.[cur];
  if (!r) return { text: formatMoney(usd, "USD"), cur: "USD", converted: false, live };
  return { text: formatMoney(roundNice(usd * r), cur), cur, converted: true, live };
};

export const usePrice = (usd: number) => {
  const { rate, rates, live } = useAedRate();
  const cur = useVisitor().currency;
  return priceFor(usd, cur, rate, rates, live);
};

const Price = ({ usd, unit, className, compact = false }: { usd: number; unit: string; className?: string; compact?: boolean }) => {
  const p = usePrice(usd);
  return (
    <span
      className={cn("inline-flex items-baseline gap-x-1.5 gap-y-0.5 flex-wrap", className)}
      title={p.converted ? `Set at $${usd}; shown in ${p.cur} at ${p.live ? "today's rate" : "the fixed USD peg"}` : undefined}
    >
      <span className={cn("font-display font-bold tint tabular-nums", compact ? "text-[18px]" : "text-[30px] leading-none")} data-testid="price">
        {p.text}
      </span>
      <span className="text-[13px] text-muted-foreground">{unit}</span>
    </span>
  );
};

export default Price;
