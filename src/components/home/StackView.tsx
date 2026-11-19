import { useState } from "react";
import { skillGroups } from "@/data/skills";
import { cn } from "@/lib/utils";

type View = "list" | "yaml";

const Yaml = () => (
  <pre className="board p-5 sm:p-6 overflow-x-auto font-code text-[13px] leading-[1.75]">
    <code>
      <span className="text-[hsl(210_8%_55%)]"># stack.yaml — daily: in production now · also: shipped with before</span>
      {"\n"}
      <span className="text-[hsl(150_52%_60%)]">apiVersion</span>: engineer/v1{"\n"}
      <span className="text-[hsl(150_52%_60%)]">kind</span>: Stack{"\n"}
      <span className="text-[hsl(150_52%_60%)]">metadata</span>:{"\n"}
      {"  "}<span className="text-[hsl(150_52%_60%)]">name</span>: yousaf-k-hamza{"\n"}
      <span className="text-[hsl(150_52%_60%)]">spec</span>:{"\n"}
      {skillGroups.map((g) => (
        <span key={g.id}>
          {"  "}<span className="text-[hsl(40_90%_65%)]">{g.id}</span>:{"\n"}
          {"    "}<span className="text-[hsl(150_52%_60%)]">daily</span>: [{g.daily.join(", ")}]{"\n"}
          {g.also.length > 0 && (
            <>
              {"    "}<span className="text-[hsl(150_52%_60%)]">also</span>: [
              <span className="text-[hsl(210_8%_65%)]">{g.also.join(", ")}</span>]{"\n"}
            </>
          )}
        </span>
      ))}
    </code>
  </pre>
);

const GROUP_COLORS = ["cyan", "violet", "green", "amber", "pink", "cyan", "violet", "green", "amber"];

const List = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
    {skillGroups.map((g, i) => (
      <div
        key={g.id}
        className="panel p-5 flex flex-col h-full"
        style={{ ["--c" as string]: `var(--c-${GROUP_COLORS[i]})` }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[14px] font-semibold uppercase tracking-[0.08em] tint">{g.label}</span>
          <span className="font-mono text-[13px] text-muted-foreground">{g.daily.length + g.also.length}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 text-[13.5px] font-semibold">
          {g.daily.map((s) => (
            <span key={s} className="px-2.5 py-1 rounded-md tint-bg">
              {s}
            </span>
          ))}
        </div>
        {g.also.length > 0 && (
          <div className="mt-auto pt-4">
            <div className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground mb-1.5">also</div>
            <div className="flex flex-wrap gap-1.5 text-[14.5px]">
              {g.also.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md border border-border text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

const StackView = () => {
  const [view, setView] = useState<View>("list");
  return (
    <div>
      <div className="inline-flex panel p-0.5 mb-5 font-mono text-[14.5px]" role="tablist" aria-label="Stack view">
        {(["list", "yaml"] as View[]).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={cn(
              "px-3.5 h-8 rounded-[4px] transition-colors",
              view === v ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {v === "list" ? "Plain list" : "stack.yaml"}
          </button>
        ))}
      </div>
      {view === "list" ? <List /> : <Yaml />}
    </div>
  );
};

export default StackView;
