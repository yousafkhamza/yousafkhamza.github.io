import { useState } from "react";
import { skillGroups } from "@/data/skills";
import { cn } from "@/lib/utils";

type View = "list" | "yaml";

const Yaml = () => (
  <pre className="panel bg-[hsl(210_14%_9%)] dark:bg-[hsl(210_14%_5%)] text-[hsl(40_16%_88%)] border-transparent p-5 sm:p-6 overflow-x-auto font-mono text-[13px] leading-[1.75]">
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

const List = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
    {skillGroups.map((g) => (
      <div key={g.id} className="border-r border-b border-border p-5 bg-card">
        <div className="label mb-3">{g.label}</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[15px] font-medium">
          {g.daily.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        {g.also.length > 0 && (
          <div className="mt-2.5 text-[13.5px] text-muted-foreground leading-relaxed">also {g.also.join(", ")}</div>
        )}
      </div>
    ))}
  </div>
);

const StackView = () => {
  const [view, setView] = useState<View>("list");
  return (
    <div>
      <div className="inline-flex panel p-0.5 mb-5 font-mono text-[12.5px]" role="tablist" aria-label="Stack view">
        {(["list", "yaml"] as View[]).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={cn(
              "px-3.5 h-8 rounded-[4px] transition-colors",
              view === v ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
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
