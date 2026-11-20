import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { statusComponents } from "@/data/status";
import { cn } from "@/lib/utils";

/**
 * Impact as a status page: every area I work in is a "component" with one bar per
 * year since my first role. Green from the year it first shows up in a role. Hover
 * (or tap) a bar for where I was that year; open a row for the results behind it.
 * Years and companies come from experience.ts, so the bars grow on their own.
 */
const yearOf = (iso: string) => Number(iso.slice(0, 4));

const StatusBoard = () => {
  const now = new Date().getFullYear();
  const first = Math.min(...experiences.map((e) => yearOf(e.start)));
  const years = useMemo(() => Array.from({ length: now - first + 1 }, (_, i) => first + i), [first, now]);

  // where I was in a given year, oldest first: "Alamy → Pay10 UAE"
  const whereIn = (y: number) =>
    [...experiences]
      .reverse()
      .filter((e) => yearOf(e.start) <= y && (e.end ? yearOf(e.end) : now) >= y)
      .map((e) => e.company)
      .join(" → ");

  const [open, setOpen] = useState<string | null>("kubernetes");
  const [tip, setTip] = useState<string>("");

  const count = (c: string) => projects.filter((p) => p.categories.includes(c as never)).length;
  const oss = [
    { v: projects.length, l: "open-source projects", to: "/projects" },
    { v: projects.filter((p) => p.demo).length, l: "with a live demo", to: "/projects" },
    { v: count("AI"), l: "AI / LLM tools", to: "/projects?filter=ai" },
    { v: count("Kubernetes"), l: "Kubernetes tools", to: "/projects?filter=kubernetes" },
    { v: count("Security"), l: "security tools", to: "/projects?filter=security" },
    { v: count("AWS"), l: "AWS tools", to: "/projects?filter=aws" },
  ];

  return (
    <div className="panel overflow-hidden">
      {/* the banner every status page opens with, in the site's own signage: dark strip, yellow and white type */}
      <div className="flex items-start sm:items-center gap-3.5 px-5 sm:px-6 py-4 bg-strip text-white" data-testid="status-banner">
        <span className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-strip-ok/15 text-strip-ok">
          <Check className="w-5 h-5" strokeWidth={3} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 font-display text-[21px] sm:text-[23px] font-bold uppercase tracking-[0.05em] leading-tight text-strip-fg">
            <span className="w-2.5 h-2.5 rounded-full bg-strip-ok blink" aria-hidden />
            All systems operational
          </div>
          <div className="mt-0.5 text-[15px] text-strip-dim">
            {now - first}+ years in production, {experiences.length} roles. Open to Senior DevOps, Platform and SRE roles.
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 pt-3.5 pb-2.5 border-b border-border">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-[19px] font-bold">Components</h3>
          <span className="text-[14px] text-muted-foreground">Hover a bar for the year, open a row for where each result came from.</span>
        </div>
        {/* the year scale, once, lined up with the bars; the current year reads "now" in yellow, like the board */}
        <div className="mt-2.5 flex gap-[3px] sm:gap-1 font-display text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.1em] text-muted-foreground tabular-nums" aria-hidden>
          {years.map((y) => (
            <span key={y} className={cn("flex-1 text-center", y === now && "text-yousaf")}>
              {y === now ? (
                "Now"
              ) : (
                <>
                  <span className="hidden sm:inline">{y}</span>
                  <span className="sm:hidden">'{String(y).slice(2)}</span>
                </>
              )}
            </span>
          ))}
        </div>
      </div>

      <div onMouseLeave={() => setTip("")}>
        {statusComponents.map((c) => {
          const isOpen = open === c.id;
          const active = years.filter((y) => y >= c.from).length;
          return (
            <div key={c.id} className="border-b border-border" data-testid="status-row">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : c.id)}
                aria-expanded={isOpen}
                aria-label={`${c.name}: in use ${c.from} to today, ${active} of ${years.length} years`}
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 items-center w-full px-5 sm:px-6 py-3 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="flex items-center gap-2 font-semibold text-[16px]">
                  <ChevronRight className={cn("w-4 h-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-90")} />
                  {c.name}
                </span>
                <span className="font-display text-[14px] font-bold uppercase tracking-[0.08em] text-ok whitespace-nowrap">
                  Operational · {active} yrs
                </span>
                {/* the results, always visible: a recruiter should not have to click for the numbers */}
                <span className="col-span-2 -mt-1 pl-6 text-[14.5px] leading-snug text-muted-foreground" data-testid="status-summary">
                  {c.evidence.map((e, i) => (
                    <span key={e.label}>
                      {i > 0 && <span className="mx-1.5 opacity-50">·</span>}
                      <span className="font-semibold text-foreground">{e.value}</span> {e.short}
                    </span>
                  ))}
                </span>
                <span className="col-span-2 flex items-end gap-[3px] sm:gap-1 h-4" aria-hidden>
                  {years.map((y) => {
                    const on = y >= c.from;
                    const label = `${c.name} · ${y} · ${on ? `in use at ${whereIn(y)}` : "not yet"}`;
                    return (
                      <span
                        key={y}
                        title={label}
                        onMouseEnter={() => setTip(label)}
                        className={cn(
                          "flex-1 h-full rounded-[3px] transition-transform hover:scale-y-125 origin-bottom",
                          // softer green so seven rows do not shout; this year in signage yellow, like BOARDING on the board
                          !on ? "bg-border/80" : y === now ? "bg-sign" : "bg-ok/70"
                        )}
                      />
                    );
                  })}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pl-11 sm:pl-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
                  {c.evidence.map((e) => (
                    <div key={e.label} className="rounded-xl border border-border bg-secondary/60 px-4 py-3">
                      <div className="font-display text-[26px] font-bold leading-none">{e.value}</div>
                      <div className="mt-1.5 text-[14.5px] leading-snug text-muted-foreground">{e.label}</div>
                      {e.where && <div className="mt-1.5 text-[13px] font-semibold text-yousaf">{e.where}</div>}
                    </div>
                  ))}
                  {c.id === "ai" && (
                    <Link to="/projects?filter=ai" className="rounded-xl border border-border bg-secondary/60 px-4 py-3 hover:border-foreground/40 transition-colors">
                      <div className="font-display text-[26px] font-bold leading-none">{count("AI")}</div>
                      <div className="mt-1.5 text-[14.5px] leading-snug text-muted-foreground">open-source AI tools with live demos</div>
                      <div className="mt-1.5 text-[13px] font-semibold text-yousaf inline-flex items-center gap-1">
                        See them <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-5 sm:px-6 py-2.5 min-h-[40px] text-[14px] text-muted-foreground" aria-live="polite" data-testid="status-tip">
        {tip || "Green from the year an area first shows up in my roles. Yellow is this year."}
      </div>

      {/* open-source, counted from the project list */}
      <div className="border-t border-border bg-secondary/50 px-5 sm:px-6 py-4">
        <div className="label mb-2.5">Open source · github.com/yousafkhamza</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {oss.map((o) => (
            <Link key={o.l} to={o.to} className="rounded-xl border border-border bg-card px-3.5 py-2.5 hover:border-foreground/40 transition-colors">
              <div className="font-display text-[24px] font-bold leading-none">{o.v}</div>
              <div className="mt-1 text-[13.5px] text-muted-foreground leading-snug">{o.l}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusBoard;
