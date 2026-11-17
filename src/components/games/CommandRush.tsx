import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Command Rush: a situation, a bit of real terminal output, and you type the
 * command that handles it. Wrong attempts get a real explanation, `hint` gives
 * two levels of help, skipping shows the answer before moving on.
 */

type Tool = "kubectl" | "aws" | "terraform" | "helm" | "git" | "docker" | "linux";

interface Prompt {
  id: string;
  ask: string;
  /** terminal output shown above the prompt, to make the situation real */
  context?: string[];
  tool: Tool;
  accept: RegExp[];
  answer: string;
  /** hint 1 points at the idea, hint 2 shows the shape of the command */
  hints: [string, string];
  /** shown after the round: why this is the right move */
  why: string;
  /** common wrong moves with a specific explanation */
  near?: { re: RegExp; msg: string }[];
}

const LINUX_TOOLS = ["journalctl", "systemctl", "ss", "netstat", "lsof", "df", "du", "free", "top", "ps", "kill", "chmod", "chown", "tail", "grep", "dig", "nslookup", "curl", "openssl", "find", "ls", "cat", "head"];

const PROMPTS: Prompt[] = [
  {
    id: "logs-previous",
    ask: "payments-api keeps restarting. Read the logs from the run that crashed, not the fresh one.",
    context: ["$ kubectl get pods", "NAME                 READY  STATUS            RESTARTS", "payments-api-7d9f   0/1    CrashLoopBackOff  6"],
    tool: "kubectl",
    accept: [/^kubectl logs (payments-api-7d9f )?(--previous|-p|--previous=true)( payments-api-7d9f)?$/],
    answer: "kubectl logs payments-api-7d9f --previous",
    hints: ["kubectl logs shows the current container. There is a flag for the one that died.", "kubectl logs payments-api-7d9f --p…"],
    why: "After a crash the container is replaced, so plain `kubectl logs` shows the new, empty run. `--previous` reads the last terminated one.",
    near: [
      { re: /^kubectl logs payments-api-7d9f$/, msg: "That shows the new container that just started. You want the one that crashed." },
      { re: /^kubectl describe/, msg: "describe shows events and exit codes, not the app's own log output." },
    ],
  },
  {
    id: "rollout-undo",
    ask: "The 14:02 deploy of checkout broke prod. Roll it back to the previous revision, now.",
    context: ["$ kubectl rollout history deploy/checkout", "REVISION  CHANGE-CAUSE", "11        image: checkout:2.3.0", "12        image: checkout:2.4.0  <- broken"],
    tool: "kubectl",
    accept: [/^kubectl rollout undo (deploy|deployment|deployments)(\/| )checkout( --to-revision[= ]11)?$/],
    answer: "kubectl rollout undo deploy/checkout",
    hints: ["Deployments keep their revision history. There is a rollout sub-command for going back.", "kubectl rollout u… deploy/checkout"],
    why: "`rollout undo` switches back to the previous ReplicaSet in seconds. Fix forward in Git afterwards so Argo CD does not re-apply the bad version.",
    near: [
      { re: /^kubectl rollout restart/, msg: "restart re-creates pods on the same broken image. You need the previous revision." },
      { re: /^kubectl set image/, msg: "That works, but it is the slow way. There is a one-word sub-command for going back a revision." },
    ],
  },
  {
    id: "describe-pending",
    ask: "worker-1 has been Pending for 10 minutes. Find out why the scheduler will not place it.",
    context: ["$ kubectl get pod worker-1", "NAME       READY  STATUS   RESTARTS  AGE", "worker-1   0/1    Pending  0         10m"],
    tool: "kubectl",
    accept: [/^kubectl describe (pod|pods|po)(\/| )worker-1$/],
    answer: "kubectl describe pod worker-1",
    hints: ["A Pending pod has no logs yet. The reason is in its events.", "kubectl desc… pod worker-1"],
    why: "The Events section at the bottom of `describe` tells you exactly why: insufficient CPU, a taint, an unbound PVC, a node selector.",
    near: [{ re: /^kubectl logs/, msg: "A Pending pod never started, so there are no logs. Look at its events." }],
  },
  {
    id: "top-memory",
    ask: "Memory alerts are firing in prod. Which pods are using the most memory right now?",
    tool: "kubectl",
    accept: [
      /^kubectl top (pod|pods|po) (-n|--namespace)[ =]prod( --sort-by[ =]memory)?$/,
      /^kubectl top (pod|pods|po) --sort-by[ =]memory (-n|--namespace)[ =]prod$/,
      /^kubectl (-n|--namespace)[ =]prod top (pod|pods|po)( --sort-by[ =]memory)?$/,
    ],
    answer: "kubectl top pods -n prod --sort-by=memory",
    hints: ["metrics-server gives live usage per pod. Do not forget the namespace.", "kubectl top pods -n prod --sort-by=…"],
    why: "`kubectl top` reads live usage from metrics-server. Sorting by memory puts the suspect at the top.",
    near: [{ re: /^kubectl top (pod|pods|po)( --sort-by[ =]memory)?$/, msg: "Close, but that is the default namespace. The alert is in prod." }],
  },
  {
    id: "exec-shell",
    ask: "You need a shell inside debug-0 to test DNS from the pod's point of view.",
    tool: "kubectl",
    accept: [/^kubectl exec (-it|-ti|-i -t|-t -i|--stdin --tty|--tty --stdin) debug-0 -- ?(\/bin\/)?(sh|bash)$/, /^kubectl exec debug-0 (-it|-ti) -- ?(\/bin\/)?(sh|bash)$/],
    answer: "kubectl exec -it debug-0 -- sh",
    hints: ["You want an interactive terminal inside the container.", "kubectl exec -it debug-0 -- …"],
    why: "`-it` gives you an interactive TTY, and everything after `--` runs inside the container.",
    near: [{ re: /^kubectl exec debug-0 -- ?(\/bin\/)?(sh|bash)$/, msg: "Without -it the shell exits immediately. Make it interactive." }],
  },
  {
    id: "all-pods",
    ask: "Quick health check: list every pod in every namespace.",
    tool: "kubectl",
    accept: [/^kubectl get (pods|pod|po) (-A|--all-namespaces)$/, /^kubectl get (-A|--all-namespaces) (pods|pod|po)$/],
    answer: "kubectl get pods -A",
    hints: ["One flag means every namespace.", "kubectl get pods -…"],
    why: "`-A` is short for `--all-namespaces`.",
    near: [{ re: /^kubectl get (pods|pod|po)$/, msg: "That is only the current namespace." }],
  },
  {
    id: "rollout-restart",
    ask: "You rotated the database password in the Secret. Restart every checkout pod so they pick it up, without editing the Deployment.",
    tool: "kubectl",
    accept: [/^kubectl rollout restart (deploy|deployment|deployments)(\/| )checkout$/],
    answer: "kubectl rollout restart deploy/checkout",
    hints: ["Env vars from Secrets are read at start-up. You need a rolling restart.", "kubectl rollout r… deploy/checkout"],
    why: "`rollout restart` adds an annotation that triggers a normal rolling update, so there is no downtime.",
    near: [{ re: /^kubectl delete (pod|pods)/, msg: "Deleting pods by hand works but can drop traffic. There is a rollout sub-command for this." }],
  },
  {
    id: "scale",
    ask: "Black Friday traffic is coming. Scale deployment web to 8 replicas.",
    tool: "kubectl",
    accept: [/^kubectl scale (deploy|deployment)(\/| )web --replicas[ =]8$/, /^kubectl scale --replicas[ =]8 (deploy|deployment)(\/| )web$/],
    answer: "kubectl scale deploy/web --replicas=8",
    hints: ["There is a kubectl verb that is literally the word you want.", "kubectl scale deploy/web --replicas=…"],
    why: "Quick and direct. If an HPA manages this deployment, raise its minReplicas instead or it will scale you back down.",
  },
  {
    id: "secret-decode",
    ask: "The app says the DB password is wrong. Print the decoded password key from secret db-creds.",
    tool: "kubectl",
    accept: [/^kubectl get secret db-creds -o (jsonpath|go-template)=?['"]?\{\.data\.password\}['"]? ?\| ?base64 (-d|--decode)$/],
    answer: "kubectl get secret db-creds -o jsonpath='{.data.password}' | base64 -d",
    hints: ["Secret values are base64-encoded. Pull out one key, then decode it.", "kubectl get secret db-creds -o jsonpath='{.data.password}' | base64 …"],
    why: "jsonpath extracts the single key and `base64 -d` decodes it. Never paste it into a ticket.",
    near: [{ re: /^kubectl get secret db-creds( -o yaml)?$/, msg: "That shows the whole secret, still base64-encoded. Extract one key and decode it." }],
  },
  {
    id: "aws-whoami",
    ask: "Terraform says AccessDenied. First, check which AWS identity your CLI is actually using.",
    tool: "aws",
    accept: [/^aws sts get-caller-identity( --profile \S+)?$/],
    answer: "aws sts get-caller-identity",
    hints: ["The STS service can tell you who you are.", "aws sts get-…"],
    why: "Half of all AccessDenied errors are the wrong profile or an expired role session. This shows the account and ARN in one call.",
    near: [{ re: /^aws iam get-user$/, msg: "That fails for assumed roles and SSO sessions. Ask STS instead." }],
  },
  {
    id: "aws-s3-ls",
    ask: "Check that last night's backups landed in s3://pay-backups/db/.",
    tool: "aws",
    accept: [/^aws s3 ls s3:\/\/pay-backups\/db\/?( --recursive)?( --human-readable)?( --summarize)?$/],
    answer: "aws s3 ls s3://pay-backups/db/",
    hints: ["The high-level s3 commands work like ls.", "aws s3 ls s3://…"],
    why: "`aws s3 ls` lists a prefix. Add `--recursive --human-readable` to see sizes.",
  },
  {
    id: "tf-plan",
    ask: "Someone changed the security group module. Preview what Terraform would change, without touching anything.",
    tool: "terraform",
    accept: [/^terraform plan( -out[ =]\S+)?$/],
    answer: "terraform plan",
    hints: ["You want a dry run.", "terraform p…"],
    why: "`plan` shows the diff between code and real infrastructure. Save it with `-out` and apply exactly that file.",
    near: [{ re: /^terraform apply/, msg: "apply changes real infrastructure. You only want to look." }],
  },
  {
    id: "tf-state",
    ask: "Which resources does this Terraform state know about? List them.",
    tool: "terraform",
    accept: [/^terraform state list$/],
    answer: "terraform state list",
    hints: ["There is a state sub-command for this.", "terraform state l…"],
    why: "`state list` prints every address in state, handy before an import, move or remove.",
    near: [{ re: /^terraform show$/, msg: "show prints everything in detail. You only want the list of addresses." }],
  },
  {
    id: "helm-upgrade",
    ask: "Deploy release shop from ./chart: upgrade it if it exists, install it if it does not.",
    tool: "helm",
    accept: [/^helm upgrade (--install|-i) shop \.\/chart( (-n|--namespace)[ =]\S+)?$/, /^helm upgrade shop \.\/chart (--install|-i)( (-n|--namespace)[ =]\S+)?$/],
    answer: "helm upgrade --install shop ./chart",
    hints: ["One command handles both cases, which is why every pipeline uses it.", "helm upgrade --i… shop ./chart"],
    why: "`upgrade --install` is idempotent, so the same pipeline step works on day one and day one hundred.",
    near: [{ re: /^helm install shop/, msg: "install fails if the release already exists. You want one command for both cases." }],
  },
  {
    id: "helm-rollback",
    ask: "Release shop is broken after the last upgrade. Roll it back to revision 3.",
    tool: "helm",
    accept: [/^helm rollback shop 3( (-n|--namespace)[ =]\S+)?$/],
    answer: "helm rollback shop 3",
    hints: ["Helm keeps release revisions.", "helm rollback shop …"],
    why: "`helm history shop` lists revisions, and `helm rollback` restores one as a new revision.",
  },
  {
    id: "git-log",
    ask: "What changed recently? Show the last 5 commits, one line each.",
    tool: "git",
    accept: [/^git log --oneline (-5|-n ?5|--max-count[ =]5)$/, /^git log (-5|-n ?5|--max-count[ =]5) --oneline$/],
    answer: "git log --oneline -5",
    hints: ["git log has a compact one-line format and a count flag.", "git log --oneline -…"],
    why: "Quick and readable. Add `--graph` when branches matter.",
  },
  {
    id: "git-revert",
    ask: "Commit a1b2c3d broke main and is already pushed. Undo it without rewriting history.",
    tool: "git",
    accept: [/^git revert a1b2c3d( --no-edit)?$/],
    answer: "git revert a1b2c3d",
    hints: ["Shared history should not be rewritten. Add a new commit that undoes the old one.", "git rev… a1b2c3d"],
    why: "`revert` adds an inverse commit, so nobody else's clone breaks.",
    near: [{ re: /^git reset/, msg: "reset rewrites history that other people have already pulled. Undo it with a new commit instead." }],
  },
  {
    id: "docker-logs",
    ask: "The api container on this VM died. Show the last 100 lines of its logs.",
    tool: "docker",
    accept: [/^docker logs (--tail[ =]100|-n ?100) api$/, /^docker logs api (--tail[ =]100|-n ?100)$/],
    answer: "docker logs --tail 100 api",
    hints: ["docker logs works on stopped containers too. Limit the output.", "docker logs --tail … api"],
    why: "Logs survive until the container is removed, so you can read why it died.",
    near: [{ re: /^docker logs api$/, msg: "That dumps everything. Limit it to the last 100 lines." }],
  },
  {
    id: "journal",
    ask: "nginx on this box will not stay up. Follow its systemd logs live.",
    tool: "linux",
    accept: [/^journalctl (-u nginx(\.service)? -f|-f -u nginx(\.service)?|-fu nginx(\.service)?|-u nginx(\.service)? --follow)$/],
    answer: "journalctl -u nginx -f",
    hints: ["systemd services log to the journal.", "journalctl -u nginx -…"],
    why: "`-u` filters to one unit, `-f` follows like `tail -f`.",
    near: [{ re: /^systemctl status nginx/, msg: "status shows the last few lines only. Follow the journal instead." }],
  },
  {
    id: "port",
    ask: "The app fails with 'address already in use'. Who is listening on port 8080?",
    tool: "linux",
    accept: [/^(sudo )?(ss|netstat) -[a-z]*l[a-z]*p[a-z]*( ?\| ?grep :?8080)?$/, /^(sudo )?lsof -i ?:8080$/, /^(sudo )?ss -[a-z]+ 'sport = :8080'$/],
    answer: "ss -ltnp | grep 8080   (or: lsof -i :8080)",
    hints: ["You want listening sockets plus the process that owns them.", "ss -ltnp | grep … (or lsof -i :…)"],
    why: "`-l` listening, `-t` TCP, `-n` numeric, `-p` process. That shows the PID to deal with.",
  },
  {
    id: "disk",
    ask: "Pods on node-3 are being evicted with DiskPressure. You are on the node. How full is each filesystem?",
    tool: "linux",
    accept: [/^df -[a-zA-Z]*h[a-zA-Z]*$/],
    answer: "df -h",
    hints: ["Disk free, in human units.", "df -…"],
    why: "`df -h` shows usage per mount. Then `du -sh /var/lib/*` finds what is eating it.",
    near: [{ re: /^du /, msg: "du tells you what uses space inside a folder. First see which filesystem is full." }],
  },
  {
    id: "cert",
    ask: "Users say the certificate on api.example.com expired. Check its expiry date from your terminal.",
    tool: "linux",
    accept: [
      /^(echo \| )?openssl s_client -connect api\.example\.com:443( -servername api\.example\.com)?( 2>\/dev\/null)? ?\| ?openssl x509 -noout -(enddate|dates)$/,
      /^curl -(v|vI|Iv) https:\/\/api\.example\.com\/?( 2>&1 \| ?grep -i expire)?$/,
    ],
    answer: "openssl s_client -connect api.example.com:443 | openssl x509 -noout -enddate",
    hints: ["openssl can connect and then print the certificate dates.", "openssl s_client -connect api.example.com:443 | openssl x509 -noout -…"],
    why: "Shows notAfter straight from the server, including what a CDN or load balancer is actually serving.",
  },
];

const GAME_SECONDS = 90;
const BEST_KEY = "command-rush-best-v2";
const TOOL_HINT: Record<Tool, string> = {
  kubectl: "kubectl",
  aws: "aws",
  terraform: "terraform",
  helm: "helm",
  git: "git",
  docker: "docker",
  linux: "a Linux command",
};

const normalise = (raw: string) =>
  raw
    .trim()
    .replace(/^\$\s*/, "")
    .replace(/^sudo\s+(?!lsof|ss|netstat)/, "")
    .replace(/\s+/g, " ")
    .replace(/;$/, "")
    .replace(/^k /, "kubectl ")
    .replace(/^tf /, "terraform ")
    .replace(/"/g, "'");

const firstWord = (cmd: string) => cmd.replace(/^sudo /, "").split(" ")[0];

const toolOf = (cmd: string): Tool | null => {
  const w = firstWord(cmd);
  if (["kubectl", "aws", "terraform", "helm", "git", "docker"].includes(w)) return w as Tool;
  if (LINUX_TOOLS.includes(w) || w === "echo") return "linux";
  return null;
};

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

type Line = { kind: "in" | "err" | "warn" | "hint" | "ok" | "info"; text: string };
type Result = { prompt: Prompt; outcome: "solved" | "skipped"; hints: number; points: number };
type Phase = "idle" | "ask" | "reveal" | "done";

const points = (hints: number) => (hints === 0 ? 2 : hints === 1 ? 1 : 0);

const CommandRush = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [deck, setDeck] = useState<Prompt[]>([]);
  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [left, setLeft] = useState(GAME_SECONDS);
  const [lines, setLines] = useState<Line[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [shake, setShake] = useState(false);
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem(BEST_KEY) || 0);
    } catch {
      return 0;
    }
  });
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
    setBest((b) => {
      const v = Math.max(b, score);
      try {
        localStorage.setItem(BEST_KEY, String(v));
      } catch {
        /* storage blocked */
      }
      return v;
    });
  }, [phase, score]);

  const start = () => {
    setDeck(shuffle(PROMPTS).slice(0, 12));
    setI(0);
    setResults([]);
    setLeft(GAME_SECONDS);
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

    if (current.accept.some((re) => re.test(cmd))) {
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
            style={{ width: `${(left / GAME_SECONDS) * 100}%` }}
          />
        </div>

        <div className="p-4 sm:p-6 font-mono text-[13px] sm:text-[13.5px] min-h-[340px]">
          {phase === "idle" && (
            <div>
              <p className="font-sans text-[16px] text-white leading-relaxed">
                12 real on-call situations, {GAME_SECONDS} seconds. Type the command that handles each one.
              </p>
              <ul className="mt-4 space-y-1.5 text-white/60 text-[13px]">
                <li><span className="text-[hsl(158_72%_60%)]">+2</span> solved on your own · <span className="text-[hsl(158_72%_60%)]">+1</span> with one hint · 0 with two</li>
                <li>wrong attempts cost nothing but time, and tell you what was off</li>
                <li>type <span className="text-white">hint</span> or <span className="text-white">skip</span> any time · ↑ recalls your last attempt</li>
                <li><span className="text-white">k</span> works for kubectl, flag order does not matter</li>
              </ul>
              <button onClick={start} className={cn(btn, "mt-6 bg-[hsl(158_72%_52%)] text-[hsl(226_45%_7%)] hover:bg-[hsl(158_72%_60%)]")}>
                Start the clock
              </button>
            </div>
          )}

          {(phase === "ask" || phase === "reveal") && current && (
            <div>
              <div className="flex items-center justify-between text-white/40 text-[12px]">
                <span>
                  # {i + 1}/{deck.length} · {TOOL_HINT[current.tool]}
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
              <button onClick={start} className={cn(btn, "mt-6 bg-[hsl(158_72%_52%)] text-[hsl(226_45%_7%)] hover:bg-[hsl(158_72%_60%)]")}>
                Play again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandRush;
export { PROMPTS, normalise };
