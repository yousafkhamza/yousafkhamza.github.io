/**
 * Question bank for Command Rush.
 * Each situation has the command that handles it. Answers are compared after
 * normalise(): extra spaces, a leading "$ ", "sudo ", the k/tf aliases and
 * double quotes are evened out, so only the parts that matter are checked.
 *
 * Levels (tools in play):
 *   1 Linux shell
 *   2 AWS + Linux
 *   3 Terraform + AWS + Linux
 *   4 Docker + Terraform + AWS + Linux
 *   5 Kubernetes, Helm, Docker, Terraform, AWS, Linux, Ansible, Python, Git
 */

export type Tool = "linux" | "aws" | "terraform" | "docker" | "kubectl" | "helm" | "git" | "ansible" | "python";

export interface Cmd {
  id: string;
  level: 1 | 2 | 3 | 4 | 5;
  tool: Tool;
  ask: string;
  /** terminal output shown above the prompt */
  context?: string[];
  /** exact strings (after normalise) or patterns that count as correct */
  accept: (string | RegExp)[];
  answer: string;
  hints: [string, string];
  why: string;
  near?: { re: RegExp; msg: string }[];
}

export const LEVELS = [
  { level: 1, name: "Shell", tools: "Linux", blurb: "the box in front of you" },
  { level: 2, name: "Cloud", tools: "AWS + Linux", blurb: "your AWS account from the CLI" },
  { level: 3, name: "IaC", tools: "Terraform + AWS + Linux", blurb: "infrastructure as code" },
  { level: 4, name: "Containers", tools: "Docker + Terraform + AWS + Linux", blurb: "build, ship, run" },
  { level: 5, name: "Platform", tools: "K8s, Helm, Ansible, Python, Git + all", blurb: "everything at once" },
] as const;

/** questions per round and seconds on the clock for each level */
export const roundSpec = (level: number) => ({ questions: level + 5, seconds: 60 + level * 15 });

export const TOOL_HINT: Record<Tool, string> = {
  linux: "a Linux command",
  aws: "the aws CLI",
  terraform: "terraform",
  docker: "docker",
  kubectl: "kubectl",
  helm: "helm",
  git: "git",
  ansible: "ansible",
  python: "python / pip",
};

const LINUX = [
  "journalctl", "systemctl", "ss", "netstat", "lsof", "df", "du", "free", "top", "htop", "ps", "pgrep", "pidof", "kill", "pkill",
  "chmod", "chown", "tail", "head", "less", "cat", "grep", "awk", "sed", "sort", "uniq", "wc", "cut", "dig", "nslookup", "host",
  "curl", "wget", "openssl", "find", "ls", "pwd", "cd", "mkdir", "cp", "mv", "rm", "tar", "scp", "rsync", "ssh", "uptime", "uname",
  "who", "w", "last", "crontab", "echo", "printenv", "export", "watch", "ip", "route", "nc", "telnet", "ping", "traceroute", "mtr",
  "nginx", "timedatectl", "base64", "diff", "usermod", "useradd", "gpasswd", "id", "hostname", "hostnamectl", "lsb_release", "chronyc", "service", "env", "trivy", "dot", "jq", "date", "stat", "file",
];

export const normalise = (raw: string) =>
  raw
    .trim()
    .replace(/^\$\s*/, "")
    .replace(/^sudo\s+(?!lsof|ss|netstat)/, "")
    .replace(/\s+/g, " ")
    .replace(/;$/, "")
    .replace(/^k /, "kubectl ")
    .replace(/^tf /, "terraform ")
    .replace(/"/g, "'");

export const firstWord = (cmd: string) => cmd.replace(/^sudo /, "").split(" ")[0];

export const toolOf = (cmd: string): Tool | null => {
  const w = firstWord(cmd);
  if (["kubectl", "aws", "terraform", "helm", "git", "docker"].includes(w)) return w as Tool;
  if (w === "docker-compose") return "docker";
  if (w.startsWith("ansible")) return "ansible";
  if (["python", "python3", "pip", "pip3", "source", "deactivate"].includes(w)) return "python";
  if (LINUX.includes(w)) return "linux";
  return null;
};

export const isCorrect = (c: Cmd, typed: string) => {
  const n = normalise(typed);
  return c.accept.some((a) => (typeof a === "string" ? normalise(a) === n : a.test(n)));
};

type Extra = { context?: string[]; near?: [RegExp, string][] };
/** compact builder: the canonical answer is always accepted */
const c = (
  level: Cmd["level"],
  tool: Tool,
  id: string,
  ask: string,
  answer: string,
  also: (string | RegExp)[],
  hints: [string, string],
  why: string,
  extra: Extra = {}
): Cmd => ({
  id,
  level,
  tool,
  ask,
  answer,
  accept: [answer, ...also],
  hints,
  why,
  context: extra.context,
  near: extra.near?.map(([re, msg]) => ({ re, msg })),
});

const ORIGINAL: Cmd[] = [
  {
    id: "logs-previous",
    level: 5,
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
    level: 5,
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
    level: 5,
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
    level: 5,
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
    level: 5,
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
    level: 5,
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
    level: 5,
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
    level: 5,
    ask: "Black Friday traffic is coming. Scale deployment web to 8 replicas.",
    tool: "kubectl",
    accept: [/^kubectl scale (deploy|deployment)(\/| )web --replicas[ =]8$/, /^kubectl scale --replicas[ =]8 (deploy|deployment)(\/| )web$/],
    answer: "kubectl scale deploy/web --replicas=8",
    hints: ["There is a kubectl verb that is literally the word you want.", "kubectl scale deploy/web --replicas=…"],
    why: "Quick and direct. If an HPA manages this deployment, raise its minReplicas instead or it will scale you back down.",
  },
  {
    id: "secret-decode",
    level: 5,
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
    level: 2,
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
    level: 2,
    ask: "Check that last night's backups landed in s3://pay-backups/db/.",
    tool: "aws",
    accept: [/^aws s3 ls s3:\/\/pay-backups\/db\/?( --recursive)?( --human-readable)?( --summarize)?$/],
    answer: "aws s3 ls s3://pay-backups/db/",
    hints: ["The high-level s3 commands work like ls.", "aws s3 ls s3://…"],
    why: "`aws s3 ls` lists a prefix. Add `--recursive --human-readable` to see sizes.",
  },
  {
    id: "tf-plan",
    level: 3,
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
    level: 3,
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
    level: 5,
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
    level: 5,
    ask: "Release shop is broken after the last upgrade. Roll it back to revision 3.",
    tool: "helm",
    accept: [/^helm rollback shop 3( (-n|--namespace)[ =]\S+)?$/],
    answer: "helm rollback shop 3",
    hints: ["Helm keeps release revisions.", "helm rollback shop …"],
    why: "`helm history shop` lists revisions, and `helm rollback` restores one as a new revision.",
  },
  {
    id: "git-log",
    level: 5,
    ask: "What changed recently? Show the last 5 commits, one line each.",
    tool: "git",
    accept: [/^git log --oneline (-5|-n ?5|--max-count[ =]5)$/, /^git log (-5|-n ?5|--max-count[ =]5) --oneline$/],
    answer: "git log --oneline -5",
    hints: ["git log has a compact one-line format and a count flag.", "git log --oneline -…"],
    why: "Quick and readable. Add `--graph` when branches matter.",
  },
  {
    id: "git-revert",
    level: 5,
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
    level: 4,
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
    level: 1,
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
    level: 1,
    ask: "The app fails with 'address already in use'. Who is listening on port 8080?",
    tool: "linux",
    accept: [/^(sudo )?(ss|netstat) -[a-z]*l[a-z]*p[a-z]*( ?\| ?grep :?8080)?$/, /^(sudo )?lsof -i ?:8080$/, /^(sudo )?ss -[a-z]+ 'sport = :8080'$/],
    answer: "ss -ltnp | grep 8080   (or: lsof -i :8080)",
    hints: ["You want listening sockets plus the process that owns them.", "ss -ltnp | grep … (or lsof -i :…)"],
    why: "`-l` listening, `-t` TCP, `-n` numeric, `-p` process. That shows the PID to deal with.",
  },
  {
    id: "disk",
    level: 1,
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
    level: 2,
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

const L1: Cmd[] = [
  c(1, "linux", "pwd", "You just SSH'd in after a long night and lost track. Which directory are you in?", "pwd", [], ["Print the working directory.", "p…"], "pwd prints the absolute path of where you are, before you run anything destructive."),
  c(1, "linux", "ls-hidden", "The deploy left a .env file somewhere in this folder. List everything, hidden files included, with sizes and owners.", "ls -la", ["ls -al", "ls -lA", "ls -Al", "ls -lah", "ls -alh", "ls -la .", "ls -al ."], ["Long listing, plus the flag that shows dotfiles.", "ls -l…"], "-l gives the long format (owner, size, date) and -a includes dotfiles like .env.", { near: [[/^ls( -l)?$/, "Close, but hidden files like .env are not shown without -a."]] }),
  c(1, "linux", "du-log", "/var is at 92%. How big is /var/log in total, in human units?", "du -sh /var/log", ["du -hs /var/log", "du -sh /var/log/"], ["Disk usage, summarised, human readable.", "du -sh …"], "-s gives one total instead of every file, -h prints it as G or M.", { near: [[/^df/, "df shows whole filesystems. You want the size of one folder."]] }),
  c(1, "linux", "free", "The box feels sluggish. How much memory is free right now?", "free -h", ["free -m", "free -mh", "free -g"], ["There is a command literally named for this.", "free -…"], "free -h shows used, free and available memory. 'available' is the number that matters, not 'free'."),
  c(1, "linux", "tail-follow", "Watch /var/log/syslog live while you restart the service in another window.", "tail -f /var/log/syslog", ["tail -F /var/log/syslog", "tail -n 100 -f /var/log/syslog", "tail -f -n 100 /var/log/syslog"], ["Show the end of the file and keep following it.", "tail -… /var/log/syslog"], "tail -f keeps printing new lines as they arrive. -F also survives log rotation."),
  c(1, "linux", "tail-n", "Show the last 50 lines of app.log.", "tail -n 50 app.log", ["tail -50 app.log", "tail -n50 app.log", "tail --lines=50 app.log"], ["The opposite of head.", "tail -n … app.log"], "tail reads from the end of the file, so it is instant even on huge logs."),
  c(1, "linux", "grep-error", "Find every line containing ERROR in app.log.", "grep ERROR app.log", ["grep 'ERROR' app.log", "grep -n ERROR app.log", "grep -n 'ERROR' app.log"], ["Search text for a pattern.", "grep … app.log"], "grep prints matching lines. Add -n for line numbers, -c to just count them."),
  c(1, "linux", "grep-ri", "Which nginx config file sets a timeout? Search /etc/nginx recursively, ignoring case.", "grep -ri timeout /etc/nginx", ["grep -ir timeout /etc/nginx", "grep -Ri timeout /etc/nginx", "grep -iR timeout /etc/nginx", "grep -rni timeout /etc/nginx", "grep -rin timeout /etc/nginx", "grep -ri 'timeout' /etc/nginx"], ["grep has flags for recursive and case-insensitive.", "grep -r… timeout /etc/nginx"], "-r walks the directory, -i ignores case, so proxy_read_timeout and Timeout both match."),
  c(1, "linux", "wc", "How many requests are in access.log? Count its lines.", "wc -l access.log", ["wc -l < access.log", "cat access.log | wc -l"], ["Word count has a lines flag.", "wc -… access.log"], "wc -l counts newline characters, so one line per request."),
  c(1, "linux", "find-big", "Something under /var is eating the disk. Find files bigger than 100 MB.", "find /var -size +100M", ["find /var -type f -size +100M", "find /var -size +100M -type f", "find /var -xdev -size +100M", "find /var -xdev -type f -size +100M"], ["find can filter by size.", "find /var -size +…"], "+100M means larger than 100 MB. Add -xdev to stay on one filesystem."),
  c(1, "linux", "find-mtime", "Which .log files in /var/log changed in the last 24 hours?", "find /var/log -name '*.log' -mtime -1", ["find /var/log -mtime -1 -name '*.log'", "find /var/log -type f -name '*.log' -mtime -1", "find /var/log -name '*.log' -mmin -1440"], ["find by name pattern and modification time in days.", "find /var/log -name '*.log' -mtime …"], "-mtime -1 means modified less than one day ago. Quote the pattern so the shell does not expand it."),
  c(1, "linux", "chmod-x", "./deploy.sh says 'Permission denied'. Make it executable.", "chmod +x deploy.sh", ["chmod u+x deploy.sh", "chmod 755 deploy.sh", "chmod 750 deploy.sh", "chmod 700 deploy.sh"], ["Change mode: add the execute bit.", "chmod +… deploy.sh"], "The file is missing the execute bit. +x adds it without touching read and write.", { near: [[/^chmod 777/, "777 works but lets everyone write to your deploy script. Just add the execute bit."]] }),
  c(1, "linux", "chown-r", "The app runs as user app but /srv/app is owned by root. Give the whole tree to app:app.", "chown -R app:app /srv/app", ["chown -R app.app /srv/app", "chown app:app -R /srv/app"], ["Change owner, recursively, user:group.", "chown -R app:app …"], "-R applies it to every file and folder inside."),
  c(1, "linux", "top", "Load average is 12 on a 4-core box. Open the live view of which processes are using CPU.", "top", ["htop", "top -o %CPU", "top -c"], ["The classic live process monitor.", "t…"], "top sorts by CPU by default. Press M to sort by memory, 1 to see per-core usage."),
  c(1, "linux", "pgrep", "Is nginx actually running? Find its process.", "pgrep -a nginx", ["pgrep nginx", "pidof nginx", "ps aux | grep nginx", "ps -ef | grep nginx", "ps aux | grep [n]ginx", "pgrep -l nginx"], ["Look up processes by name.", "pgrep … nginx (or ps aux | grep nginx)"], "pgrep prints matching PIDs; -a adds the full command line."),
  c(1, "linux", "kill-term", "Process 4242 is stuck. Ask it to stop gracefully first.", "kill 4242", ["kill -15 4242", "kill -TERM 4242", "kill -s TERM 4242", "kill -SIGTERM 4242"], ["The default signal is the polite one.", "kill …"], "kill sends SIGTERM, so the app can close connections and flush data. -9 is the last resort.", { near: [[/^kill -9/, "SIGKILL gives the process no chance to clean up. Try the graceful signal first."]] }),
  c(1, "linux", "systemctl-status", "Users get 502s. Check whether the nginx service is running and see its last log lines.", "systemctl status nginx", ["systemctl status nginx.service", "service nginx status"], ["systemd's control tool has a status verb.", "systemctl status …"], "status shows active/failed, the PID, memory and the last few journal lines in one screen."),
  c(1, "linux", "systemctl-restart", "You fixed the config. Restart nginx.", "systemctl restart nginx", ["systemctl restart nginx.service", "service nginx restart"], ["systemctl verb for stop then start.", "systemctl r… nginx"], "restart stops and starts the unit. For nginx, reload is gentler because it keeps connections."),
  c(1, "linux", "systemctl-enable", "After the last reboot the app did not come back. Make it start on boot and start it now.", "systemctl enable --now app", ["systemctl enable app --now", "systemctl enable --now app.service"], ["enable for boot, plus a flag to also start it.", "systemctl enable --… app"], "enable creates the boot symlink; --now also starts it so you do not need a second command.", { near: [[/^systemctl enable app$/, "That only takes effect at the next boot. Start it now as well."]] }),
  c(1, "linux", "nginx-t", "Before reloading nginx in production, check the new config for syntax errors.", "nginx -t", ["nginx -T", "nginx -t -c /etc/nginx/nginx.conf"], ["nginx has a test flag.", "nginx -…"], "nginx -t parses the config without touching the running server, so a typo does not take the site down."),
  c(1, "linux", "dig", "Users in one office cannot reach api.example.com. What IP does it resolve to from here?", "dig +short api.example.com", ["dig api.example.com", "nslookup api.example.com", "host api.example.com", "dig api.example.com +short", "dig a api.example.com"], ["A DNS lookup tool.", "dig … api.example.com"], "dig shows the answer and which server gave it. +short prints only the IPs."),
  c(1, "linux", "curl-head", "Is https://shop.example.com up, and what status code does it return? Fetch just the headers.", "curl -I https://shop.example.com", ["curl -sI https://shop.example.com", "curl -Is https://shop.example.com", "curl --head https://shop.example.com", "curl -IL https://shop.example.com", "curl -sIL https://shop.example.com"], ["curl can fetch headers only.", "curl -I https://…"], "-I sends a HEAD request, so you see the status, redirects and cache headers without the body."),
  c(1, "linux", "nc-port", "The app cannot reach Postgres. Test whether port 5432 on db.internal is open from this box.", "nc -zv db.internal 5432", ["nc -vz db.internal 5432", "nc -z -v db.internal 5432", "telnet db.internal 5432", "nc -zvw3 db.internal 5432"], ["netcat can just test a connection.", "nc -zv db.internal …"], "-z scans without sending data, -v says succeeded or refused. Refused means nothing listens; a timeout usually means a firewall or security group."),
  c(1, "linux", "ip-a", "Which IP addresses does this server have?", "ip a", ["ip addr", "ip address", "ip addr show", "ip -br a", "ip -br addr", "hostname -I", "ip a s"], ["The modern iproute2 command.", "ip …"], "ip a lists every interface with its addresses. ifconfig is deprecated on most distros."),
  c(1, "linux", "ip-route", "Traffic to 10.20.0.0/16 goes nowhere. Show the routing table.", "ip route", ["ip r", "ip route show", "route -n", "netstat -rn"], ["iproute2 again, a different object.", "ip r…"], "ip route shows which gateway and interface each network uses."),
  c(1, "linux", "tar-x", "Unpack backup.tar.gz here.", "tar -xzf backup.tar.gz", ["tar xzf backup.tar.gz", "tar -xvzf backup.tar.gz", "tar -zxvf backup.tar.gz", "tar -xf backup.tar.gz", "tar xf backup.tar.gz", "tar -zxf backup.tar.gz", "tar xvzf backup.tar.gz"], ["x for extract, z for gzip, f for the file.", "tar -x… backup.tar.gz"], "Modern tar detects gzip on extract, so -xf works too."),
  c(1, "linux", "tar-c", "Before you touch it, archive /etc/nginx into nginx-backup.tar.gz.", "tar -czf nginx-backup.tar.gz /etc/nginx", ["tar czf nginx-backup.tar.gz /etc/nginx", "tar -czvf nginx-backup.tar.gz /etc/nginx", "tar -zcvf nginx-backup.tar.gz /etc/nginx", "tar -zcf nginx-backup.tar.gz /etc/nginx"], ["c for create.", "tar -czf nginx-backup.tar.gz …"], "A ten-second backup before any config change is the cheapest rollback there is."),
  c(1, "linux", "scp", "Copy app.tar.gz to /tmp on the server 10.0.1.5 as user deploy.", "scp app.tar.gz deploy@10.0.1.5:/tmp/", ["scp app.tar.gz deploy@10.0.1.5:/tmp", "rsync -avz app.tar.gz deploy@10.0.1.5:/tmp/", "rsync -av app.tar.gz deploy@10.0.1.5:/tmp/"], ["Secure copy over SSH.", "scp app.tar.gz deploy@10.0.1.5:…"], "scp uses your SSH access. rsync is better for big or repeated copies because it resumes and skips unchanged files."),
  c(1, "linux", "ssh-key", "Log in to 10.0.1.5 as ec2-user using the key ~/.ssh/prod.pem.", "ssh -i ~/.ssh/prod.pem ec2-user@10.0.1.5", ["ssh ec2-user@10.0.1.5 -i ~/.ssh/prod.pem"], ["ssh has a flag for the identity file.", "ssh -i ~/.ssh/prod.pem …"], "-i picks the private key. If it is rejected, check the file is chmod 600."),
  c(1, "linux", "uptime", "Did this box just reboot? Check how long it has been up and its load.", "uptime", ["uptime -p", "w"], ["One word.", "up…"], "uptime shows time since boot and the 1, 5 and 15-minute load averages."),
  c(1, "linux", "uname", "Which kernel version is this host running?", "uname -r", ["uname -a"], ["Print system information.", "uname -…"], "uname -r prints only the kernel release, which is what CVE notices ask about."),
  c(1, "linux", "os-release", "Is this Ubuntu, Amazon Linux or Debian, and which version?", "cat /etc/os-release", ["lsb_release -a", "hostnamectl"], ["Every modern distro has a file describing itself.", "cat /etc/os-…"], "/etc/os-release exists on every systemd-era distro, unlike lsb_release."),
  c(1, "linux", "last", "Security asks who logged in to this server recently. Show the login history.", "last", ["last -n 20", "last -20", "last -a"], ["One word, the opposite of first.", "l…"], "last reads /var/log/wtmp; lastb shows failed attempts."),
  c(1, "linux", "crontab-l", "Something runs every night at 2am. List the current user's cron jobs.", "crontab -l", ["crontab -l -u $USER"], ["The cron table, list mode.", "crontab -…"], "Also check /etc/cron.d and systemd timers (systemctl list-timers) for system-wide jobs."),
  c(1, "linux", "uniq-ips", "Which IPs hit the server most? Count the first column of access.log and sort by count.", "awk '{print $1}' access.log | sort | uniq -c | sort -rn", [/^(awk '\{ ?print \$1 ?\}'|cut -d ?' ' -f ?1) access\.log ?\| ?sort ?\| ?uniq -c ?\| ?sort -(rn|nr|n -r|r -n)( ?\| ?head( -n ?\d+| -\d+)?)?$/, /^cat access\.log ?\| ?(awk '\{ ?print \$1 ?\}'|cut -d ?' ' -f ?1) ?\| ?sort ?\| ?uniq -c ?\| ?sort -(rn|nr)( ?\| ?head( -n ?\d+| -\d+)?)?$/], ["Extract column 1, sort, count duplicates, sort by count.", "awk '{print $1}' access.log | sort | uniq -c | sort -…"], "uniq only collapses adjacent lines, which is why the first sort is needed. The classic pipeline for finding a noisy client."),
  c(1, "linux", "sed-i", "Change every 8080 to 9090 in app.conf, in place.", "sed -i 's/8080/9090/g' app.conf", ["sed -i 's/8080/9090/' app.conf", "sed -i.bak 's/8080/9090/g' app.conf", "sed -i -e 's/8080/9090/g' app.conf"], ["The stream editor, editing the file itself.", "sed -i 's/8080/9090/g' …"], "-i edits in place; -i.bak keeps a backup copy first."),
  c(1, "linux", "mkdir-p", "Create /opt/app/releases/2026-11-18, including any missing parent folders.", "mkdir -p /opt/app/releases/2026-11-18", [], ["mkdir has a parents flag.", "mkdir -p …"], "-p creates every missing parent and does not fail if the folder already exists."),
  c(1, "linux", "lsof-p", "Disk space did not come back after deleting a big log. Which files does process 4242 still hold open?", "lsof -p 4242", ["lsof -p4242"], ["List open files, for one PID.", "lsof -p …"], "A deleted file stays on disk while a process holds it open. lsof +L1 lists exactly those."),
  c(1, "linux", "watch-df", "Keep an eye on free disk space, refreshing every 2 seconds, while the cleanup runs.", "watch df -h", ["watch -n 2 df -h", "watch -n2 df -h", "watch -n 2 'df -h'"], ["A command that re-runs another command.", "watch … df -h"], "watch re-runs the command every 2 seconds by default and redraws the screen."),
  c(1, "linux", "printenv", "Why can the cron job not find terraform? Print the PATH it sees.", "echo $PATH", ["printenv PATH", "echo '$PATH'"], ["Print one environment variable.", "echo $…"], "cron runs with a minimal PATH, usually /usr/bin:/bin. Use full paths or set PATH at the top of the crontab."),
  c(1, "linux", "timedatectl", "TLS handshakes fail with 'certificate not yet valid'. Check whether the clock is synced.", "timedatectl", ["timedatectl status", "chronyc tracking", "date"], ["systemd has a tool for time and date settings.", "timedatectl"], "A drifting clock breaks TLS, Kerberos and AWS request signing. Look for 'System clock synchronized: yes'."),
  c(1, "linux", "ping", "Is 10.0.2.15 reachable at all? Send 4 pings.", "ping -c 4 10.0.2.15", ["ping -c4 10.0.2.15", "ping 10.0.2.15 -c 4"], ["ping, with a count so it stops.", "ping -c 4 …"], "-c stops after N packets. No reply does not always mean down: many security groups block ICMP."),
];

const ECR = "123456789012.dkr.ecr.me-central-1.amazonaws.com";

const L2: Cmd[] = [
  c(2, "aws", "s3-cp", "Upload last night's dump backup.sql.gz to s3://pay-backups/db/.", "aws s3 cp backup.sql.gz s3://pay-backups/db/", ["aws s3 cp backup.sql.gz s3://pay-backups/db/backup.sql.gz", "aws s3 cp ./backup.sql.gz s3://pay-backups/db/"], ["High-level s3 commands work like cp.", "aws s3 cp backup.sql.gz s3://…"], "aws s3 cp handles multipart uploads automatically for large files."),
  c(2, "aws", "s3-sync", "Publish the static site in ./build to s3://acme-site, removing files that no longer exist.", "aws s3 sync ./build s3://acme-site --delete", ["aws s3 sync build s3://acme-site --delete", "aws s3 sync ./build s3://acme-site/ --delete", "aws s3 sync --delete ./build s3://acme-site"], ["sync only uploads what changed. One flag also removes extras.", "aws s3 sync ./build s3://acme-site --…"], "sync compares sizes and timestamps; --delete removes objects that are gone locally.", { near: [[/^aws s3 sync \.?\/?build s3:\/\/acme-site\/?$/, "Close, but old files stay in the bucket. Add the flag that deletes them."]] }),
  c(2, "aws", "s3-rm", "Delete the old artefact s3://tmp-builds/app-1.2.0.zip.", "aws s3 rm s3://tmp-builds/app-1.2.0.zip", [], ["Like rm, but for S3.", "aws s3 rm s3://…"], "Add --recursive to delete a whole prefix. With versioning on, this only adds a delete marker."),
  c(2, "aws", "s3-mb", "Create a new bucket called acme-tf-state.", "aws s3 mb s3://acme-tf-state", ["aws s3 mb s3://acme-tf-state --region me-central-1", "aws s3api create-bucket --bucket acme-tf-state"], ["mb = make bucket.", "aws s3 mb s3://…"], "Bucket names are global across all AWS accounts, so short names are usually taken."),
  c(2, "aws", "s3-size", "Finance asks how big the logs bucket is. Show total objects and size, human readable.", "aws s3 ls s3://acme-logs --recursive --summarize --human-readable", [/^aws s3 ls s3:\/\/acme-logs\/? (--recursive|--summarize|--human-readable)( (--recursive|--summarize|--human-readable)){2}$/], ["ls, recursively, with a summary at the end.", "aws s3 ls s3://acme-logs --recursive --summarize --…"], "For very large buckets, the CloudWatch BucketSizeBytes metric or S3 Storage Lens is faster."),
  c(2, "aws", "s3-presign", "Send a partner a download link for s3://reports/q3.pdf that expires in one hour.", "aws s3 presign s3://reports/q3.pdf --expires-in 3600", ["aws s3 presign s3://reports/q3.pdf --expires-in=3600"], ["S3 can sign a temporary URL.", "aws s3 presign s3://reports/q3.pdf --expires-in …"], "A presigned URL works without AWS credentials until it expires, so keep the expiry short."),
  c(2, "aws", "ec2-describe", "List the EC2 instances in this region.", "aws ec2 describe-instances", ["aws ec2 describe-instances --output table"], ["EC2 'describe' calls list things.", "aws ec2 describe-…"], "Add --query and --output table to make it readable."),
  c(2, "aws", "ec2-running", "Only list the instances that are running.", "aws ec2 describe-instances --filters Name=instance-state-name,Values=running", [/^aws ec2 describe-instances --filters '?Name=instance-state-name,Values=running'?( --output \w+)?$/], ["describe-instances accepts filters by name.", "aws ec2 describe-instances --filters Name=instance-state-name,Values=…"], "Filters run server-side, so less data comes back than piping the full output through jq."),
  c(2, "aws", "ec2-stop", "Stop the forgotten test box i-0abc123def.", "aws ec2 stop-instances --instance-ids i-0abc123def", [], ["The plural verb, with the instance ID.", "aws ec2 stop-instances --instance-ids …"], "Stopped instances still pay for their EBS volumes. Terminate when you are sure."),
  c(2, "aws", "ec2-start", "Start i-0abc123def again for the demo.", "aws ec2 start-instances --instance-ids i-0abc123def", [], ["Opposite of stop.", "aws ec2 start-instances --instance-ids …"], "Without an Elastic IP the public IP changes on every start."),
  c(2, "aws", "ec2-sg", "What does security group sg-0db123 allow in?", "aws ec2 describe-security-groups --group-ids sg-0db123", [], ["describe the security group by ID.", "aws ec2 describe-security-groups --group-ids …"], "Check IpPermissions for 0.0.0.0/0 entries; those are the ones auditors flag."),
  c(2, "aws", "ebs-snapshot", "Before the OS upgrade, snapshot volume vol-0abc123.", "aws ec2 create-snapshot --volume-id vol-0abc123", [/^aws ec2 create-snapshot --volume-id vol-0abc123 --description '[^']*'$/, /^aws ec2 create-snapshot --description '[^']*' --volume-id vol-0abc123$/], ["EBS snapshots are an EC2 call.", "aws ec2 create-snapshot --volume-id …"], "Snapshots are incremental and crash-consistent; stop writes first for databases."),
  c(2, "aws", "ssm-session", "Get a shell on i-0abc123def without opening port 22.", "aws ssm start-session --target i-0abc123def", [], ["Systems Manager has interactive sessions.", "aws ssm start-session --target …"], "Session Manager needs no inbound port or SSH key and every session can be logged to S3 or CloudWatch."),
  c(2, "aws", "ssm-param", "Read the decrypted value of the SecureString parameter /prod/api/db_password.", "aws ssm get-parameter --name /prod/api/db_password --with-decryption", ["aws ssm get-parameter --with-decryption --name /prod/api/db_password", /^aws ssm get-parameter --name \/prod\/api\/db_password --with-decryption --query '?Parameter\.Value'? --output text$/], ["get-parameter, and a flag to decrypt.", "aws ssm get-parameter --name /prod/api/db_password --with-…"], "Without --with-decryption you get the encrypted blob, not the password.", { near: [[/^aws ssm get-parameter --name \/prod\/api\/db_password$/, "That returns the encrypted value. Ask SSM to decrypt it."]] }),
  c(2, "aws", "secret-get", "Fetch the secret prod/payments/db from Secrets Manager.", "aws secretsmanager get-secret-value --secret-id prod/payments/db", [/^aws secretsmanager get-secret-value --secret-id prod\/payments\/db( --query '?SecretString'? --output text)?$/], ["get-secret-value by secret ID.", "aws secretsmanager get-secret-value --secret-id …"], "Add --query SecretString --output text to get just the JSON payload."),
  c(2, "aws", "secret-list", "Which secrets exist in this account?", "aws secretsmanager list-secrets", [], ["list-…", "aws secretsmanager list-…"], "Lists names and metadata only, never the values."),
  c(2, "aws", "iam-attached", "What managed policies are attached to the role ci-deployer?", "aws iam list-attached-role-policies --role-name ci-deployer", [], ["List attached role policies.", "aws iam list-attached-role-policies --role-name …"], "Do not forget inline policies: aws iam list-role-policies shows those."),
  c(2, "aws", "iam-users", "Audit: list all IAM users in the account.", "aws iam list-users", [], ["IAM list call.", "aws iam list-…"], "In a mature setup this list is nearly empty: people come in through SSO roles."),
  c(2, "aws", "eks-kubeconfig", "You need kubectl access to the EKS cluster called prod.", "aws eks update-kubeconfig --name prod", [/^aws eks update-kubeconfig --name prod --region [a-z0-9-]+$/, /^aws eks update-kubeconfig --region [a-z0-9-]+ --name prod$/], ["The aws CLI can write your kubeconfig.", "aws eks update-kubeconfig --name …"], "It adds a context that fetches short-lived tokens with your current AWS identity."),
  c(2, "aws", "eks-describe", "Which Kubernetes version is the EKS cluster prod running?", "aws eks describe-cluster --name prod", [/^aws eks describe-cluster --name prod --query '?cluster\.version'?( --output text)?$/], ["describe the cluster.", "aws eks describe-cluster --name …"], "Add --query cluster.version --output text for just the version."),
  c(2, "aws", "ecs-redeploy", "The ECS service api in cluster prod needs to pull the new :latest image. Redeploy it.", "aws ecs update-service --cluster prod --service api --force-new-deployment", [/^aws ecs update-service (--cluster prod --service api|--service api --cluster prod) --force-new-deployment$/], ["update-service has a flag to roll the tasks.", "aws ecs update-service --cluster prod --service api --force-…"], "It starts fresh tasks with the same task definition. Pinning image tags is still the better fix."),
  c(2, "aws", "ecs-list", "Which services run in the ECS cluster prod?", "aws ecs list-services --cluster prod", [], ["list-services, for one cluster.", "aws ecs list-services --cluster …"], "Returns ARNs; pipe them to describe-services for status and desired counts."),
  c(2, "aws", "logs-tail", "Follow the logs of the Lambda payments-webhook live.", "aws logs tail /aws/lambda/payments-webhook --follow", [/^aws logs tail \/aws\/lambda\/payments-webhook --follow( --since \w+)?$/, /^aws logs tail \/aws\/lambda\/payments-webhook --since \w+ --follow$/], ["CloudWatch Logs has a tail command.", "aws logs tail /aws/lambda/payments-webhook --…"], "Lambda log groups are always /aws/lambda/<function-name>."),
  c(2, "aws", "lambda-list", "Which Lambda functions exist in this region?", "aws lambda list-functions", [], ["list-…", "aws lambda list-…"], "Add --query 'Functions[].FunctionName' for just the names."),
  c(2, "aws", "rds-describe", "Is the orders database Multi-AZ? Describe the RDS instances.", "aws rds describe-db-instances", ["aws rds describe-db-instances --db-instance-identifier orders-prod"], ["RDS describe call for instances.", "aws rds describe-db-…"], "Look for MultiAZ, StorageEncrypted and BackupRetentionPeriod in the output."),
  c(2, "aws", "rds-snapshot", "Before the schema migration, snapshot orders-prod as orders-pre-migration.", "aws rds create-db-snapshot --db-instance-identifier orders-prod --db-snapshot-identifier orders-pre-migration", ["aws rds create-db-snapshot --db-snapshot-identifier orders-pre-migration --db-instance-identifier orders-prod"], ["create-db-snapshot needs the instance and a name.", "aws rds create-db-snapshot --db-instance-identifier orders-prod --db-snapshot-identifier …"], "Manual snapshots are kept until you delete them, unlike automated backups."),
  c(2, "aws", "cf-invalidate", "You deployed a new site but CloudFront still serves the old one. Invalidate everything on distribution E1ABC2.", "aws cloudfront create-invalidation --distribution-id E1ABC2 --paths '/*'", ["aws cloudfront create-invalidation --distribution-id E1ABC2 --paths /*", "aws cloudfront create-invalidation --paths '/*' --distribution-id E1ABC2"], ["create-invalidation with a path pattern.", "aws cloudfront create-invalidation --distribution-id E1ABC2 --paths …"], "Quote /* so the shell does not expand it. Better long-term: hashed asset names and a short TTL on index.html."),
  c(2, "aws", "route53-zones", "Which hosted zones does this account manage?", "aws route53 list-hosted-zones", [], ["Route 53 list call.", "aws route53 list-…"], "Private zones show up here too; check Config.PrivateZone."),
  c(2, "aws", "sso-login", "Your session expired: 'Token has expired and refresh failed'. Log in again for the prod profile.", "aws sso login --profile prod", [], ["IAM Identity Center login.", "aws sso login --profile …"], "SSO gives short-lived credentials, which is exactly why you have to log in again."),
  c(2, "aws", "aws-profile", "For this shell session, make every aws command use the staging profile.", "export AWS_PROFILE=staging", [], ["An environment variable the CLI reads.", "export AWS_PROFILE=…"], "AWS_PROFILE also works for Terraform, SDKs and most tools built on the AWS SDK."),
  c(2, "aws", "aws-region", "Which default region is this CLI configured for?", "aws configure get region", ["echo $AWS_REGION", "echo $AWS_DEFAULT_REGION"], ["configure can read a setting back.", "aws configure get …"], "AWS_REGION or AWS_DEFAULT_REGION in the environment overrides the config file."),
  c(2, "aws", "cloudtrail-sg", "Someone opened port 22 to the world. Find who called AuthorizeSecurityGroupIngress.", "aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=AuthorizeSecurityGroupIngress", [/^aws cloudtrail lookup-events --lookup-attributes '?AttributeKey=EventName,AttributeValue=AuthorizeSecurityGroupIngress'?( --max-results \d+)?$/], ["CloudTrail can look up events by name.", "aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=…"], "lookup-events covers the last 90 days of management events; the event shows the user, IP and time."),
  c(2, "aws", "guardduty", "Is GuardDuty enabled in this region? List its detectors.", "aws guardduty list-detectors", [], ["GuardDuty list call.", "aws guardduty list-…"], "An empty list means GuardDuty is off in this region. It is per-region."),
  c(2, "aws", "acm-list", "Which TLS certificates does ACM manage here?", "aws acm list-certificates", [], ["Certificate Manager list call.", "aws acm list-…"], "CloudFront certificates must live in us-east-1, so check that region too."),
  c(2, "linux", "egress-ip", "A partner allow-lists your IP. Which public IP does this server's traffic leave from?", "curl https://checkip.amazonaws.com", ["curl checkip.amazonaws.com", "curl -s https://checkip.amazonaws.com", "curl ifconfig.me", "curl -s ifconfig.me", "curl https://ifconfig.me", "curl -s https://api.ipify.org", "curl https://api.ipify.org"], ["Ask a service on the internet what it sees.", "curl https://checkip.…"], "Behind a NAT Gateway this is the NAT's Elastic IP, not the instance's private address."),
  c(2, "linux", "base64-d", "A teammate pasted 'cGF5MTBfdWF0' from a Secret. Decode it.", "echo 'cGF5MTBfdWF0' | base64 -d", ["echo cGF5MTBfdWF0 | base64 -d", "echo 'cGF5MTBfdWF0' | base64 --decode", "echo -n 'cGF5MTBfdWF0' | base64 -d", "base64 -d <<< 'cGF5MTBfdWF0'"], ["base64 has a decode flag.", "echo '…' | base64 -…"], "base64 is encoding, not encryption. Anyone with the string has the secret."),
  c(2, "linux", "dig-txt", "Check that the SPF TXT record for example.com is published.", "dig +short txt example.com", ["dig txt example.com", "dig example.com txt", "dig TXT example.com", "dig +short TXT example.com", "nslookup -type=txt example.com"], ["dig can ask for a record type.", "dig … txt example.com"], "DNS changes can take up to the old record's TTL to show everywhere."),
  c(2, "linux", "imds-token", "On an EC2 box with IMDSv2 enforced, get a metadata session token.", "curl -X PUT http://169.254.169.254/latest/api/token -H 'X-aws-ec2-metadata-token-ttl-seconds: 21600'", [/^curl -s?X ?PUT '?http:\/\/169\.254\.169\.254\/latest\/api\/token'? -H 'X-aws-ec2-metadata-token-ttl-seconds: ?\d+'$/, /^curl -s -X PUT '?http:\/\/169\.254\.169\.254\/latest\/api\/token'? -H 'X-aws-ec2-metadata-token-ttl-seconds: ?\d+'$/], ["IMDSv2 needs a PUT to get a token first.", "curl -X PUT http://169.254.169.254/latest/api/token -H 'X-aws-ec2-metadata-token-ttl-seconds: 21600'"], "IMDSv2 tokens block SSRF attacks that can only make GET requests."),
];

const L3: Cmd[] = [
  c(3, "terraform", "tf-init", "Fresh clone of the infra repo. Download providers and set up the backend.", "terraform init", [], ["The first command in any Terraform folder.", "terraform i…"], "init downloads providers and modules and connects to the remote state backend."),
  c(3, "terraform", "tf-init-upgrade", "You bumped the AWS provider constraint to ~> 6.0. Re-initialise so the newer version is installed.", "terraform init -upgrade", [], ["init has a flag to pick newer versions.", "terraform init -…"], "-upgrade ignores the lock file's pinned versions and updates .terraform.lock.hcl. Commit the new lock file."),
  c(3, "terraform", "tf-init-migrate", "You moved state from local to S3 in backend.tf. Initialise and copy the existing state across.", "terraform init -migrate-state", [], ["init can move state between backends.", "terraform init -migrate-…"], "-migrate-state copies state to the new backend. -reconfigure would start empty and forget what exists.", { near: [[/^terraform init -reconfigure$/, "That forgets the old state instead of moving it. You want to copy it across."]] }),
  c(3, "terraform", "tf-fmt", "CI fails on formatting. Format every .tf file in the repo, subfolders included.", "terraform fmt -recursive", ["terraform fmt -recursive ."], ["fmt, all the way down.", "terraform fmt -…"], "In CI use terraform fmt -check -recursive so it fails instead of rewriting files."),
  c(3, "terraform", "tf-fmt-check", "In the CI pipeline, fail the build if any file is not formatted, without changing files.", "terraform fmt -check -recursive", ["terraform fmt -recursive -check", "terraform fmt -check -recursive -diff", "terraform fmt -check -diff -recursive"], ["fmt has a check mode.", "terraform fmt -check …"], "-check exits non-zero when files need formatting; -diff shows what would change."),
  c(3, "terraform", "tf-validate", "Check the configuration for syntax and type errors without talking to AWS.", "terraform validate", [], ["One word.", "terraform v…"], "validate catches typos, wrong argument names and type mismatches in seconds."),
  c(3, "terraform", "tf-plan-out", "Create a plan and save it to tfplan so the apply runs exactly what was reviewed.", "terraform plan -out=tfplan", ["terraform plan -out tfplan"], ["plan can write its result to a file.", "terraform plan -out=…"], "Applying a saved plan guarantees nothing changed between review and apply."),
  c(3, "terraform", "tf-apply-plan", "The reviewed plan file is tfplan. Apply exactly that.", "terraform apply tfplan", [], ["apply accepts a plan file.", "terraform apply …"], "A saved plan applies without asking again and fails if the state changed since."),
  c(3, "terraform", "tf-auto-approve", "In the CI job, apply without the interactive yes prompt.", "terraform apply -auto-approve", ["terraform apply -auto-approve tfplan", "terraform apply -input=false -auto-approve"], ["There is a flag that answers yes for you.", "terraform apply -auto-…"], "Only after a reviewed plan. Better still: apply a saved plan file."),
  c(3, "terraform", "tf-target", "Plan only the change to aws_security_group.web, nothing else.", "terraform plan -target=aws_security_group.web", ["terraform plan -target aws_security_group.web"], ["plan can be limited to one address.", "terraform plan -target=…"], "-target is for emergencies; running it routinely leaves the rest of the state drifting."),
  c(3, "terraform", "tf-destroy-target", "Remove only the bastion host aws_instance.bastion.", "terraform destroy -target=aws_instance.bastion", ["terraform destroy -target aws_instance.bastion", "terraform apply -destroy -target=aws_instance.bastion"], ["destroy, limited to one address.", "terraform destroy -target=…"], "Also delete it from the code, or the next apply recreates it.", { near: [[/^terraform destroy$/, "That destroys everything in this state. Limit it to the bastion."]] }),
  c(3, "terraform", "tf-state-show", "Show every attribute Terraform knows about aws_db_instance.main.", "terraform state show aws_db_instance.main", [], ["state has a show sub-command.", "terraform state show …"], "Handy to copy real values (like the endpoint) without opening the console."),
  c(3, "terraform", "tf-state-mv", "You renamed aws_s3_bucket.logs to aws_s3_bucket.audit_logs in code. Tell the state, so it does not destroy and recreate.", "terraform state mv aws_s3_bucket.logs aws_s3_bucket.audit_logs", [], ["state mv: old address, new address.", "terraform state mv aws_s3_bucket.logs …"], "On Terraform 1.1+ a moved {} block in code does the same and is reviewable."),
  c(3, "terraform", "tf-state-rm", "Stop managing aws_s3_bucket.legacy with Terraform, but do not delete the bucket.", "terraform state rm aws_s3_bucket.legacy", [], ["Remove it from state, not from AWS.", "terraform state rm …"], "state rm forgets the resource; the real bucket stays. A removed {} block does the same in newer versions.", { near: [[/^terraform destroy/, "That deletes the real bucket. You only want Terraform to forget it."]] }),
  c(3, "terraform", "tf-import", "The bucket acme-assets-prod was created by hand. Bring it under aws_s3_bucket.assets.", "terraform import aws_s3_bucket.assets acme-assets-prod", [], ["import: address, then the real ID.", "terraform import aws_s3_bucket.assets …"], "Write the resource block first. On 1.5+ an import {} block lets you plan the import."),
  c(3, "terraform", "tf-replace", "aws_instance.web is unhealthy. Force Terraform to recreate it on the next apply.", "terraform apply -replace=aws_instance.web", ["terraform apply -replace aws_instance.web", "terraform plan -replace=aws_instance.web"], ["apply has a replace flag.", "terraform apply -replace=…"], "-replace is the modern taint: it shows up in the plan so it can be reviewed.", { near: [[/^terraform taint/, "taint still works but is deprecated. There is an apply flag for this."]] }),
  c(3, "terraform", "tf-unlock", "Plan fails with 'Error acquiring the state lock'. The crashed run's lock ID is 6d2f1c9a. Release it.", "terraform force-unlock 6d2f1c9a", ["terraform force-unlock -force 6d2f1c9a"], ["There is a force sub-command for locks.", "terraform force-unlock …"], "Make sure nobody else is really running an apply first, or you corrupt state.", { context: ["Error: Error acquiring the state lock", "Lock Info:", "  ID:        6d2f1c9a", "  Who:       runner@ci-42"] }),
  c(3, "terraform", "tf-ws-select", "Switch to the staging workspace.", "terraform workspace select staging", [], ["workspace sub-command.", "terraform workspace select …"], "Check terraform workspace show before every apply: the wrong workspace is a classic outage."),
  c(3, "terraform", "tf-ws-list", "Which workspaces exist in this backend?", "terraform workspace list", [], ["workspace, list.", "terraform workspace l…"], "The current one is marked with *."),
  c(3, "terraform", "tf-ws-new", "Create a new workspace called dev.", "terraform workspace new dev", [], ["workspace, new.", "terraform workspace new …"], "Workspaces share code but keep separate state."),
  c(3, "terraform", "tf-output", "Print the value of the output db_endpoint, without quotes, for a script.", "terraform output -raw db_endpoint", ["terraform output db_endpoint"], ["output, raw for scripts.", "terraform output -raw …"], "-raw prints the bare string, which is what shell scripts want."),
  c(3, "terraform", "tf-output-json", "Dump all outputs as JSON for the next pipeline step.", "terraform output -json", ["terraform output -json > outputs.json"], ["output has a JSON flag.", "terraform output -…"], "Sensitive outputs are included in -json, so do not print it in CI logs."),
  c(3, "terraform", "tf-show-plan", "Read what the saved plan tfplan will do.", "terraform show tfplan", [], ["show can read a plan file.", "terraform show …"], "terraform show -json tfplan gives machine-readable output for policy checks."),
  c(3, "terraform", "tf-show-json", "Feed the saved plan to a policy checker: convert tfplan to plan.json.", "terraform show -json tfplan > plan.json", [], ["show, JSON, redirected.", "terraform show -json tfplan > …"], "Checkov, OPA and Infracost can all read this file."),
  c(3, "terraform", "tf-refresh-only", "Someone changed things in the console. See the drift between AWS and state, without proposing changes to fix it.", "terraform plan -refresh-only", [], ["plan has a refresh-only mode.", "terraform plan -refresh-…"], "refresh-only shows what changed outside Terraform; apply -refresh-only accepts it into state."),
  c(3, "terraform", "tf-detailed-exit", "A nightly drift job must fail when there are changes. Plan with an exit code that says so.", "terraform plan -detailed-exitcode", ["terraform plan -detailed-exitcode -input=false", "terraform plan -input=false -detailed-exitcode"], ["plan can return a special exit code.", "terraform plan -detailed-…"], "Exit 0 means no changes, 1 an error, 2 that changes are pending."),
  c(3, "terraform", "tf-var", "Plan with the variable env set to prod from the command line.", "terraform plan -var='env=prod'", ["terraform plan -var env=prod", "terraform plan -var=env=prod"], ["The -var flag takes key=value.", "terraform plan -var='env=…'"], "For many values, use -var-file or TF_VAR_env in the environment."),
  c(3, "terraform", "tf-var-file", "Plan using the values in prod.tfvars.", "terraform plan -var-file=prod.tfvars", ["terraform plan -var-file prod.tfvars"], ["A flag that loads a tfvars file.", "terraform plan -var-file=…"], "*.auto.tfvars and terraform.tfvars load automatically; others need -var-file."),
  c(3, "terraform", "tf-log", "The AWS provider fails with a vague error. Turn on debug logs for the next command.", "export TF_LOG=DEBUG", [/^TF_LOG=(DEBUG|TRACE) terraform (plan|apply)$/, "export TF_LOG=TRACE"], ["Terraform reads an environment variable for log level.", "export TF_LOG=…"], "TF_LOG shows the raw AWS API calls. Unset it afterwards; it is very noisy."),
  c(3, "terraform", "tf-console", "Try out a cidrsubnet() expression against the real variables.", "terraform console", [], ["Terraform has an interactive REPL.", "terraform c…"], "console evaluates expressions with the current state and variables, so you can test before you commit."),
  c(3, "terraform", "tf-providers-lock", "Developers use Apple Silicon but CI runs linux_amd64. Lock provider hashes for both platforms.", "terraform providers lock -platform=linux_amd64 -platform=darwin_arm64", ["terraform providers lock -platform=darwin_arm64 -platform=linux_amd64"], ["providers lock, with one flag per platform.", "terraform providers lock -platform=linux_amd64 -platform=…"], "Without both hashes, init fails on whichever platform did not write the lock file."),
  c(3, "terraform", "tf-graph", "Draw the dependency graph as graph.svg.", "terraform graph | dot -Tsvg > graph.svg", ["terraform graph | dot -Tsvg -o graph.svg"], ["graph prints DOT; Graphviz renders it.", "terraform graph | dot -Tsvg > …"], "Useful to see why one change triggers a cascade of others."),
  c(3, "terraform", "tf-version", "Which Terraform and provider versions does this folder use?", "terraform version", ["terraform -version", "terraform -v", "terraform --version"], ["One word.", "terraform v…"], "Pin required_version so a teammate on a newer CLI does not upgrade the state format by accident."),
  c(3, "aws", "s3-versioning", "Turn on versioning for the state bucket acme-tf-state.", "aws s3api put-bucket-versioning --bucket acme-tf-state --versioning-configuration Status=Enabled", [/^aws s3api put-bucket-versioning --versioning-configuration Status=Enabled --bucket acme-tf-state$/], ["Low-level s3api call.", "aws s3api put-bucket-versioning --bucket acme-tf-state --versioning-configuration Status=…"], "Versioning lets you restore a state file that a bad apply or a bug overwrote."),
  c(3, "aws", "ddb-lock", "Check the DynamoDB table tf-locks used for state locking exists.", "aws dynamodb describe-table --table-name tf-locks", [], ["DynamoDB describe call.", "aws dynamodb describe-table --table-name …"], "The table needs a string partition key named LockID. Terraform 1.10+ can also lock with S3 itself."),
  c(3, "aws", "vpc-list", "Before writing the network module, list the existing VPCs.", "aws ec2 describe-vpcs", [], ["VPCs are an EC2 resource.", "aws ec2 describe-…"], "Check for CIDR overlaps with what you plan to create or peer with."),
  c(3, "aws", "subnets-vpc", "List the subnets in vpc-0abc123.", "aws ec2 describe-subnets --filters Name=vpc-id,Values=vpc-0abc123", [/^aws ec2 describe-subnets --filters '?Name=vpc-id,Values=vpc-0abc123'?$/], ["describe-subnets with a vpc-id filter.", "aws ec2 describe-subnets --filters Name=vpc-id,Values=…"], "Note the AZ and available IPs of each subnet; EKS pods use a lot of IPs."),
  c(3, "linux", "find-tf", "List every .tf file in this repo.", "find . -name '*.tf'", ["find . -type f -name '*.tf'", "find . -name *.tf"], ["find by name pattern.", "find . -name '*.…'"], "Add -not -path './.terraform/*' to skip downloaded modules."),
  c(3, "linux", "grep-akia", "Before pushing, check the repo for hardcoded AWS access keys.", "grep -rn AKIA .", ["grep -r AKIA .", "grep -rn 'AKIA' .", "grep -rnE 'AKIA[0-9A-Z]{16}' .", "grep -r 'AKIA' ."], ["AWS key IDs start with the same four letters.", "grep -rn AKIA …"], "Long-term AWS keys start with AKIA. Tools like gitleaks do this in CI properly."),
  c(3, "linux", "diff-tfvars", "Why does staging behave differently? Compare prod.tfvars and staging.tfvars.", "diff prod.tfvars staging.tfvars", ["diff -u prod.tfvars staging.tfvars", "diff staging.tfvars prod.tfvars"], ["Compare two files.", "diff …"], "diff -u gives the familiar +/- format."),
];

const L4: Cmd[] = [
  c(4, "docker", "docker-ps", "Which containers are running on this VM?", "docker ps", ["docker container ls"], ["Like ps, for containers.", "docker p…"], "docker ps shows running containers, their ports and how long they have been up."),
  c(4, "docker", "docker-ps-a", "The api container is not in docker ps. Show stopped containers too.", "docker ps -a", ["docker ps --all", "docker container ls -a"], ["ps has an all flag.", "docker ps -…"], "Exited containers keep their logs and exit code, so you can see why they died."),
  c(4, "docker", "docker-build", "Build the image in this folder and tag it api:1.4.2.", "docker build -t api:1.4.2 .", ["docker build . -t api:1.4.2", "docker buildx build -t api:1.4.2 ."], ["build with a tag, from the current directory.", "docker build -t api:1.4.2 …"], "Do not forget the trailing dot: it is the build context."),
  c(4, "docker", "docker-build-nocache", "The image still has the old package even after rebuilding. Build again, ignoring the cache.", "docker build --no-cache -t api:1.4.2 .", ["docker build -t api:1.4.2 --no-cache ."], ["build has a flag to skip the layer cache.", "docker build --no-… -t api:1.4.2 ."], "A cached RUN apt-get layer never re-runs unless something before it changed."),
  c(4, "docker", "docker-run-port", "Run nginx in the background and publish container port 80 on host port 8080.", "docker run -d -p 8080:80 nginx", ["docker run -p 8080:80 -d nginx", "docker run -d -p 8080:80 nginx:latest"], ["Detached, with a port mapping host:container.", "docker run -d -p 8080:80 …"], "-p is host:container. Getting it backwards is the most common mistake."),
  c(4, "docker", "docker-run-envfile", "Run api:1.4.2 with the variables from the .env file.", "docker run --env-file .env api:1.4.2", ["docker run -d --env-file .env api:1.4.2", "docker run --env-file=.env api:1.4.2"], ["run has a flag for an env file.", "docker run --env-file .env …"], "Keeps secrets out of your shell history, unlike -e PASSWORD=…"),
  c(4, "docker", "docker-run-mem", "Run api:1.4.2 detached but cap it at 512 MB of memory.", "docker run -d --memory 512m api:1.4.2", ["docker run -d -m 512m api:1.4.2", "docker run -d --memory=512m api:1.4.2", "docker run --memory 512m -d api:1.4.2", "docker run -m 512m -d api:1.4.2"], ["run has a memory flag.", "docker run -d --memory … api:1.4.2"], "Without a limit one leaking container can starve everything else on the host."),
  c(4, "docker", "docker-run-rm", "Start a throwaway Alpine shell that is deleted when you exit.", "docker run --rm -it alpine sh", ["docker run -it --rm alpine sh", "docker run --rm -it alpine", "docker run -it --rm alpine", "docker run --rm -ti alpine sh"], ["Interactive, and remove on exit.", "docker run --rm -it alpine …"], "--rm stops one-off debug containers from piling up."),
  c(4, "docker", "docker-exec", "Get a shell inside the running container api.", "docker exec -it api sh", ["docker exec -it api bash", "docker exec -ti api sh", "docker exec -it api /bin/sh", "docker exec -it api /bin/bash"], ["exec, interactive with a TTY.", "docker exec -it api …"], "Slim images often have no bash; sh is the safe choice."),
  c(4, "docker", "docker-logs-since", "Show only the api container's logs from the last 10 minutes.", "docker logs --since 10m api", ["docker logs api --since 10m", "docker logs --since=10m api"], ["logs can filter by time.", "docker logs --since … api"], "Combine with -f to follow from that point on."),
  c(4, "docker", "docker-inspect", "Which IP, mounts and env vars does container api have? Dump its full config.", "docker inspect api", ["docker container inspect api"], ["Low-level information about any object.", "docker inspect …"], "Add --format to pull out one field instead of the whole JSON."),
  c(4, "docker", "docker-health", "Print just the health status of container api.", "docker inspect --format '{{.State.Health.Status}}' api", ["docker inspect -f '{{.State.Health.Status}}' api", "docker inspect api --format '{{.State.Health.Status}}'"], ["inspect with a Go template.", "docker inspect --format '{{.State.Health.Status}}' …"], "Shows healthy, unhealthy or starting, if the image defines a HEALTHCHECK."),
  c(4, "docker", "docker-stats", "Which container is eating the CPU? Show live usage.", "docker stats", ["docker stats --no-stream", "docker container stats"], ["Live resource usage per container.", "docker st…"], "--no-stream prints one snapshot, useful in scripts."),
  c(4, "docker", "docker-df", "The disk is full of Docker data. How much do images, containers and volumes take?", "docker system df", ["docker system df -v"], ["system has a disk-usage view.", "docker system …"], "Shows how much is reclaimable before you prune anything."),
  c(4, "docker", "docker-prune", "Clean up stopped containers, unused networks, dangling images and build cache.", "docker system prune", ["docker system prune -f"], ["system has a cleanup command.", "docker system p…"], "Volumes are only removed with --volumes, so data survives by default.", { near: [[/^docker system prune -a/, "-a also removes every image not used right now, so the next deploy pulls everything again."]] }),
  c(4, "docker", "docker-history", "Why is api:1.4.2 1.2 GB? Show its layers and their sizes.", "docker history api:1.4.2", ["docker image history api:1.4.2"], ["Images keep a layer history.", "docker history …"], "Look for a big COPY . . or a cache folder left behind by apt or pip."),
  c(4, "docker", "docker-tag-ecr", `Tag api:1.4.2 for the ECR repository ${ECR}/api.`, `docker tag api:1.4.2 ${ECR}/api:1.4.2`, [`docker image tag api:1.4.2 ${ECR}/api:1.4.2`], ["tag: source, then target.", `docker tag api:1.4.2 ${ECR}/api:…`], "The registry hostname is part of the tag; that is how docker knows where to push."),
  c(4, "docker", "docker-push-ecr", "Push the tagged image to ECR.", `docker push ${ECR}/api:1.4.2`, [`docker image push ${ECR}/api:1.4.2`], ["push the full tag.", `docker push ${ECR}/…`], "If this says 'no basic auth credentials', the ECR login expired (it lasts 12 hours)."),
  c(4, "aws", "ecr-login", "docker push says 'no basic auth credentials'. Log Docker in to ECR in me-central-1.", `aws ecr get-login-password --region me-central-1 | docker login --username AWS --password-stdin ${ECR}`, [/^aws ecr get-login-password( --region me-central-1)? ?\| ?docker login (--username|-u) AWS --password-stdin 123456789012\.dkr\.ecr\.me-central-1\.amazonaws\.com$/, /^aws ecr get-login-password( --region me-central-1)? ?\| ?docker login --password-stdin (--username|-u) AWS 123456789012\.dkr\.ecr\.me-central-1\.amazonaws\.com$/], ["Get a password from ECR and pipe it to docker login.", "aws ecr get-login-password --region me-central-1 | docker login --username AWS --password-stdin …"], "--password-stdin keeps the token out of your shell history and process list."),
  c(4, "aws", "ecr-images", "Which tags exist in the ECR repository payments/api?", "aws ecr describe-images --repository-name payments/api", ["aws ecr list-images --repository-name payments/api"], ["ECR describe call for images.", "aws ecr describe-images --repository-name …"], "describe-images also shows push dates and scan findings."),
  c(4, "aws", "ecs-taskdef", "Which image does the ECS task definition api use right now?", "aws ecs describe-task-definition --task-definition api", [], ["describe the task definition.", "aws ecs describe-task-definition --task-definition …"], "Without a revision number you get the latest active one."),
  c(4, "docker", "docker-pull", "Pre-pull postgres:16 on this host before the maintenance window.", "docker pull postgres:16", ["docker image pull postgres:16"], ["The opposite of push.", "docker pull …"], "Pin the major version so a pull never jumps you to a new Postgres."),
  c(4, "docker", "compose-up", "Start the stack from docker-compose.yml in the background.", "docker compose up -d", ["docker-compose up -d", "docker compose up --detach"], ["compose, up, detached.", "docker compose up -…"], "docker compose (with a space) is the v2 plugin; docker-compose is the old v1 binary."),
  c(4, "docker", "compose-build", "You changed the Dockerfile. Rebuild and restart the compose stack.", "docker compose up -d --build", ["docker-compose up -d --build", "docker compose up --build -d"], ["up has a build flag.", "docker compose up -d --…"], "Without --build compose reuses the old image and your change does not show up."),
  c(4, "docker", "compose-logs", "Follow the logs of only the api service in the compose stack.", "docker compose logs -f api", ["docker-compose logs -f api", "docker compose logs --follow api", "docker compose logs api -f"], ["compose logs, follow, one service.", "docker compose logs -f …"], "Leave the service name off to see every service interleaved."),
  c(4, "docker", "compose-down-v", "Tear down the local test stack and delete its volumes for a clean start.", "docker compose down -v", ["docker-compose down -v", "docker compose down --volumes"], ["down, plus volumes.", "docker compose down -…"], "-v deletes named volumes, so the test database starts empty. Never run it against data you need."),
  c(4, "docker", "docker-cp", "Copy /app/logs/error.log out of the container api to the current folder.", "docker cp api:/app/logs/error.log .", ["docker cp api:/app/logs/error.log ./", "docker container cp api:/app/logs/error.log ."], ["cp, container:path then destination.", "docker cp api:/app/logs/error.log …"], "Works on stopped containers too, which is handy after a crash."),
  c(4, "docker", "docker-restart", "Restart the container api.", "docker restart api", ["docker container restart api"], ["One verb.", "docker r… api"], "Set --restart unless-stopped so it comes back after reboots too."),
  c(4, "docker", "docker-rmi", "Remove the old image api:1.3.0 to free space.", "docker rmi api:1.3.0", ["docker image rm api:1.3.0"], ["rm for images.", "docker rmi …"], "It fails while a container (even a stopped one) still uses the image."),
  c(4, "docker", "docker-network-ls", "Containers cannot reach each other by name. List the Docker networks.", "docker network ls", ["docker network list"], ["network, list.", "docker network …"], "Name resolution only works on user-defined networks, not the default bridge."),
  c(4, "docker", "docker-volume-ls", "Where does the database container keep its data? List volumes.", "docker volume ls", ["docker volume list"], ["volume, list.", "docker volume …"], "Then docker volume inspect <name> shows the path on the host."),
  c(4, "docker", "buildx-multiarch", "Graviton nodes need ARM. Build api:1.4.2 for amd64 and arm64 and push it.", "docker buildx build --platform linux/amd64,linux/arm64 -t api:1.4.2 --push .", [/^docker buildx build (--platform linux\/(amd64,linux\/arm64|arm64,linux\/amd64) -t api:1\.4\.2 --push|-t api:1\.4\.2 --platform linux\/(amd64,linux\/arm64|arm64,linux\/amd64) --push|--platform linux\/(amd64,linux\/arm64|arm64,linux\/amd64) --push -t api:1\.4\.2) \.$/], ["buildx can target several platforms at once.", "docker buildx build --platform linux/amd64,linux/arm64 -t api:1.4.2 --push ."], "Multi-arch images must be pushed; the local image store cannot hold them."),
  c(4, "docker", "docker-save", "The server has no registry access. Save api:1.4.2 to api.tar to copy it over.", "docker save -o api.tar api:1.4.2", ["docker save api:1.4.2 -o api.tar", "docker save api:1.4.2 > api.tar", "docker image save -o api.tar api:1.4.2"], ["save writes an image to a tar file.", "docker save -o api.tar …"], "On the other side: docker load -i api.tar."),
  c(4, "docker", "docker-login", "Log in to Docker Hub to avoid the anonymous pull rate limit.", "docker login", ["docker login docker.io"], ["One word after docker.", "docker l…"], "Anonymous pulls are rate-limited per IP; CI behind one NAT hits it fast."),
  c(4, "linux", "trivy-image", "Scan api:1.4.2 for known vulnerabilities before shipping.", "trivy image api:1.4.2", ["trivy image --severity HIGH,CRITICAL api:1.4.2", "trivy image --severity CRITICAL,HIGH api:1.4.2"], ["Trivy scans images.", "trivy image …"], "In CI add --exit-code 1 --severity HIGH,CRITICAL to fail the build."),
  c(4, "linux", "usermod-docker", "User deploy gets 'permission denied' on the Docker socket. Add them to the docker group.", "usermod -aG docker deploy", ["usermod -a -G docker deploy", "gpasswd -a deploy docker"], ["usermod, append to a group.", "usermod -aG docker …"], "Without -a the user is removed from every other group. They must log in again to pick it up.", { near: [[/^usermod -G docker deploy$/, "Without -a this replaces all of deploy's groups. Append instead."]] }),
  c(4, "linux", "systemctl-docker", "No container starts after the reboot. Is the Docker daemon itself running?", "systemctl status docker", ["systemctl status docker.service", "service docker status"], ["It is a systemd service.", "systemctl status …"], "If it failed, journalctl -u docker shows why."),
  c(4, "terraform", "tf-ecr-output", "Your pipeline needs the ECR repository URL that Terraform created. Print the output ecr_repo_url, bare.", "terraform output -raw ecr_repo_url", ["terraform output ecr_repo_url"], ["output, raw for scripts.", "terraform output -raw …"], "Pass outputs between pipeline steps instead of hardcoding account IDs."),
  c(4, "terraform", "tf-target-ecr", "Create only the new ECR repository aws_ecr_repository.api first, so CI can push to it.", "terraform apply -target=aws_ecr_repository.api", ["terraform apply -target aws_ecr_repository.api"], ["apply, limited to one address.", "terraform apply -target=…"], "A rare valid use of -target: bootstrapping something the rest depends on."),
  c(4, "docker", "docker-top", "Which processes are running inside the container api?", "docker top api", ["docker container top api"], ["Like top, for one container.", "docker top …"], "Works even when the image has no ps binary."),
  c(4, "docker", "docker-port", "Which host port is container api published on?", "docker port api", ["docker container port api"], ["port mappings for a container.", "docker port …"], "Handy when you used -P and Docker picked random ports."),
  c(4, "docker", "docker-events", "Containers keep restarting. Watch Docker's event stream live.", "docker events", ["docker system events"], ["The daemon has an event stream.", "docker ev…"], "Shows die, oom and restart events with timestamps."),
];

const L5: Cmd[] = [
  c(5, "kubectl", "k-events", "Something is wrong in namespace prod. Show its events, newest last.", "kubectl get events -n prod --sort-by=.metadata.creationTimestamp", [/^kubectl get events (-n|--namespace)[ =]prod --sort-by[ =]'?\.(metadata\.creationTimestamp|lastTimestamp)'?$/, /^kubectl (-n|--namespace)[ =]prod get events --sort-by[ =]'?\.(metadata\.creationTimestamp|lastTimestamp)'?$/, /^kubectl events (-n|--namespace)[ =]prod$/], ["get events, sorted by creation time.", "kubectl get events -n prod --sort-by=.metadata.…"], "Events are unsorted by default, which hides the latest failure in the middle."),
  c(5, "kubectl", "k-context", "You are about to apply to prod. Which cluster is kubectl pointing at?", "kubectl config current-context", ["kubectl config get-contexts"], ["config sub-command for the current context.", "kubectl config current-…"], "Put the context in your shell prompt; applying to the wrong cluster is a classic outage."),
  c(5, "kubectl", "k-use-context", "Switch kubectl to the context staging.", "kubectl config use-context staging", [], ["config, use-context.", "kubectl config use-context …"], "Tools like kubectx do the same with less typing."),
  c(5, "kubectl", "k-nodes-wide", "Which nodes are there, with their IPs and OS images?", "kubectl get nodes -o wide", ["kubectl get no -o wide", "kubectl get node -o wide"], ["get nodes, wide output.", "kubectl get nodes -o …"], "-o wide adds internal IP, OS image, kernel and container runtime."),
  c(5, "kubectl", "k-cordon", "node-3 has a failing disk. Stop new pods landing on it.", "kubectl cordon node-3", [], ["Mark it unschedulable.", "kubectl c… node-3"], "cordon leaves running pods alone; drain moves them off."),
  c(5, "kubectl", "k-drain", "Move every pod off node-3 for maintenance, ignoring DaemonSets.", "kubectl drain node-3 --ignore-daemonsets --delete-emptydir-data", [/^kubectl drain node-3 (--ignore-daemonsets( --delete-emptydir-data)?|--delete-emptydir-data --ignore-daemonsets)( --force)?$/], ["drain, plus the DaemonSet flag.", "kubectl drain node-3 --ignore-daemonsets …"], "drain respects PodDisruptionBudgets, so a PDB with minAvailable equal to replicas blocks it."),
  c(5, "kubectl", "k-portforward", "Open Grafana from namespace monitoring on localhost:3000. The service is grafana on port 80.", "kubectl port-forward svc/grafana 3000:80 -n monitoring", [/^kubectl (-n|--namespace)[ =]monitoring port-forward (svc|service)\/grafana 3000:80$/, /^kubectl port-forward (-n|--namespace)[ =]monitoring (svc|service)\/grafana 3000:80$/, /^kubectl port-forward (svc|service)\/grafana 3000:80 (-n|--namespace)[ =]monitoring$/], ["Forward a local port to a service.", "kubectl port-forward svc/grafana 3000:80 -n …"], "No ingress or LoadBalancer needed, and it is gone when you press Ctrl+C."),
  c(5, "kubectl", "k-diff", "Before applying deploy.yaml to prod, see exactly what would change.", "kubectl diff -f deploy.yaml", [], ["kubectl has a diff command.", "kubectl diff -f …"], "diff runs a server-side dry run, so it includes defaults and admission changes."),
  c(5, "kubectl", "k-apply", "Apply the manifests in deploy.yaml.", "kubectl apply -f deploy.yaml", [], ["Declarative create-or-update.", "kubectl apply -f …"], "In a GitOps setup, push to Git instead and let Argo CD apply it."),
  c(5, "kubectl", "k-can-i", "Can the CI service account ci in namespace build create deployments in prod? Check it.", "kubectl auth can-i create deployments --as=system:serviceaccount:build:ci -n prod", [/^kubectl auth can-i create (deployments|deployment|deploy)(\.apps)? --as[ =]system:serviceaccount:build:ci (-n|--namespace)[ =]prod$/, /^kubectl auth can-i create (deployments|deployment|deploy)(\.apps)? (-n|--namespace)[ =]prod --as[ =]system:serviceaccount:build:ci$/], ["auth can-i, impersonating the service account.", "kubectl auth can-i create deployments --as=system:serviceaccount:build:ci -n …"], "The fastest way to debug RBAC without deploying anything."),
  c(5, "kubectl", "k-get-yaml", "Show the full live spec of pod api-5f6d as YAML.", "kubectl get pod api-5f6d -o yaml", ["kubectl get po api-5f6d -o yaml", "kubectl get pods api-5f6d -o yaml", "kubectl get pod/api-5f6d -o yaml"], ["get, with YAML output.", "kubectl get pod api-5f6d -o …"], "The status section shows the last termination reason and exit code."),
  c(5, "kubectl", "k-set-image", "Hotfix: change the api container in deployment api to image api:1.4.3.", "kubectl set image deploy/api api=api:1.4.3", ["kubectl set image deployment/api api=api:1.4.3", "kubectl set image deployment api api=api:1.4.3"], ["set image: container=image.", "kubectl set image deploy/api api=…"], "This triggers a rolling update. Update Git too, or GitOps reverts it."),
  c(5, "kubectl", "k-rollout-status", "Wait until the rollout of deployment api has finished.", "kubectl rollout status deploy/api", ["kubectl rollout status deployment/api", "kubectl rollout status deployment api"], ["rollout has a status sub-command.", "kubectl rollout status …"], "It exits non-zero if the rollout fails its progress deadline, so CI can stop."),
  c(5, "kubectl", "k-debug", "The distroless pod api-5f6d has no shell. Attach a busybox debug container to it.", "kubectl debug -it api-5f6d --image=busybox", [/^kubectl debug (-it|-ti) api-5f6d --image[ =]busybox(:\S+)?( --target[ =]\S+)?$/, /^kubectl debug api-5f6d (-it|-ti) --image[ =]busybox(:\S+)?( --target[ =]\S+)?$/], ["kubectl debug adds an ephemeral container.", "kubectl debug -it api-5f6d --image=…"], "Add --target=<container> to share its process namespace and see its processes."),
  c(5, "kubectl", "k-pv", "A StatefulSet pod is Pending on its volume. List the PersistentVolumeClaims in prod.", "kubectl get pvc -n prod", ["kubectl get persistentvolumeclaims -n prod", "kubectl -n prod get pvc"], ["get the claims.", "kubectl get pvc -n …"], "A Pending PVC usually means a missing StorageClass or a zone mismatch."),
  c(5, "helm", "helm-list", "Which Helm releases are installed across all namespaces?", "helm list -A", ["helm ls -A", "helm list --all-namespaces", "helm ls --all-namespaces"], ["list, all namespaces.", "helm list -…"], "Releases in failed or pending-upgrade state show up here too."),
  c(5, "helm", "helm-values", "Which values is the release shop actually running with?", "helm get values shop", ["helm get values shop -a", "helm get values shop --all"], ["get the values of a release.", "helm get values …"], "-a includes the chart defaults, not only what was overridden."),
  c(5, "helm", "helm-template", "Render the chart in ./chart with values-prod.yaml locally, without installing.", "helm template shop ./chart -f values-prod.yaml", ["helm template shop ./chart --values values-prod.yaml", "helm template ./chart -f values-prod.yaml"], ["template renders without a cluster.", "helm template shop ./chart -f …"], "Pipe it into kubectl diff -f - or a policy checker before you ship."),
  c(5, "git", "git-stash", "Urgent hotfix, but you have uncommitted work. Shelve it for now.", "git stash", ["git stash push", "git stash -u", "git stash push -u"], ["git can put changes aside.", "git st…"], "-u also stashes untracked files. git stash pop brings it back."),
  c(5, "git", "git-cherry-pick", "Apply only commit 4e1f9ab from main onto this release branch.", "git cherry-pick 4e1f9ab", ["git cherry-pick -x 4e1f9ab"], ["Pick one commit.", "git cherry-pick …"], "-x adds 'cherry picked from' to the message, which helps later."),
  c(5, "git", "git-switch-c", "Start a new branch fix/probe-port from here.", "git switch -c fix/probe-port", ["git checkout -b fix/probe-port"], ["Create and switch in one go.", "git switch -c …"], "switch is the newer, clearer command; checkout -b still works."),
  c(5, "git", "git-diff-staged", "Before committing, review exactly what is staged.", "git diff --staged", ["git diff --cached"], ["diff of the index.", "git diff --…"], "Plain git diff only shows unstaged changes."),
  c(5, "ansible", "ansible-ping", "Can Ansible reach every host in inventory/prod?", "ansible all -i inventory/prod -m ping", ["ansible -i inventory/prod all -m ping", "ansible all -m ping -i inventory/prod"], ["An ad-hoc command with the ping module.", "ansible all -i inventory/prod -m …"], "The ping module checks SSH and Python on the host, not ICMP."),
  c(5, "ansible", "ansible-check", "Dry-run site.yml against inventory/prod and show what would change.", "ansible-playbook -i inventory/prod site.yml --check --diff", [/^ansible-playbook (-i inventory\/prod site\.yml|site\.yml -i inventory\/prod) (--check --diff|--diff --check|-C -D|-D -C|--check -D|-C --diff)$/], ["Check mode plus diff.", "ansible-playbook -i inventory/prod site.yml --check --…"], "Modules that do not support check mode are skipped, so it is a good guide, not a guarantee."),
  c(5, "ansible", "ansible-limit", "Run site.yml only on the host web01.", "ansible-playbook -i inventory/prod site.yml --limit web01", [/^ansible-playbook (-i inventory\/prod site\.yml|site\.yml -i inventory\/prod) (--limit|-l)[ =]web01$/], ["playbook runs can be limited.", "ansible-playbook -i inventory/prod site.yml --limit …"], "Test a change on one host before rolling it to the fleet."),
  c(5, "ansible", "ansible-syntax", "Check site.yml for syntax errors before the pipeline runs it.", "ansible-playbook site.yml --syntax-check", ["ansible-playbook --syntax-check site.yml", "ansible-playbook -i inventory/prod site.yml --syntax-check"], ["playbook has a syntax check flag.", "ansible-playbook site.yml --syntax-…"], "Pair it with ansible-lint in CI."),
  c(5, "ansible", "ansible-vault-encrypt", "group_vars/prod/vault.yml holds passwords in plain text. Encrypt it.", "ansible-vault encrypt group_vars/prod/vault.yml", [], ["ansible-vault, encrypt.", "ansible-vault encrypt …"], "Run playbooks with --ask-vault-pass or a vault password file from your secret store."),
  c(5, "ansible", "ansible-vault-edit", "Change a password inside the encrypted file group_vars/prod/vault.yml.", "ansible-vault edit group_vars/prod/vault.yml", [], ["Edit without decrypting to disk.", "ansible-vault edit …"], "edit decrypts to a temp file and re-encrypts on save, so plain text never lands in the repo."),
  c(5, "ansible", "ansible-galaxy", "Install the roles and collections listed in requirements.yml.", "ansible-galaxy install -r requirements.yml", ["ansible-galaxy collection install -r requirements.yml", "ansible-galaxy role install -r requirements.yml"], ["Galaxy installs dependencies.", "ansible-galaxy install -r …"], "Pin versions in requirements.yml so CI gets the same roles you tested."),
  c(5, "ansible", "ansible-adhoc", "Check uptime on every host in the web group, without writing a playbook.", "ansible web -i inventory/prod -m shell -a 'uptime'", [/^ansible web (-i inventory\/prod )?-m (shell|command|ansible\.builtin\.(shell|command)) -a '?uptime'?( -i inventory\/prod)?$/, /^ansible web -a '?uptime'?( -i inventory\/prod)?$/, /^ansible -i inventory\/prod web (-m (shell|command) )?-a '?uptime'?$/], ["An ad-hoc command with an argument.", "ansible web -i inventory/prod -m shell -a '…'"], "The command module is the default and safer; shell is only needed for pipes and redirects."),
  c(5, "python", "py-venv", "Set up an isolated Python environment in .venv for the ops scripts.", "python3 -m venv .venv", ["python -m venv .venv"], ["Python ships a venv module.", "python3 -m venv …"], "Keeps script dependencies away from the system Python that the OS relies on."),
  c(5, "python", "py-activate", "Activate the .venv you just created.", "source .venv/bin/activate", [". .venv/bin/activate"], ["source the activate script.", "source .venv/bin/…"], "Your prompt changes to show (.venv). Run deactivate to leave it."),
  c(5, "python", "pip-req", "Install the script's dependencies from requirements.txt.", "pip install -r requirements.txt", ["pip3 install -r requirements.txt", "python -m pip install -r requirements.txt", "python3 -m pip install -r requirements.txt"], ["pip, from a requirements file.", "pip install -r …"], "Pin exact versions so the cron job does not break when a library releases."),
  c(5, "python", "pip-freeze", "Write the exact installed versions to requirements.txt.", "pip freeze > requirements.txt", ["pip3 freeze > requirements.txt", "python -m pip freeze > requirements.txt", "python3 -m pip freeze > requirements.txt"], ["pip can list installed versions.", "pip freeze > …"], "Run it inside the venv, or you capture every system package too."),
  c(5, "python", "py-json", "The webhook payload in event.json is one long line. Pretty-print it.", "python3 -m json.tool event.json", ["python -m json.tool event.json", "jq . event.json"], ["Python has a JSON module you can run.", "python3 -m json.tool …"], "Available on every box with Python, even when jq is not installed."),
  c(5, "python", "py-http", "Share the generated report folder on port 8000 for a quick look.", "python3 -m http.server 8000", ["python -m http.server 8000", "python3 -m http.server 8000 --bind 127.0.0.1"], ["Python has a built-in web server module.", "python3 -m http.server …"], "Fine for a minute on a private network; never as a real server."),
  c(5, "python", "py-version", "The script needs 3.10+. Which Python is on this box?", "python3 --version", ["python3 -V", "python --version", "python -V"], ["A version flag.", "python3 --…"], "On many distros python is missing or still Python 2; always call python3 in scripts."),
  c(5, "docker", "k-image-check", "Kubernetes says ImagePullBackOff for api:1.4.3. Check the tag really exists by pulling it.", "docker pull api:1.4.3", ["docker image pull api:1.4.3"], ["Try what the kubelet tried.", "docker pull …"], "If it pulls for you but not on the node, the problem is the node's registry credentials."),
  c(5, "aws", "k-irsa", "The pod's AWS calls fail. From inside it, which AWS identity is it using?", "aws sts get-caller-identity", [], ["Ask STS who you are.", "aws sts get-…"], "If you see the node role instead of the IRSA role, the service account annotation or trust policy is wrong."),
  c(5, "terraform", "k-tf-eks", "The EKS module change touches the node group. Plan just module.eks.", "terraform plan -target=module.eks", ["terraform plan -target module.eks"], ["plan, limited to a module.", "terraform plan -target=…"], "Review node group changes carefully: some force a replacement of every node."),
];

export const COMMANDS: Cmd[] = [...L1, ...L2, ...L3, ...L4, ...L5, ...ORIGINAL];
