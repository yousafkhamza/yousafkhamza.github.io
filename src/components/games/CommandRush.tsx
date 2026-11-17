import { FormEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Command Rush: 60 seconds, one situation at a time, type the command that
 * handles it. Answers are matched loosely (flag order, `k` for kubectl, extra
 * spaces), the way a colleague would accept them.
 */
interface Prompt {
  ask: string;
  context?: string;
  accept: RegExp[];
  answer: string;
}

const PROMPTS: Prompt[] = [
  {
    ask: "Pod api-7d9f keeps crashing. Show the logs from the run that crashed.",
    accept: [/^kubectl logs (api-7d9f )?(--previous|-p)( api-7d9f)?$/],
    answer: "kubectl logs api-7d9f --previous",
  },
  {
    ask: "Roll deployment payments back to the previous revision.",
    accept: [/^kubectl rollout undo (deploy|deployment|deployments)\/payments$/, /^kubectl rollout undo (deploy|deployment) payments$/],
    answer: "kubectl rollout undo deploy/payments",
  },
  {
    ask: "Why is pod worker-1 stuck in Pending? Show its events and details.",
    accept: [/^kubectl describe (pod|po|pods) worker-1$/, /^kubectl describe (pod|po)\/worker-1$/],
    answer: "kubectl describe pod worker-1",
  },
  {
    ask: "Check which AWS identity your CLI is using right now.",
    accept: [/^aws sts get-caller-identity$/],
    answer: "aws sts get-caller-identity",
  },
  {
    ask: "Preview what Terraform will change, without changing anything.",
    accept: [/^terraform plan$/],
    answer: "terraform plan",
  },
  {
    ask: "Which pods use the most memory in namespace prod?",
    accept: [/^kubectl top (pod|pods|po) (-n|--namespace)[ =]prod( --sort-by[ =]memory)?$/, /^kubectl top (pod|pods|po) --sort-by[ =]memory (-n|--namespace)[ =]prod$/],
    answer: "kubectl top pods -n prod --sort-by=memory",
  },
  {
    ask: "Scale deployment web to 5 replicas.",
    accept: [/^kubectl scale (deploy|deployment)\/web --replicas[ =]5$/, /^kubectl scale --replicas[ =]5 (deploy|deployment)\/web$/, /^kubectl scale (deploy|deployment) web --replicas[ =]5$/],
    answer: "kubectl scale deploy/web --replicas=5",
  },
  {
    ask: "Follow the logs of the nginx systemd service live.",
    accept: [/^journalctl -u nginx(\.service)? -f$/, /^journalctl -f -u nginx(\.service)?$/, /^journalctl -fu nginx(\.service)?$/],
    answer: "journalctl -u nginx -f",
  },
  {
    ask: "Who is listening on port 8080 on this Linux box?",
    accept: [/^(ss|netstat) -[a-z]*l[a-z]*p[a-z]* ?(\| ?grep :?8080)?$/, /^lsof -i ?:8080$/, /^ss -[a-z]+ sport = :8080$/],
    answer: "lsof -i :8080   (or: ss -ltnp | grep 8080)",
  },
  {
    ask: "Get a shell inside pod debug-0.",
    accept: [/^kubectl exec (-it|-ti|-i -t|-t -i) debug-0 -- ?(\/bin\/)?(sh|bash)$/, /^kubectl exec debug-0 (-it|-ti) -- ?(\/bin\/)?(sh|bash)$/],
    answer: "kubectl exec -it debug-0 -- sh",
  },
  {
    ask: "List every pod in every namespace.",
    accept: [/^kubectl get (pods|pod|po) (-A|--all-namespaces)$/, /^kubectl get (-A|--all-namespaces) (pods|pod|po)$/],
    answer: "kubectl get pods -A",
  },
  {
    ask: "Show the history of the last 5 commits, one line each.",
    accept: [/^git log --oneline (-5|-n ?5|--max-count[ =]5)$/, /^git log (-5|-n ?5) --oneline$/],
    answer: "git log --oneline -5",
  },
  {
    ask: "How much disk is free on each mounted filesystem, human readable?",
    accept: [/^df -h$/, /^df -[a-z]*h[a-z]*$/],
    answer: "df -h",
  },
  {
    ask: "Restart all pods of deployment checkout without changing its spec.",
    accept: [/^kubectl rollout restart (deploy|deployment)\/checkout$/, /^kubectl rollout restart (deploy|deployment) checkout$/],
    answer: "kubectl rollout restart deploy/checkout",
  },
  {
    ask: "Upgrade Helm release shop with the chart in ./chart, installing it if it does not exist.",
    accept: [/^helm upgrade (--install|-i) shop \.\/chart$/, /^helm upgrade shop \.\/chart (--install|-i)$/],
    answer: "helm upgrade --install shop ./chart",
  },
  {
    ask: "Print the decoded value of key password in secret db-creds.",
    accept: [/^kubectl get secret db-creds -o (jsonpath|go-template)[= ]['"]?\{\.data\.password\}['"]? ?\| ?base64 (-d|--decode)$/],
    answer: "kubectl get secret db-creds -o jsonpath='{.data.password}' | base64 -d",
  },
];

const GAME_SECONDS = 60;
const BEST_KEY = "command-rush-best";

const normalise = (raw: string) =>
  raw
    .trim()
    .replace(/^\$\s*/, "")
    .replace(/^sudo\s+/, "")
    .replace(/\s+/g, " ")
    .replace(/^k /, "kubectl ")
    .replace(/^tf /, "terraform ");

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

type Log = { prompt: Prompt; typed: string; ok: boolean };

const CommandRush = () => {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [deck, setDeck] = useState<Prompt[]>([]);
  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [left, setLeft] = useState(GAME_SECONDS);
  const [log, setLog] = useState<Log[]>([]);
  const [shake, setShake] = useState(false);
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem(BEST_KEY) || 0);
    } catch {
      return 0;
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const score = log.filter((l) => l.ok).length;

  useEffect(() => {
    if (state !== "running") return;
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  useEffect(() => {
    if (state === "running" && left <= 0) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, state]);

  const start = () => {
    setDeck(shuffle(PROMPTS));
    setI(0);
    setLog([]);
    setLeft(GAME_SECONDS);
    setInput("");
    setState("running");
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const finish = () => setState("done");

  // record the best score once a round ends, from the final log
  useEffect(() => {
    if (state !== "done") return;
    setBest((b) => {
      const nextBest = Math.max(b, score);
      try {
        localStorage.setItem(BEST_KEY, String(nextBest));
      } catch {
        /* ignore */
      }
      return nextBest;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const next = (entry: Log) => {
    setLog((l) => [...l, entry]);
    setInput("");
    if (i + 1 >= deck.length) {
      setTimeout(finish, 0);
    } else setI(i + 1);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (state !== "running" || !input.trim()) return;
    const p = deck[i];
    const ok = p.accept.some((re) => re.test(normalise(input)));
    if (ok) next({ prompt: p, typed: input, ok });
    else {
      setShake(true);
      setTimeout(() => setShake(false), 350);
    }
  };

  const skip = () => next({ prompt: deck[i], typed: "", ok: false });

  const current = deck[i];

  return (
    <div className="max-w-[640px] mx-auto">
      <div className="panel overflow-hidden bg-[hsl(210_14%_9%)] dark:bg-[hsl(210_14%_5%)] border-transparent text-[hsl(40_16%_88%)]">
        <div className="flex items-center justify-between px-4 h-10 border-b border-white/10 font-mono text-[12px] text-white/60">
          <span>oncall@prod:~</span>
          <span>
            score <span className="text-[hsl(150_52%_60%)]">{score}</span> · best {best} ·{" "}
            <span className={cn(left <= 10 && state === "running" && "text-[hsl(4_75%_64%)]")}>{left}s</span>
          </span>
        </div>
        <div className="h-1 bg-white/10">
          <div className="h-full bg-[hsl(150_52%_52%)] transition-[width] duration-1000 ease-linear" style={{ width: `${(left / GAME_SECONDS) * 100}%` }} />
        </div>

        <div className="p-5 sm:p-6 min-h-[230px] font-mono text-[14px]">
          {state === "idle" && (
            <div>
              <p className="text-white/70 leading-relaxed">
                60 seconds. A situation appears, you type the command. kubectl, AWS, Terraform, Helm, Git and Linux.
                <br />
                <span className="text-white/45"># k works for kubectl, flag order does not matter</span>
              </p>
              <button onClick={start} className="mt-6 h-10 px-5 rounded-[4px] bg-[hsl(150_52%_52%)] text-[hsl(210_14%_7%)] font-sans font-medium">
                Start the clock
              </button>
            </div>
          )}

          {state === "running" && current && (
            <form onSubmit={submit}>
              <div className="text-white/45"># {i + 1}/{deck.length}</div>
              <p className="mt-1 text-[15.5px] font-sans leading-relaxed text-white">{current.ask}</p>
              <div className={cn("mt-5 flex items-center gap-2", shake && "animate-[shake_.35s]")}>
                <span className="text-[hsl(150_52%_60%)]">$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none caret-[hsl(40_90%_60%)] text-white"
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="Your command"
                />
              </div>
              <div className="mt-6 flex gap-4 text-[12px] text-white/50">
                <button type="submit" className="hover:text-white">enter ⏎ run</button>
                <button type="button" onClick={skip} className="hover:text-white">skip →</button>
                <button type="button" onClick={finish} className="hover:text-white">end</button>
              </div>
            </form>
          )}

          {state === "done" && (
            <div>
              <div className="text-[hsl(150_52%_60%)]">
                {score} correct
              </div>
              <ul className="mt-4 space-y-2.5 max-h-[260px] overflow-y-auto pr-2">
                {log.map((l, n) => (
                  <li key={n} className="text-[13px]">
                    <span className={l.ok ? "text-[hsl(150_52%_60%)]" : "text-[hsl(4_75%_64%)]"}>{l.ok ? "✔" : "✘"}</span>{" "}
                    <span className="text-white/70 font-sans">{l.prompt.ask}</span>
                    {!l.ok && <div className="pl-4 text-white/50">{l.prompt.answer}</div>}
                  </li>
                ))}
              </ul>
              <button onClick={start} className="mt-6 h-10 px-5 rounded-[4px] bg-[hsl(150_52%_52%)] text-[hsl(210_14%_7%)] font-sans font-medium">
                Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandRush;
