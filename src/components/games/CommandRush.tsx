import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { COMMANDS, LEVELS, roundSpec, TOOL_HINT, normalise, firstWord, toolOf, isCorrect, Cmd } from "@/data/commands";

/**
 * Command Rush: a situation, a bit of real terminal output, and you type the
 * command that handles it. Wrong attempts get a real explanation, `hint` gives
 * two levels of help, skipping shows the answer before moving on.
 */

type Prompt = Cmd;

const SEEN_KEY = "command-rush-seen";
const BEST_KEY = "command-rush-best-by-level";
const LEVEL_COLORS = ["green", "cyan", "violet", "amber", "pink"];

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const writeJson = (key: string, value: unknown) => {
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

/** unseen situations first, so repeat rounds stay fresh; mixes tools within the level */
const pickDeck = (level: number): Prompt[] => {
  const pool = COMMANDS.filter((c) => c.level === level);
  let seen = new Set(readJson<string[]>(SEEN_KEY, []));
  const n = roundSpec(level).questions;
  if (pool.filter((c) => !seen.has(c.id)).length < n) {
    // whole level played through: start the rotation again
    seen = new Set([...seen].filter((id) => !pool.some((c) => c.id === id)));
    writeJson(SEEN_KEY, [...seen]);
  }
  // one queue per tool, unseen first inside each, then round-robin so every round mixes tools
  const byTool = new Map<string, Prompt[]>();
  pool.forEach((c) => byTool.set(c.tool, [...(byTool.get(c.tool) ?? []), c]));
  const queues = shuffle([...byTool.values()]).map((q) => [
    ...shuffle(q.filter((c) => !seen.has(c.id))),
    ...shuffle(q.filter((c) => seen.has(c.id))),
  ]);
  const deck: Prompt[] = [];
  while (deck.length < n && queues.some((q) => q.length)) {
    for (const q of queues) {
      const next = q.shift();
      if (next && deck.length < n) deck.push(next);
    }
  }
  return shuffle(deck);
};

type Line = { kind: "in" | "err" | "warn" | "hint" | "ok" | "info"; text: string };
type Result = { prompt: Prompt; outcome: "solved" | "skipped"; hints: number; points: number };
type Phase = "idle" | "ask" | "reveal" | "done";

const points = (hints: number) => (hints === 0 ? 2 : hints === 1 ? 1 : 0);

const CommandRush = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const total = roundSpec(level).seconds;
  const [deck, setDeck] = useState<Prompt[]>([]);
  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [left, setLeft] = useState(roundSpec(1).seconds);
  const [lines, setLines] = useState<Line[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [shake, setShake] = useState(false);
  const [bestBy, setBestBy] = useState<Record<string, number>>(() => readJson(BEST_KEY, {}));
  const best = bestBy[String(level)] ?? 0;
  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const score = useMemo(() => results.reduce((s, r) => s + r.points, 0), [results]);
  const current = deck[i];

  // clock runs only while a question is open, so reading an answer is free
  useEffect(() => {
    if (phase !== "ask") return;
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "ask" && left <= 0) setPhase("done");
  }, [left, phase]);

  useEffect(() => {
    if (phase === "ask") inputRef.current?.focus();
    if (phase === "reveal") nextRef.current?.focus();
  }, [phase, i]);

  useEffect(() => {
    screenRef.current?.scrollTo({ top: screenRef.current.scrollHeight });
  }, [lines, phase]);

  useEffect(() => {
    if (phase !== "done") return;
    setBestBy((b) => {
      const next = { ...b, [String(level)]: Math.max(b[String(level)] ?? 0, score) };
      writeJson(BEST_KEY, next);
      return next;
    });
  }, [phase, score, level]);

  const start = (lv: number = level) => {
    setLevel(lv);
    setDeck(pickDeck(lv));
    setI(0);
    setResults([]);
    setLeft(roundSpec(lv).seconds);
    setInput("");
    setLines([]);
    setHintsUsed(0);
    setPhase("ask");
  };

  const say = (...l: Line[]) => setLines((x) => [...x, ...l]);
  const bump = () => {
    setShake(true);
    setTimeout(() => setShake(false), 350);
  };

  const giveHint = () => {
    if (phase !== "ask") return;
    if (hintsUsed >= 2) {
      say({ kind: "info", text: "No more hints for this one. Type skip to see the answer." });
      return;
    }
    say({ kind: "hint", text: `hint ${hintsUsed + 1}/2: ${current.hints[hintsUsed]}` });
    setHintsUsed((h) => h + 1);
  };

  const finishRound = (outcome: "solved" | "skipped") => {
    setResults((r) => [...r, { prompt: current, outcome, hints: hintsUsed, points: outcome === "solved" ? points(hintsUsed) : 0 }]);
    setPhase("reveal");
  };

  const skip = () => {
    if (phase !== "ask") return;
    writeJson(SEEN_KEY, Array.from(new Set([...readJson<string[]>(SEEN_KEY, []), current.id])));
    say({ kind: "info", text: "skipped" });
    finishRound("skipped");
  };

  const next = () => {
    if (i + 1 >= deck.length || left <= 0) {
      setPhase("done");
      return;
    }
    setI(i + 1);
    setLines([]);
    setHintsUsed(0);
    setInput("");
    setPhase("ask");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (phase !== "ask") return;
    const raw = input;
    const cmd = normalise(raw);
    setInput("");
    setHistIdx(-1);

    if (!cmd) {
      say({ kind: "warn", text: "Nothing to run. Type a command, or try: hint · skip" });
      bump();
      return;
    }
    say({ kind: "in", text: raw });
    if (!["hint", "skip", "clear", "help"].includes(cmd)) setHistory((h) => [raw, ...h].slice(0, 30));

    if (cmd === "hint") return giveHint();
    if (cmd === "skip") return skip();
    if (cmd === "clear") return setLines([]);
    if (cmd === "help") {
      say({ kind: "info", text: "Type the command for the situation. Built-ins: hint, skip, clear. ↑ recalls your last attempt." });
      return;
    }

    if (isCorrect(current, cmd)) {
      writeJson(SEEN_KEY, Array.from(new Set([...readJson<string[]>(SEEN_KEY, []), current.id])));
      say({ kind: "ok", text: `✔ correct  +${points(hintsUsed)}` });
      finishRound("solved");
      return;
    }

    bump();
    const near = current.near?.find((n) => n.re.test(cmd));
    if (near) {
      say({ kind: "err", text: near.msg });
      return;
    }
    const used = toolOf(cmd);
    if (!used) {
      say({ kind: "err", text: `${firstWord(cmd)}: command not found. This one needs ${TOOL_HINT[current.tool]}.` });
      return;
    }
    if (used !== current.tool) {
      say({ kind: "err", text: `Wrong tool: ${firstWord(cmd)} cannot do this. It is a job for ${TOOL_HINT[current.tool]}.` });
      return;
    }
    const answerVerb = normalise(current.answer).split(" ").slice(0, 2).join(" ");
    const typedVerb = cmd.split(" ").slice(0, 2).join(" ");
    if (current.tool !== "linux" && answerVerb === typedVerb) {
      say({ kind: "err", text: "Close: right command, but the arguments or flags are off. Check the names in the output above." });
    } else {
      say({ kind: "err", text: `Not that ${TOOL_HINT[current.tool]} command. Type hint if you are stuck.` });
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx]);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = histIdx - 1;
      setHistIdx(Math.max(idx, -1));
      setInput(idx >= 0 ? history[idx] : "");
    }
  };

  const lastResult = results[results.length - 1];
  const lineColor: Record<Line["kind"], string> = {
    in: "text-white",
    err: "text-[hsl(350_85%_72%)]",
    warn: "text-[hsl(42_96%_65%)]",
    hint: "text-[hsl(258_90%_80%)]",
    ok: "text-[hsl(158_72%_60%)]",
    info: "text-white/50",
  };

  const btn = "h-9 px-4 rounded-md font-sans text-[13.5px] font-semibold transition-colors";

  return (
    <div className="max-w-[720px] mx-auto">
      <div className="rounded-xl overflow-hidden border border-white/10 bg-[hsl(226_45%_6%)] text-[hsl(220_30%_88%)] shadow-[0_30px_80px_-30px_hsl(var(--c-green)/0.45)]">
        {/* title bar */}
        <div className="flex items-center justify-between gap-3 px-4 h-10 border-b border-white/10 font-mono text-[12px] text-white/55">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[hsl(350_85%_65%)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[hsl(42_96%_60%)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[hsl(158_72%_52%)]" />
            <span className="ml-2">oncall@prod:~</span>
          </span>
          <span>
            pts <span className="text-[hsl(158_72%_60%)] font-semibold">{score}</span> · best {best} ·{" "}
            <span className={cn("font-semibold", left <= 15 && phase === "ask" ? "text-[hsl(350_85%_70%)]" : "text-white/80")}>{left}s</span>
          </span>
        </div>
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-[hsl(158_72%_52%)] transition-[width] duration-1000 ease-linear"
            style={{ width: `${(left / total) * 100}%` }}
          />
        </div>

        <div className="p-4 sm:p-6 font-mono text-[13px] sm:text-[13.5px] min-h-[340px]">
          {phase === "idle" && (
            <div>
              <p className="font-sans text-[16px] text-white leading-relaxed">
                {COMMANDS.length} real on-call situations across 5 levels. Pick one, then type the command that handles each situation.
              </p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-5 gap-2">
                {LEVELS.map((l, n) => {
                  const spec = roundSpec(l.level);
                  const c = LEVEL_COLORS[n];
                  const b = bestBy[String(l.level)];
                  return (
                    <button
                      key={l.level}
                      onClick={() => start(l.level)}
                      aria-label={`Level ${l.level}: ${l.name}`}
                      className="text-left rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] p-3 transition-colors border-t-4"
                      style={{ borderTopColor: `hsl(var(--c-${c}))` }}
                    >
                      <div className="text-[11px] font-semibold" style={{ color: `hsl(var(--c-${c}))` }}>
                        LEVEL {l.level}
                      </div>
                      <div className="font-sans text-[15px] font-bold text-white mt-0.5">{l.name}</div>
                      <div className="font-sans text-[12px] text-white/55 mt-1 leading-snug">{l.tools}</div>
                      <div className="text-[11px] text-white/40 mt-2">
                        {spec.questions} q · {spec.seconds}s{b !== undefined ? ` · best ${b}` : ""}
                      </div>
                    </button>
                  );
                })}
              </div>
              <ul className="mt-5 space-y-1.5 text-white/60 text-[13px]">
                <li><span className="text-[hsl(158_72%_60%)]">+2</span> solved on your own · <span className="text-[hsl(158_72%_60%)]">+1</span> with one hint · 0 with two</li>
                <li>wrong attempts cost nothing but time, and tell you what was off</li>
                <li>type <span className="text-white">hint</span> or <span className="text-white">skip</span> any time · ↑ recalls your last attempt</li>
                <li><span className="text-white">k</span> works for kubectl, <span className="text-white">tf</span> for terraform, flag order does not matter</li>
              </ul>
            </div>
          )}

          {(phase === "ask" || phase === "reveal") && current && (
            <div>
              <div className="flex items-center justify-between text-white/40 text-[12px]">
                <span>
                  <span style={{ color: `hsl(var(--c-${LEVEL_COLORS[level - 1]}))` }}>L{level}</span> · # {i + 1}/{deck.length} · {TOOL_HINT[current.tool]}
                </span>
                {phase === "ask" && hintsUsed > 0 && <span className="text-[hsl(258_90%_80%)]">hints {hintsUsed}/2</span>}
              </div>
              <p className="mt-1.5 font-sans text-[16px] leading-relaxed text-white">{current.ask}</p>

              {current.context && (
                <div className="mt-4 rounded-md bg-white/[0.04] border border-white/5 px-3 py-2 overflow-x-auto text-[12.5px]">
                  {current.context.map((l, n) => (
                    <div key={n} className={cn("whitespace-pre", n === 0 ? "text-white/75" : "text-white/50")}>
                      {l}
                    </div>
                  ))}
                </div>
              )}
              <div ref={screenRef} className="mt-3 max-h-[200px] overflow-y-auto pr-1 space-y-0.5">
                {lines.map((l, n) => (
                  <div key={n} className={cn("whitespace-pre-wrap break-words", lineColor[l.kind])}>
                    {l.kind === "in" ? <><span className="text-[hsl(158_72%_60%)]">$ </span>{l.text}</> : l.text}
                  </div>
                ))}
              </div>

              {phase === "ask" && (
                <form onSubmit={submit} className={cn("mt-2", shake && "animate-[shake_.35s]")}>
                  <label className="flex items-center gap-2">
                    <span className="text-[hsl(158_72%_60%)]">$</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKey}
                      className="flex-1 min-w-0 bg-transparent outline-none caret-[hsl(42_96%_60%)] text-white placeholder:text-white/25"
                      placeholder="type the command and press Enter"
                      spellCheck={false}
                      autoCapitalize="off"
                      autoCorrect="off"
                      autoComplete="off"
                      aria-label="Your command"
                    />
                  </label>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button type="submit" className={cn(btn, "bg-[hsl(158_72%_52%)] text-[hsl(226_45%_7%)] hover:bg-[hsl(158_72%_60%)]")}>
                      Run ⏎
                    </button>
                    <button
                      type="button"
                      onClick={giveHint}
                      disabled={hintsUsed >= 2}
                      className={cn(btn, "bg-[hsl(258_90%_74%/0.15)] text-[hsl(258_90%_82%)] hover:bg-[hsl(258_90%_74%/0.25)] disabled:opacity-40 disabled:cursor-not-allowed")}
                    >
                      Hint {hintsUsed < 2 ? `(${2 - hintsUsed} left)` : "(none left)"}
                    </button>
                    <button type="button" onClick={skip} className={cn(btn, "bg-white/5 text-white/70 hover:bg-white/10")}>
                      Skip & show answer
                    </button>
                  </div>
                </form>
              )}

              {phase === "reveal" && lastResult && (
                <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 animate-fade-in">
                  <div className={cn("text-[12px] font-semibold", lastResult.outcome === "solved" ? "text-[hsl(158_72%_60%)]" : "text-[hsl(42_96%_65%)]")}>
                    {lastResult.outcome === "solved"
                      ? `solved${lastResult.hints ? ` with ${lastResult.hints} hint${lastResult.hints > 1 ? "s" : ""}` : ""} · +${lastResult.points}`
                      : "skipped · the answer"}
                  </div>
                  <div className="mt-2 text-white break-words">
                    <span className="text-[hsl(158_72%_60%)]">$ </span>
                    {current.answer}
                  </div>
                  <p className="mt-2 font-sans text-[14px] leading-relaxed text-white/65">{current.why.replace(/`/g, "")}</p>
                  <button ref={nextRef} onClick={next} className={cn(btn, "mt-4 bg-[hsl(158_72%_52%)] text-[hsl(226_45%_7%)] hover:bg-[hsl(158_72%_60%)]")}>
                    {i + 1 >= deck.length || left <= 0 ? "See results" : "Next situation ⏎"}
                  </button>
                </div>
              )}
            </div>
          )}

          {phase === "done" && (
            <div>
              <div className="font-sans text-[22px] font-bold text-white">
                {score} points <span className="text-white/45 text-[15px] font-normal">· best {best}</span>
              </div>
              <div className="mt-1 text-white/55 text-[12.5px]">
                {results.filter((r) => r.outcome === "solved").length} solved · {results.filter((r) => r.outcome === "skipped").length} skipped ·{" "}
                {left <= 0 ? "time ran out" : "all done"}
              </div>
              <ul className="mt-5 space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {results.map((r, n) => (
                  <li key={n} className="text-[13px]">
                    <span className={r.outcome === "solved" ? "text-[hsl(158_72%_60%)]" : "text-[hsl(350_85%_70%)]"}>
                      {r.outcome === "solved" ? `✔ +${r.points}` : "✘ skip"}
                    </span>{" "}
                    <span className="font-sans text-white/75">{r.prompt.ask}</span>
                    <div className="pl-4 mt-0.5 text-white/45 break-words">$ {r.prompt.answer}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={() => start(level)} className={cn(btn, "bg-white/10 text-white hover:bg-white/15")}>
                  Same level, new situations
                </button>
                {level < 5 && (
                  <button onClick={() => start(level + 1)} className={cn(btn, "bg-[hsl(158_72%_52%)] text-[hsl(226_45%_7%)] hover:bg-[hsl(158_72%_60%)]")}>
                    Level {level + 1}: {LEVELS[level].name}
                  </button>
                )}
                <button onClick={() => setPhase("idle")} className={cn(btn, "bg-white/5 text-white/70 hover:bg-white/10")}>
                  All levels
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandRush;
