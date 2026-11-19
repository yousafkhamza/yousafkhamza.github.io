import { useState } from "react";
import { MISCONFIGS, LEVELS, roundsForLevel, MisconfigRound } from "@/data/misconfigs";
import { cn } from "@/lib/utils";

/**
 * Spot the misconfig: pick a level, get a shuffled set of config files, click
 * the one line that will hurt you in production. Level 1 has 3 files, level 5
 * has 7. Files you have not seen yet come first, so repeat sessions stay fresh.
 */

const SEEN_KEY = "misconfig-seen";
const BEST_KEY = "misconfig-best-by-level";
const LEVEL_COLORS = ["green", "cyan", "violet", "amber", "pink"];

const read = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
};

const shuffle = <T,>(a: T[]) => {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
};

/** unseen files first (in random order), then seen ones, so a level rotates through its whole pool */
const pickRounds = (level: number): MisconfigRound[] => {
  const pool = MISCONFIGS.filter((m) => m.level === level);
  const seen = new Set(read<string[]>(SEEN_KEY, []));
  let fresh = shuffle(pool.filter((m) => !seen.has(m.id)));
  const n = roundsForLevel(level);
  if (fresh.length < n) {
    // the whole level has been seen: forget it and start the rotation again
    write(SEEN_KEY, [...seen].filter((id) => !pool.some((m) => m.id === id)));
    fresh = [...fresh, ...shuffle(pool.filter((m) => !fresh.includes(m)))];
  }
  return fresh.slice(0, n);
};

const Misconfig = () => {
  const [level, setLevel] = useState<number | null>(null);
  const [rounds, setRounds] = useState<MisconfigRound[]>([]);
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<Record<string, number>>(() => read(BEST_KEY, {}));

  const start = (lv: number) => {
    setLevel(lv);
    setRounds(pickRounds(lv));
    setN(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  const r = rounds[n];
  const color = level ? LEVEL_COLORS[level - 1] : "green";

  const pick = (idx: number) => {
    if (picked !== null || !r) return;
    setPicked(idx);
    if (idx === r.bad) setScore((s) => s + 1);
    write(SEEN_KEY, Array.from(new Set([...read<string[]>(SEEN_KEY, []), r.id])));
  };

  const advance = () => {
    if (n + 1 >= rounds.length) {
      setDone(true);
      const key = String(level);
      const nextBest = { ...best, [key]: Math.max(best[key] ?? 0, score) };
      setBest(nextBest);
      write(BEST_KEY, nextBest);
    } else {
      setN(n + 1);
      setPicked(null);
    }
  };

  // ── level picker ──
  if (level === null) {
    return (
      <div className="max-w-[760px] mx-auto">
        <p className="text-center text-muted-foreground text-[15px] mb-6">
          {MISCONFIGS.length} real-world config files. Pick a level: each file has exactly one line that will hurt you in production.
        </p>
        <div className="grid sm:grid-cols-5 gap-3">
          {LEVELS.map((l, i) => (
            <button
              key={l.level}
              onClick={() => start(l.level)}
              style={{ ["--c" as string]: `var(--c-${LEVEL_COLORS[i]})` }}
              className="panel p-4 text-left border-t-4 hover:-translate-y-0.5 transition-transform"
              aria-label={`Level ${l.level}: ${l.name}`}
            >
              <div className="font-code text-[11px] tint font-semibold">LEVEL {l.level}</div>
              <div className="font-display text-[19px] font-bold mt-1">{l.name}</div>
              <div className="text-[12.5px] text-muted-foreground mt-1 leading-snug">{l.blurb}</div>
              <div className="font-code text-[11.5px] text-muted-foreground mt-3">
                {roundsForLevel(l.level)} files
                {best[String(l.level)] !== undefined && (
                  <span className="tint"> · best {best[String(l.level)]}/{roundsForLevel(l.level)}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── results ──
  if (done) {
    const total = rounds.length;
    const perfect = score === total;
    return (
      <div className="max-w-[640px] mx-auto panel p-8 text-center border-t-4" style={{ ["--c" as string]: `var(--c-${color})`, borderTopColor: "hsl(var(--c))" }}>
        <div className="font-code text-[12px] tint font-semibold">
          LEVEL {level} · {LEVELS[level - 1].name.toUpperCase()} · REVIEW FINISHED
        </div>
        <div className="mt-2 font-display text-[52px] font-bold">
          {score}/{total}
        </div>
        <p className="mt-1 text-muted-foreground">
          {perfect
            ? "Clean review. Nothing here would have reached production."
            : score >= total / 2
            ? "Good eye. A couple would have made it to production."
            : "Production would have found these for you. Try this level again."}
        </p>
        <div className="mt-1 font-code text-[12px] text-muted-foreground">
          best {best[String(level)] ?? score}/{total}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => start(level)} className="btn-ghost h-10">
            Same level, new files
          </button>
          {level < 5 && (
            <button onClick={() => start(level + 1)} className="btn-primary h-10">
              Level {level + 1}: {LEVELS[level].name}
            </button>
          )}
          <button onClick={() => setLevel(null)} className="btn-ghost h-10">
            All levels
          </button>
        </div>
      </div>
    );
  }

  if (!r) return null;
  const answered = picked !== null;
  const correct = picked === r.bad;

  // ── a round ──
  return (
    <div className="max-w-[680px] mx-auto" style={{ ["--c" as string]: `var(--c-${color})` }}>
      <div className="flex items-center justify-between gap-3 font-code text-[12px] text-muted-foreground mb-2">
        <button onClick={() => setLevel(null)} className="hover:text-foreground">
          ← levels
        </button>
        <span>
          <span className="tint font-semibold">L{level}</span> · file {n + 1}/{rounds.length} · score {score}
        </span>
      </div>
      <div className="h-1 rounded-full bg-secondary mb-3 overflow-hidden">
        <div className="h-full bg-[hsl(var(--c))] transition-[width] duration-500" style={{ width: `${(n / rounds.length) * 100}%` }} />
      </div>
      <div className="panel overflow-hidden">
        <div className="px-4 h-10 flex items-center justify-between border-b border-border font-code text-[12.5px] bg-secondary/50">
          <span>{r.file}</span>
          {!answered && <span className="text-muted-foreground text-[11.5px]">click the line that will hurt you</span>}
        </div>
        <ol className="font-code text-[12.5px] sm:text-[13.5px] py-2 overflow-x-auto">
          {r.lines.map((line, idx) => {
            const isBad = idx === r.bad;
            const isPicked = idx === picked;
            return (
              <li key={idx}>
                <button
                  onClick={() => pick(idx)}
                  disabled={answered}
                  className={cn(
                    "w-full text-left flex gap-4 px-4 py-[3px] whitespace-pre transition-colors",
                    !answered && "hover:bg-[hsl(var(--c)/0.12)] cursor-pointer",
                    answered && isBad && "bg-ok/15",
                    answered && isPicked && !isBad && "bg-bad/15 line-through decoration-bad/60",
                    line.trimStart().startsWith("#") && "text-muted-foreground"
                  )}
                >
                  <span className="w-5 shrink-0 text-right text-muted-foreground select-none">{idx + 1}</span>
                  <span>{line}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      {answered && (
        <div className="mt-4 panel p-4 sm:p-5 animate-fade-in">
          <div className={cn("font-code text-[12.5px] font-semibold", correct ? "text-ok" : "text-bad")}>
            {correct ? "✔ caught it" : `✘ it was line ${r.bad + 1}`}
          </div>
          <p className="mt-1.5 text-[15px] leading-relaxed">{r.why.replace(/`/g, "")}</p>
          <button onClick={advance} className="btn-primary h-10 mt-4" autoFocus>
            {n + 1 >= rounds.length ? "See result" : "Next file"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Misconfig;
