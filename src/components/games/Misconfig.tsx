import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Spot the misconfig: a short config file, one line will hurt you in production.
 * Click it. Each round explains why, the way a code review comment would.
 */
interface Round {
  file: string;
  lines: string[];
  /** 0-based index of the bad line */
  bad: number;
  why: string;
}

const ROUNDS: Round[] = [
  {
    file: "deployment.yaml",
    lines: [
      "apiVersion: apps/v1",
      "kind: Deployment",
      "spec:",
      "  replicas: 3",
      "  template:",
      "    spec:",
      "      containers:",
      "        - name: api",
      "          image: registry.local/api:latest",
      "          resources:",
      "            requests: { cpu: 200m, memory: 256Mi }",
    ],
    bad: 8,
    why: "`:latest` is not a version. Two nodes can pull two different images, and a rollback rolls back to nothing. Pin a tag or a digest.",
  },
  {
    file: "bucket-policy.json",
    lines: [
      "{",
      '  "Version": "2012-10-17",',
      '  "Statement": [{',
      '    "Effect": "Allow",',
      '    "Principal": "*",',
      '    "Action": "s3:GetObject",',
      '    "Resource": "arn:aws:s3:::invoices-prod/*"',
      "  }]",
      "}",
    ],
    bad: 4,
    why: "`Principal: *` makes every invoice readable by anyone on the internet. Grant the role or CloudFront origin that needs it, not the world.",
  },
  {
    file: "Dockerfile",
    lines: [
      "FROM node:22-alpine",
      "WORKDIR /app",
      "COPY package*.json ./",
      "RUN npm ci --omit=dev",
      "COPY . .",
      "ENV DB_PASSWORD=Sup3rS3cret!",
      "USER node",
      'CMD ["node", "server.js"]',
    ],
    bad: 5,
    why: "Secrets in ENV are baked into every image layer and visible to anyone who can pull it (`docker history`). Inject them at runtime from a secret store.",
  },
  {
    file: "security-group.tf",
    lines: [
      'resource "aws_security_group_rule" "db" {',
      '  type              = "ingress"',
      "  from_port         = 5432",
      "  to_port           = 5432",
      '  protocol          = "tcp"',
      '  cidr_blocks       = ["0.0.0.0/0"]',
      "  security_group_id = aws_security_group.db.id",
      "}",
    ],
    bad: 5,
    why: "Postgres open to 0.0.0.0/0. Reference the application's security group (source_security_group_id) instead of a CIDR.",
  },
  {
    file: "probe.yaml",
    lines: [
      "containers:",
      "  - name: web",
      "    ports:",
      "      - containerPort: 8080",
      "    livenessProbe:",
      "      httpGet: { path: /healthz, port: 80 }",
      "      initialDelaySeconds: 10",
      "      periodSeconds: 10",
    ],
    bad: 5,
    why: "The app listens on 8080, the probe checks 80. Every probe fails and the kubelet restarts a perfectly healthy container forever.",
  },
  {
    file: ".github/workflows/deploy.yml",
    lines: [
      "on:",
      "  pull_request_target:",
      "jobs:",
      "  build:",
      "    runs-on: ubuntu-latest",
      "    steps:",
      "      - uses: actions/checkout@v4",
      "        with: { ref: ${{ github.event.pull_request.head.sha }} }",
      "      - run: npm ci && npm test",
    ],
    bad: 7,
    why: "pull_request_target runs with repository secrets. Checking out the PR's head and running its code hands those secrets to anyone who opens a PR.",
  },
  {
    file: "rbac.yaml",
    lines: [
      "kind: ClusterRoleBinding",
      "metadata:",
      "  name: ci-deployer",
      "roleRef:",
      "  kind: ClusterRole",
      "  name: cluster-admin",
      "subjects:",
      "  - kind: ServiceAccount",
      "    name: ci",
      "    namespace: build",
    ],
    bad: 5,
    why: "The CI account is cluster-admin everywhere. Bind a namespaced Role with only the verbs and resources it deploys.",
  },
  {
    file: "nginx.conf",
    lines: [
      "server {",
      "  listen 443 ssl;",
      "  server_name api.example.com;",
      "  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;",
      "  location / {",
      "    proxy_pass http://api:8080;",
      "  }",
      "}",
    ],
    bad: 3,
    why: "TLS 1.0 and 1.1 are deprecated and fail PCI DSS. Allow TLSv1.2 and TLSv1.3 only.",
  },
];

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
const BEST_KEY = "misconfig-best";

const Misconfig = () => {
  const [seed, setSeed] = useState(0);
  const rounds = useMemo(() => shuffle(ROUNDS).slice(0, 6), [seed]);
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem(BEST_KEY) || 0);
    } catch {
      return 0;
    }
  });

  const r = rounds[n];

  const pick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === r.bad) setScore((s) => s + 1);
  };

  const advance = () => {
    if (n + 1 >= rounds.length) {
      setDone(true);
      const final = score;
      setBest((b) => {
        const v = Math.max(b, final);
        try {
          localStorage.setItem(BEST_KEY, String(v));
        } catch {
          /* ignore */
        }
        return v;
      });
    } else {
      setN(n + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setSeed((s) => s + 1);
    setN(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="max-w-[640px] mx-auto panel p-8 text-center">
        <div className="font-mono text-[13px] text-muted-foreground">review finished</div>
        <div className="mt-2 text-[44px] font-semibold font-mono">
          {score}/{rounds.length}
        </div>
        <p className="mt-2 text-muted-foreground">
          {score === rounds.length
            ? "Clean review. You would have caught all of these before production did."
            : score >= rounds.length / 2
            ? "Good eye. A couple would have made it to production."
            : "Production would have found these for you. Try another round."}
        </p>
        <div className="mt-1 font-mono text-[12px] text-muted-foreground">best {best}/{rounds.length}</div>
        <button onClick={restart} className="btn-primary mt-6">
          New round
        </button>
      </div>
    );
  }

  const answered = picked !== null;
  const correct = picked === r.bad;

  return (
    <div className="max-w-[640px] mx-auto">
      <div className="flex items-center justify-between font-mono text-[12px] text-muted-foreground mb-2">
        <span>
          file {n + 1} of {rounds.length} · score {score}
        </span>
        <span>click the line that will hurt you</span>
      </div>
      <div className="panel overflow-hidden">
        <div className="px-4 h-10 flex items-center border-b border-border font-mono text-[12.5px] bg-secondary/50">{r.file}</div>
        <ol className="font-mono text-[13px] sm:text-[13.5px] py-2 overflow-x-auto">
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
                    !answered && "hover:bg-[hsl(var(--warn-wash))] cursor-pointer",
                    answered && isBad && "bg-ok/15",
                    answered && isPicked && !isBad && "bg-bad/15 line-through decoration-bad/60"
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
          <div className={cn("font-mono text-[12.5px]", correct ? "text-ok" : "text-bad")}>
            {correct ? "✔ caught it" : `✘ it was line ${r.bad + 1}`}
          </div>
          <p className="mt-1.5 text-[15px] leading-relaxed">{r.why.replace(/`/g, "")}</p>
          <button onClick={advance} className="btn-primary h-10 mt-4">
            {n + 1 >= rounds.length ? "See result" : "Next file"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Misconfig;
