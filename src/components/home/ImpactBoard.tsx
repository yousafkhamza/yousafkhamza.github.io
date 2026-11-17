import { impact } from "@/data/profile";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

/** results laid out like a dashboard panel: what changed, by how much, how */
const ImpactBoard = () => {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  return (
    <div ref={ref} className="panel overflow-hidden">
      <div className="hidden md:grid grid-cols-[1.3fr_1.6fr_90px_1.4fr_90px] gap-6 px-6 h-10 items-center border-b border-border label">
        <span>Metric</span>
        <span>Change</span>
        <span className="text-right">Δ</span>
        <span>How</span>
        <span>Where</span>
      </div>
      {impact.map((row, i) => (
        <div
          key={row.metric}
          className="grid grid-cols-[1fr_auto] md:grid-cols-[1.3fr_1.6fr_90px_1.4fr_90px] gap-x-6 gap-y-2 px-5 md:px-6 py-4 border-b border-border last:border-b-0 items-center hover:bg-secondary/50 transition-colors"
        >
          <span className="text-[15px] font-medium">{row.metric}</span>
          <span className="md:hidden font-mono text-[18px] font-semibold text-ok text-right">{row.display}</span>
          <div className="col-span-2 md:col-span-1 h-2.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-ok transition-[width] duration-[1100ms] ease-out"
              style={{ width: inView ? `${row.value}%` : "0%", transitionDelay: `${i * 90}ms` }}
            />
          </div>
          <span className="hidden md:block font-mono text-[17px] font-semibold text-ok text-right">{row.display}</span>
          <span className="col-span-2 md:col-span-1 text-[14px] text-muted-foreground">{row.how}</span>
          <span className={cn("hidden md:block font-mono text-[12px] text-muted-foreground")}>{row.where}</span>
        </div>
      ))}
      <div className="px-5 md:px-6 py-3 bg-secondary/60 font-mono text-[11.5px] text-muted-foreground flex flex-wrap gap-x-6 gap-y-1">
        <span>
          availability <span className="text-foreground">99.9%</span> across 30+ microservices
        </span>
        <span>
          <span className="text-foreground">35</span> production servers behind PAM
        </span>
        <span>
          <span className="text-foreground">100+</span> servers monitored to SLO
        </span>
      </div>
    </div>
  );
};

export default ImpactBoard;
