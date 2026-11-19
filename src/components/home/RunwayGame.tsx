import { useEffect, useRef, useState } from "react";
import { Hammer, FlaskConical, ShieldCheck, Rocket, Plane, RotateCcw, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * "Clear for takeoff": a release as a flight. The build taxis through the
 * pipeline gates; now and then air traffic control puts it on hold with a real
 * problem from the job, and you clear it before it can take off to production.
 */
const GATES = [
  { id: "build", label: "Build", icon: Hammer },
  { id: "test", label: "Test", icon: FlaskConical },
  { id: "scan", label: "Scan", icon: ShieldCheck },
  { id: "deploy", label: "Deploy", icon: Rocket },
] as const;

const HOLDS: { gate: number; problem: string; fix: string }[] = [
  { gate: 0, problem: "Base image tag isn't pinned", fix: "Pin the digest" },
  { gate: 1, problem: "Flaky integration test", fix: "Quarantine & rerun" },
  { gate: 2, problem: "Critical CVE in the base image", fix: "Patch & rebuild" },
  { gate: 2, problem: "Unpinned GitHub Action in the workflow", fix: "Pin to a commit SHA" },
  { gate: 3, problem: "Terraform drift on the cluster", fix: "Plan & apply" },
  { gate: 3, problem: "Canary pod OOMKilled", fix: "Raise the memory limit" },
];

type Phase = "ready" | "taxi" | "hold" | "airborne";
const STEP = 650;

const RunwayGame = () => {
  const [phase, setPhase] = useState<Phase>("ready");
  const [gate, setGate] = useState(-1);
  const [hold, setHold] = useState<(typeof HOLDS)[number] | null>(null);
  const [shipped, setShipped] = useState(0);
  const [cleared, setCleared] = useState(0);
  const [lastFix, setLastFix] = useState<number | null>(null);
  const plan = useRef<(typeof HOLDS)[number] | null>(null);
  const holdAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const advance = (g: number) => {
    timer.current = setTimeout(() => {
      if (g >= GATES.length) {
        setPhase("airborne");
        setShipped((n) => n + 1);
        return;
      }
      setGate(g);
      if (plan.current && plan.current.gate === g) {
        setHold(plan.current);
        plan.current = null;
        holdAt.current = performance.now();
        setPhase("hold");
        return;
      }
      advance(g + 1);
    }, STEP);
  };

  const takeoff = () => {
    clearTimeout(timer.current);
    // most releases hit one hold, like real life
    plan.current = Math.random() < 0.8 ? HOLDS[Math.floor(Math.random() * HOLDS.length)] : null;
    setHold(null);
    setLastFix(null);
    setGate(-1);
    setPhase("taxi");
    advance(0);
  };

  const fix = () => {
    setLastFix((performance.now() - holdAt.current) / 1000);
    setCleared((n) => n + 1);
    setHold(null);
    setPhase("taxi");
    advance(gate + 1);
  };

  // plane position along the runway, 0..100
  const pos = phase === "airborne" ? 100 : gate < 0 ? 0 : ((gate + 0.5) / GATES.length) * 100;

  const status =
    phase === "ready"
      ? "Release v2.4.1 is at the gate. Request takeoff to ship it."
      : phase === "taxi"
        ? `Taxiing${gate >= 0 ? ` through ${GATES[gate].label.toLowerCase()}` : ""}…`
        : phase === "hold"
          ? `Hold at ${GATES[gate].label}: ${hold?.problem}.`
          : `Wheels up. In production with no rollback${lastFix ? `, hold cleared in ${lastFix.toFixed(1)}s` : ""}.`;

  return (
    <div className="p-5 sm:p-6 h-full flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <div className="label">Tower · clear the release</div>
        <div className="font-display text-[14px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap">
          Shipped <span className="text-foreground">{shipped}</span> · Holds cleared <span className="text-foreground">{cleared}</span>
        </div>
      </div>

      {/* the runway */}
      <div className="relative mt-4 h-[150px] rounded-2xl bg-board border border-border overflow-hidden" aria-hidden>
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-board-text/25" />
        <div className="absolute inset-x-4 bottom-3 grid grid-cols-4 gap-2">
          {GATES.map((g, i) => {
            const Icon = g.icon;
            const done = phase === "airborne" || i < gate || (i === gate && phase === "taxi");
            const held = phase === "hold" && i === gate;
            return (
              <div
                key={g.id}
                className={cn(
                  "flex items-center justify-center gap-1.5 h-8 rounded-lg font-display text-[13px] font-bold uppercase tracking-[0.05em] transition-colors",
                  held ? "bg-[hsl(355_85%_62%)] text-white" : done ? "bg-board-ok/15 text-board-ok" : "bg-board-text/[0.06] text-board-dim"
                )}
              >
                <Icon className="w-3.5 h-3.5" /> {g.label}
              </div>
            );
          })}
        </div>
        <div
          className={cn(
            "absolute top-[30%] -translate-x-1/2 -translate-y-1/2 transition-all ease-in-out",
            phase === "airborne" ? "duration-[1100ms] opacity-0" : "duration-500 opacity-100"
          )}
          style={{
            left: `calc(30px + (100% - 60px) * ${pos / 100})`,
            transform: `translate(-50%, -50%) ${phase === "airborne" ? "translate(60px, -70px) scale(1.4)" : ""}`,
          }}
        >
          <Plane className={cn("w-8 h-8 rotate-45", phase === "hold" ? "text-[hsl(355_85%_62%)]" : "text-board-fg")} fill="currentColor" strokeWidth={1.5} />
        </div>
      </div>

      <p className="mt-4 min-h-[44px] text-[16px] leading-snug font-medium" aria-live="polite">
        {status}
      </p>

      <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
        {phase === "hold" ? (
          <button type="button" onClick={fix} className="btn h-11 bg-[hsl(355_78%_45%)] text-white hover:bg-[hsl(355_78%_38%)]">
            <Wrench className="w-4 h-4" /> {hold?.fix}
          </button>
        ) : (
          <button type="button" onClick={takeoff} disabled={phase === "taxi"} className="btn-primary h-11 disabled:opacity-60">
            {phase === "airborne" ? (
              <>
                <RotateCcw className="w-4 h-4" /> Ship another
              </>
            ) : (
              <>
                <Plane className="w-4 h-4 rotate-45" /> Request takeoff
              </>
            )}
          </button>
        )}
        {phase === "airborne" && (
          <span className="text-[14px] text-muted-foreground">That's the day job. I can run it on your platform.</span>
        )}
      </div>

      <div className="mt-auto pt-5">
        <div className="label mb-2">Holds you might hit</div>
        <ul className="flex flex-wrap gap-1.5">
          {HOLDS.map((h) => (
            <li
              key={h.problem}
              className={cn(
                "tag normal-case tracking-normal font-sans text-[13px] font-medium bg-card",
                hold?.problem === h.problem && "border-[hsl(355_78%_45%)] text-[hsl(355_78%_40%)] dark:text-[hsl(355_85%_70%)]"
              )}
            >
              {GATES[h.gate].label}: {h.problem}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RunwayGame;
