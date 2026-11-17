import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { impact } from "@/data/profile";
import { projects } from "@/data/projects";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type Tab = "work" | "oss";

const ROW_COLORS = ["pink", "cyan", "violet", "amber", "green", "cyan"];
const TILE_COLORS = ["green", "violet", "cyan", "pink", "amber", "cyan"];

/** numbers derived from the project list, so they update when a project is added */
const ossStats = () => {
  const count = (c: string) => projects.filter((p) => p.categories.includes(c as never)).length;
  return [
    { value: projects.length, label: "open-source projects shipped", to: "/projects" },
    { value: count("AI"), label: "self-hosted AI / LLM tools", to: "/projects?filter=ai" },
    { value: count("Kubernetes"), label: "Kubernetes tools", to: "/projects?filter=kubernetes" },
    { value: count("Security"), label: "security & compliance tools", to: "/projects?filter=security" },
    { value: projects.filter((p) => p.demo).length, label: "with a live demo you can open", to: "/projects" },
    { value: count("AWS"), label: "AWS tools", to: "/projects?filter=aws" },
  ];
};

const WorkBoard = ({ inView }: { inView: boolean }) => (
  <div>
    <div className="hidden md:grid grid-cols-[1.25fr_1.5fr_96px_1.5fr] gap-6 px-6 h-10 items-center border-b border-border label">
      <span>Metric</span>
      <span>Change</span>
      <span className="text-right">Δ</span>
      <span>How</span>
    </div>
    {impact.map((row, i) => (
      <div
        key={row.metric}
        style={{ ["--c" as string]: `var(--c-${ROW_COLORS[i % ROW_COLORS.length]})` }}
        className="grid grid-cols-[1fr_auto] md:grid-cols-[1.25fr_1.5fr_96px_1.5fr] gap-x-6 gap-y-2 px-5 md:px-6 py-4 border-b border-border last:border-b-0 items-center hover:bg-secondary/50 transition-colors"
      >
        <span className="text-[15px] font-medium">{row.metric}</span>
        <span className="md:hidden font-mono text-[18px] font-bold tint text-right">{row.display}</span>
        <div className="col-span-2 md:col-span-1 h-2.5 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-[1100ms] ease-out"
            style={{
              width: inView ? `${row.value}%` : "0%",
              transitionDelay: `${i * 90}ms`,
              background: "linear-gradient(90deg, hsl(var(--c) / 0.55), hsl(var(--c)))",
              boxShadow: "0 0 16px hsl(var(--c) / 0.5)",
            }}
          />
        </div>
        <span className="hidden md:block font-mono text-[18px] font-bold tint text-right">{row.display}</span>
        <span className="col-span-2 md:col-span-1 text-[14px] text-muted-foreground">{row.how}</span>
      </div>
    ))}
    <div className="px-5 md:px-6 py-3 bg-secondary/60 font-mono text-[11.5px] text-muted-foreground flex flex-wrap gap-x-6 gap-y-1">
      <span>
        <span className="text-c-green font-semibold">99.9%</span> availability across 30+ microservices
      </span>
      <span>
        <span className="text-c-pink font-semibold">50+</span> microservices on one Kubernetes platform
      </span>
      <span>
        <span className="text-c-violet font-semibold">35</span> production servers behind PAM
      </span>
    </div>
  </div>
);

const OssBoard = ({ inView }: { inView: boolean }) => (
  <div className="grid grid-cols-2 lg:grid-cols-3">
    {ossStats().map((s, i) => (
      <Link
        key={s.label}
        to={s.to}
        style={{ ["--c" as string]: `var(--c-${TILE_COLORS[i % TILE_COLORS.length]})` }}
        className="group p-5 sm:p-6 border-b border-r border-border [&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 hover:bg-secondary/50 transition-colors"
      >
        <div
          className={cn(
            "font-display text-[44px] sm:text-[52px] font-extrabold leading-none tracking-tight tint transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          {s.value}
        </div>
        <div className="mt-2 text-[14px] text-muted-foreground flex items-start justify-between gap-2">
          <span>{s.label}</span>
          <ArrowUpRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
    ))}
  </div>
);

const ImpactBoard = () => {
  const [tab, setTab] = useState<Tab>("work");
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  return (
    <div ref={ref} className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-3 sm:px-4 h-12 border-b border-border bg-secondary/40">
        <div className="flex gap-1 font-mono text-[12.5px]" role="tablist" aria-label="Impact view">
          {(
            [
              ["work", "At work"],
              ["oss", "Open source"],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "h-8 px-3 rounded-[4px] transition-colors",
                tab === id ? "bg-yousaf text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="hidden sm:inline font-mono text-[11.5px] text-muted-foreground">
          {tab === "work" ? "production platforms" : "github.com/yousafkhamza"}
        </span>
      </div>
      {tab === "work" ? <WorkBoard inView={inView} /> : <OssBoard inView={inView} />}
    </div>
  );
};

export default ImpactBoard;
