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
    <div className="board p-4 sm:p-5 relative overflow-hidden">
      <div className="flex items-center justify-between font-code text-[14.5px]">
        <span className="text-board-dim">
          <span className="text-board-fg">kubectl</span> get pods -n prod
        </span>
        <span className={cn("flex items-center gap-1.5", unhealthy ? "text-board-fg" : "text-board-ok")}>
          <span className={cn("w-2 h-2 rounded-full", unhealthy ? "bg-board-fg animate-pulse" : "bg-board-ok")} />
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
              "aspect-square rounded-[2px] transition-all duration-300",
              p === "ok" && "bg-board-ok/25 hover:bg-board-ok/60",
              p === "warn" && "bg-board-fg scale-110 cursor-pointer",
              p === "fail" && "bg-[hsl(355_85%_62%)] scale-110 cursor-pointer animate-pulse"
            )}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-display text-[14px] font-semibold uppercase tracking-[0.05em] text-board-dim">
        <span>
          self-healed <span className="text-board-ok">{healed}</span>
        </span>
        <span>
          fixed by you <span className="text-board-fg">{fixed}</span>
        </span>
        <span className="ml-auto hidden sm:inline">click a red pod to fix it</span>
      </div>
    </div>
  );
};

export default PodField;
