import { useState } from "react";
import { skillGroups } from "@/data/skills";
import { cn } from "@/lib/utils";
import Pass from "@/components/Pass";

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

/** each skill group is a terminal: what I run today above the tear, what I have shipped with on the stub */
const List = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {skillGroups.map((g, i) => (
      <Pass
        key={g.id}
        tone={i === 0 ? "sign" : "board"}
        label={`Terminal ${i + 1}`}
        code={`${g.daily.length + g.also.length} tools`}
        main={
          <div className="p-5">
            <h3 className="font-display text-[24px] font-bold uppercase leading-none">{g.label}</h3>
            <div className="label mt-3 mb-2.5">In production today</div>
            <div className="flex flex-wrap gap-1.5">
              {g.daily.map((s) => (
                <span key={s} className="tool-on">
                  {s}
                </span>
              ))}
            </div>
          </div>
        }
        stub={
          g.also.length > 0 ? (
            <div className="px-5 py-4">
              <div className="label mb-2">Also shipped with</div>
              <div className="flex flex-wrap gap-1.5">
                {g.also.map((s) => (
                  <span key={s} className="tool">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : undefined
        }
      />
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
