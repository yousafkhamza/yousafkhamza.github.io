import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A tiny live "cluster": pods blink healthy, now and then one breaks and heals
 * itself a moment later. Click a broken pod to fix it before the cluster does.
 */
type Pod = "ok" | "warn" | "fail";
const COLS = 12;
const ROWS = 5;
const N = COLS * ROWS;

const PodField = () => {
  const [pods, setPods] = useState<Pod[]>(() => Array(N).fill("ok"));
  const [healed, setHealed] = useState(0);
  const [fixed, setFixed] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      const i = Math.floor(Math.random() * N);
      setPods((p) => {
        if (p[i] !== "ok") return p;
        const next = [...p];
        next[i] = Math.random() < 0.35 ? "fail" : "warn";
        return next;
      });
      timers.current.push(
        setTimeout(() => {
          setPods((p) => {
            if (p[i] === "ok") return p;
            const next = [...p];
            next[i] = "ok";
            setHealed((h) => h + 1);
            return next;
          });
        }, 2600)
      );
    }, 900);
    return () => {
      clearInterval(id);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const fix = (i: number) => {
    if (pods[i] === "ok") return;
    setPods((p) => {
      const next = [...p];
      next[i] = "ok";
      return next;
    });
    setFixed((f) => f + 1);
  };

  const unhealthy = pods.filter((p) => p !== "ok").length;

  return (
    <div className="panel p-4 sm:p-5 relative overflow-hidden" style={{ ["--c" as string]: "var(--c-green)" }}>
      <div className="flex items-center justify-between font-mono text-[12px]">
        <span className="text-muted-foreground">
          <span className="text-c-cyan">kubectl</span> get pods -n prod
        </span>
        <span className={cn("flex items-center gap-1.5", unhealthy ? "text-c-amber" : "text-c-green")}>
          <span className={cn("w-2 h-2 rounded-full", unhealthy ? "bg-c-amber animate-pulse" : "bg-c-green")} />
          {N - unhealthy}/{N} ready
        </span>
      </div>
      <div className="mt-4 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {pods.map((p, i) => (
          <button
            key={i}
            onClick={() => fix(i)}
            aria-label={p === "ok" ? "healthy pod" : "broken pod, click to fix"}
            tabIndex={p === "ok" ? -1 : 0}
            className={cn(
              "aspect-square rounded-[4px] transition-all duration-300",
              p === "ok" && "bg-c-green/25 hover:bg-c-green/60",
              p === "warn" && "bg-c-amber scale-110 shadow-[0_0_14px_hsl(var(--c-amber))] cursor-pointer",
              p === "fail" && "bg-c-pink scale-110 shadow-[0_0_14px_hsl(var(--c-pink))] cursor-pointer animate-pulse"
            )}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11.5px] text-muted-foreground">
        <span>
          self-healed <span className="text-c-green">{healed}</span>
        </span>
        <span>
          fixed by you <span className="text-c-violet">{fixed}</span>
        </span>
        <span className="ml-auto hidden sm:inline">click a red pod to fix it</span>
      </div>
    </div>
  );
};

export default PodField;
