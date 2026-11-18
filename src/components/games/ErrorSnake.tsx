import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// "Error Snake": classic snake, but the food is production errors. Eat one and
// you see the fix. Arrow keys / WASD on a keyboard, swipe or the pad on a phone.
// Every so often an `rm -rf /` tile shows up for a few seconds: don't touch it.

const COLS = 18;
const ROWS = 18;
const BEST_KEY = "error-snake-best";
const START_STEP = 150; // ms per move
const MIN_STEP = 65;

type Pt = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";
type Phase = "idle" | "running" | "paused" | "over";

const ERRORS: { tag: string; name: string; fix: string }[] = [
  { tag: "OOM", name: "OOMKilled", fix: "raise the memory limit, or find the leak" },
  { tag: "CLB", name: "CrashLoopBackOff", fix: "kubectl logs --previous shows why it died" },
  { tag: "500", name: "HTTP 500", fix: "check the app logs for the stack trace" },
  { tag: "502", name: "502 Bad Gateway", fix: "upstream is down or closed the connection" },
  { tag: "504", name: "504 Gateway Timeout", fix: "upstream is too slow: raise the timeout or fix the query" },
  { tag: "DNS", name: "NXDOMAIN", fix: "check the record and CoreDNS, then the search path" },
  { tag: "TLS", name: "Certificate expired", fix: "renew it, and alert 30 days before next time" },
  { tag: "CVE", name: "Critical CVE", fix: "bump the base image and rebuild" },
  { tag: "IMG", name: "ImagePullBackOff", fix: "wrong tag or missing pull secret" },
  { tag: "403", name: "AccessDenied", fix: "the IAM role is missing an action" },
  { tag: "DSK", name: "No space left on device", fix: "rotate logs, prune images, grow the volume" },
  { tag: "LCK", name: "State lock held", fix: "wait for the other apply, or force-unlock if it died" },
  { tag: "PND", name: "Pod Pending", fix: "no node fits: check requests, taints and quotas" },
  { tag: "5XX", name: "Error budget burning", fix: "roll back first, debug second" },
  { tag: "CPU", name: "CPU throttled", fix: "raise or drop the CPU limit" },
  { tag: "429", name: "429 Too Many Requests", fix: "back off with jitter and cache" },
  { tag: "SEG", name: "Segfault", fix: "core dump, symbols, then gdb" },
  { tag: "DRF", name: "Terraform drift", fix: "plan, then import or revert the manual change" },
  { tag: "LAG", name: "Consumer lag", fix: "more partitions and consumers, or a faster handler" },
  { tag: "KEY", name: "Leaked secret", fix: "rotate it now, then purge history" },
];

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY) || 0);
  } catch {
    return 0;
  }
};

const same = (a: Pt, b: Pt) => a.x === b.x && a.y === b.y;
const OPPOSITE: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };
const DELTA: Record<Dir, Pt> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };

const freeCell = (taken: Pt[]): Pt => {
  for (let i = 0; i < 500; i++) {
    const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!taken.some((t) => same(t, p))) return p;
  }
  return { x: 0, y: 0 };
};

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const ErrorSnake = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);
  const [lastFix, setLastFix] = useState<{ name: string; fix: string } | null>(null);
  const [cause, setCause] = useState("");

  const g = useRef({
    snake: [] as Pt[],
    dir: "right" as Dir,
    queue: [] as Dir[],
    food: { x: 0, y: 0 } as Pt,
    foodErr: ERRORS[0],
    hazard: null as Pt | null,
    hazardUntil: 0,
    nextHazard: 0,
    eaten: 0,
    acc: 0,
    last: 0,
    phase: "idle" as Phase,
  });

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const s = g.current;
    const W = cv.width;
    const cell = W / COLS;
    const hsl = (v: string, a = 1) => `hsl(${css(v)} / ${a})`;

    ctx.clearRect(0, 0, W, W);
    // board
    ctx.fillStyle = hsl("--muted", 0.55);
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) if ((x + y) % 2 === 0) ctx.fillRect(x * cell, y * cell, cell, cell);

    const box = (p: Pt, fill: string, inset = 0.08, r = 0.28) => {
      const x = p.x * cell + cell * inset;
      const y = p.y * cell + cell * inset;
      const w = cell * (1 - inset * 2);
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.roundRect(x, y, w, w, w * r);
      ctx.fill();
    };
    const label = (p: Pt, text: string, color: string, size = 0.36) => {
      ctx.fillStyle = color;
      ctx.font = `700 ${Math.round(cell * size)}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, p.x * cell + cell / 2, p.y * cell + cell / 2 + 1);
    };

    // food: an error tile
    box(s.food, hsl("--c-pink"), 0.04, 0.22);
    label(s.food, s.foodErr.tag, "#fff");

    // hazard
    if (s.hazard) {
      const left = Math.max(0, s.hazardUntil - performance.now());
      const blink = left < 1500 && Math.floor(left / 180) % 2 === 0;
      box(s.hazard, blink ? hsl("--c-amber", 0.5) : hsl("--c-amber"), 0.04, 0.22);
      label(s.hazard, "rm", "#111", 0.42);
    }

    // snake, tail fading
    const n = s.snake.length;
    s.snake.forEach((p, i) => {
      if (i === 0) return;
      box(p, hsl("--c-green", 1 - (i / n) * 0.55), 0.1, 0.3);
    });
    if (n) {
      const h = s.snake[0];
      box(h, hsl("--c-green"), 0.02, 0.32);
      // eyes looking where we go
      const d = DELTA[s.dir];
      const cx = h.x * cell + cell / 2 + d.x * cell * 0.14;
      const cy = h.y * cell + cell / 2 + d.y * cell * 0.14;
      const ox = d.y !== 0 ? cell * 0.18 : 0;
      const oy = d.x !== 0 ? cell * 0.18 : 0;
      ctx.fillStyle = "#fff";
      [[-1, -1], [1, 1]].forEach(([sx]) => {
        ctx.beginPath();
        ctx.arc(cx + ox * sx, cy + oy * sx, cell * 0.11, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = "#0b1120";
      [[-1], [1]].forEach(([sx]) => {
        ctx.beginPath();
        ctx.arc(cx + ox * sx + d.x * cell * 0.04, cy + oy * sx + d.y * cell * 0.04, cell * 0.05, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, []);

  // keep the canvas sharp and square at any width
  useEffect(() => {
    const fit = () => {
      const cv = canvasRef.current;
      const wrap = wrapRef.current;
      if (!cv || !wrap) return;
      const size = Math.min(wrap.clientWidth, 540);
      const dpr = window.devicePixelRatio || 1;
      cv.style.width = `${size}px`;
      cv.style.height = `${size}px`;
      cv.width = Math.round(size * dpr);
      cv.height = Math.round(size * dpr);
      draw();
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (wrapRef.current) ro.observe(wrapRef.current);
    // redraw when the theme toggles
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [draw]);

  const setP = (p: Phase) => {
    g.current.phase = p;
    setPhase(p);
  };

  const end = useCallback((why: string) => {
    setCause(why);
    setP("over");
    const eaten = g.current.eaten;
    setBest((b) => {
      const next = Math.max(b, eaten);
      try {
        localStorage.setItem(BEST_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const step = useCallback(() => {
    const s = g.current;
    const nextDir = s.queue.shift();
    if (nextDir && nextDir !== OPPOSITE[s.dir]) s.dir = nextDir;
    const d = DELTA[s.dir];
    const head = { x: s.snake[0].x + d.x, y: s.snake[0].y + d.y };

    if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) return end("Hit the edge of the cluster.");
    const eating = same(head, s.food);
    const body = eating ? s.snake : s.snake.slice(0, -1);
    if (body.some((p) => same(p, head))) return end("Ran into your own tail. Classic dependency loop.");
    if (s.hazard && same(head, s.hazard)) return end("You ran rm -rf / in production.");

    s.snake = [head, ...body];
    if (eating) {
      s.eaten += 1;
      setScore(s.eaten);
      setLastFix({ name: s.foodErr.name, fix: s.foodErr.fix });
      s.foodErr = ERRORS[Math.floor(Math.random() * ERRORS.length)];
      s.food = freeCell([...s.snake, ...(s.hazard ? [s.hazard] : [])]);
    }

    const now = performance.now();
    if (s.hazard && now > s.hazardUntil) {
      s.hazard = null;
      s.nextHazard = now + 6000 + Math.random() * 6000;
    } else if (!s.hazard && s.eaten >= 3 && now > s.nextHazard) {
      // never spawn right in front of the head
      let p = freeCell([...s.snake, s.food]);
      for (let i = 0; i < 20 && Math.abs(p.x - head.x) + Math.abs(p.y - head.y) < 4; i++) p = freeCell([...s.snake, s.food]);
      s.hazard = p;
      s.hazardUntil = now + 7000;
    }
  }, [end]);

  // game loop
  useEffect(() => {
    if (phase !== "running") return;
    let raf = 0;
    const s = g.current;
    s.last = performance.now();
    const loop = (t: number) => {
      if (s.phase !== "running") return;
      s.acc += t - s.last;
      s.last = t;
      const ms = Math.max(MIN_STEP, START_STEP - Math.floor(s.eaten / 5) * 12);
      while (s.acc >= ms && s.phase === "running") {
        s.acc -= ms;
        step();
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, step, draw]);

  const start = useCallback(() => {
    const s = g.current;
    const mid = Math.floor(ROWS / 2);
    s.snake = [
      { x: 5, y: mid },
      { x: 4, y: mid },
      { x: 3, y: mid },
    ];
    s.dir = "right";
    s.queue = [];
    s.eaten = 0;
    s.acc = 0;
    s.hazard = null;
    s.nextHazard = performance.now() + 8000;
    s.foodErr = ERRORS[Math.floor(Math.random() * ERRORS.length)];
    s.food = freeCell(s.snake);
    setScore(0);
    setLastFix(null);
    setCause("");
    setP("running");
    wrapRef.current?.focus({ preventScroll: true });
  }, []);

  const turn = useCallback(
    (d: Dir) => {
      const s = g.current;
      if (s.phase === "idle" || s.phase === "over") {
        start();
        g.current.queue.push(d);
        return;
      }
      if (s.phase === "paused") setP("running");
      const lastQueued = s.queue[s.queue.length - 1] ?? s.dir;
      if (d !== lastQueued && d !== OPPOSITE[lastQueued] && s.queue.length < 3) s.queue.push(d);
    },
    [start]
  );

  const togglePause = useCallback(() => {
    const p = g.current.phase;
    if (p === "running") setP("paused");
    else if (p === "paused") setP("running");
  }, []);

  // keyboard, only while the board has focus or a round is live
  useEffect(() => {
    const keys: Record<string, Dir> = {
      ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right",
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      const live = g.current.phase === "running" || g.current.phase === "paused";
      const focused = wrapRef.current?.contains(document.activeElement);
      if (!live && !focused) return;
      if (keys[e.key]) {
        e.preventDefault();
        turn(keys[e.key]);
      } else if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        if (g.current.phase === "idle" || g.current.phase === "over") start();
        else togglePause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn, start, togglePause]);

  // swipe on the board
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return;
    turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
    touch.current = { x: t.clientX, y: t.clientY };
  };

  const PadBtn = ({ d, icon: Icon, className }: { d: Dir; icon: typeof ArrowUp; className?: string }) => (
    <button
      type="button"
      aria-label={`Move ${d}`}
      onPointerDown={(e) => {
        e.preventDefault();
        turn(d);
      }}
      className={cn(
        "w-14 h-14 rounded-xl border border-border bg-card grid place-items-center active:bg-c-green/15 active:border-c-green select-none touch-manipulation",
        className
      )}
    >
      <Icon className="w-6 h-6" />
    </button>
  );

  return (
    <div className="grid lg:grid-cols-[minmax(0,540px)_1fr] gap-8 items-start">
      <div>
        <div className="flex items-center justify-between mb-3 font-mono text-[13px]">
          <span>
            errors fixed <b className="text-c-green text-[15px]">{score}</b>
          </span>
          <span className="text-muted-foreground">best {best}</span>
        </div>
        <div
          ref={wrapRef}
          tabIndex={0}
          aria-label="Error Snake board. Use arrow keys or swipe."
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={() => (touch.current = null)}
          className="relative panel p-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-c-green touch-none"
        >
          <canvas ref={canvasRef} className="block" />
          {phase !== "running" && (
            <div className="absolute inset-0 grid place-items-center bg-background/75 backdrop-blur-[2px] p-6 text-center">
              <div className="max-w-[330px]">
                {phase === "over" ? (
                  <>
                    <div className="font-display text-[28px] font-extrabold">Postmortem</div>
                    <p className="mt-1 text-[15px] text-muted-foreground">{cause}</p>
                    <p className="mt-3 font-mono text-[14px]">
                      {score} error{score === 1 ? "" : "s"} fixed{score > 0 && score >= best ? " · new best" : ""}
                    </p>
                  </>
                ) : phase === "paused" ? (
                  <div className="font-display text-[28px] font-extrabold">Paused</div>
                ) : (
                  <>
                    <div className="font-display text-[28px] font-extrabold">Error Snake</div>
                    <p className="mt-1 text-[15px] text-muted-foreground">
                      Eat the errors before they pile up. Avoid the walls, your tail and the{" "}
                      <span className="font-mono text-c-amber">rm</span> tile.
                    </p>
                  </>
                )}
                <button
                  type="button"
                  onClick={phase === "paused" ? togglePause : start}
                  className="btn-primary mt-5"
                >
                  {phase === "paused" ? <Play className="w-4 h-4" /> : phase === "over" ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {phase === "paused" ? "Resume" : phase === "over" ? "Play again" : "Start"}
                </button>
                <p className="mt-3 font-mono text-[12px] text-muted-foreground hidden sm:block">
                  arrows or WASD to move · space to pause
                </p>
                <p className="mt-3 font-mono text-[12px] text-muted-foreground sm:hidden">swipe on the board or use the pad</p>
              </div>
            </div>
          )}
        </div>

        {/* touch pad: shown on phones and tablets */}
        <div className="mt-4 flex items-center justify-center gap-6 [@media(pointer:fine)]:hidden">
          <div className="grid grid-cols-3 gap-2">
            <span />
            <PadBtn d="up" icon={ArrowUp} />
            <span />
            <PadBtn d="left" icon={ArrowLeft} />
            <PadBtn d="down" icon={ArrowDown} />
            <PadBtn d="right" icon={ArrowRight} />
          </div>
          {(phase === "running" || phase === "paused") && (
            <button
              type="button"
              onClick={togglePause}
              aria-label={phase === "running" ? "Pause" : "Resume"}
              className="w-14 h-14 rounded-xl border border-border bg-card grid place-items-center"
            >
              {phase === "running" ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      <aside className="panel p-5 lg:mt-9">
        <div className="label">Last fix</div>
        {lastFix ? (
          <div key={lastFix.name + score} className="mt-2 animate-fade-in">
            <div className="font-mono text-[14px] text-c-pink">{lastFix.name}</div>
            <p className="mt-1 text-[15px]">{lastFix.fix}</p>
          </div>
        ) : (
          <p className="mt-2 text-[14.5px] text-muted-foreground">Eat an error and its fix shows up here.</p>
        )}
        <div className="mt-6 label">How it works</div>
        <ul className="mt-2 space-y-1.5 text-[14.5px] text-muted-foreground">
          <li>Each pink tile is a real production error. Eat it to fix it.</li>
          <li>Every 5 fixes the snake gets faster.</li>
          <li>
            After a few fixes an amber <span className="font-mono text-c-amber">rm</span> tile appears for a few
            seconds. Touch it and it is over.
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default ErrorSnake;
