import { useState } from "react";
import { skillGroups } from "@/data/skills";
import { cn } from "@/lib/utils";

type View = "list" | "yaml";

const Yaml = () => (
  <pre className="bg-strip text-[hsl(40_16%_88%)] rounded-[var(--radius)] p-5 sm:p-6 overflow-x-auto font-code text-[13px] leading-[1.75]">
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

/** each skill group: what I run today in solid chips, what I have shipped with before in outline */
const List = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {skillGroups.map((g) => (
      <div key={g.id} className="panel p-5 sm:p-6 flex flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[23px] font-bold leading-none">{g.label}</h3>
          <span className="text-[14px] text-muted-foreground">{g.daily.length + g.also.length} tools</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {g.daily.map((s) => (
            <span key={s} className="tool-on">
              {s}
            </span>
          ))}
        </div>
        {g.also.length > 0 && (
          <div className="mt-auto pt-5">
            <div className="label mb-2">Also shipped with</div>
            <div className="flex flex-wrap gap-1.5">
              {g.also.map((s) => (
                <span key={s} className="tool">
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
      <div className="seg mb-5" role="tablist" aria-label="Stack view">
        {(["list", "yaml"] as View[]).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={cn("seg-btn", v === "yaml" && "normal-case font-code font-medium text-[14px] tracking-normal")}
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
