export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  images: string[];
  github?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
  id: "universal-app-chart",
  title: "Universal App Helm Chart",
  description:
    "A production-ready, reusable Helm chart for deploying applications on Kubernetes and AWS EKS. Supports Deployments, StatefulSets, ALB Ingress, HPA, EBS, EFS, ConfigMaps, Secrets, IRSA, ServiceAccounts, node scheduling, health probes, and production-ready examples—all configurable through a single values.yaml.",
  tags: [
    "Helm",
    "Kubernetes",
    "AWS EKS",
    "Karpenter",
    "ArgoCD",
    "Open-Source",
    "DevOps",
    "Infrastructure as Code",
  ],
  images: ["/project-helm.jpg"],
  github: "https://github.com/yousafkhamza/universal-app-chart",
  demo: "https://yousafkhamza.github.io/universal-app-chart/",
},
{
  id: "iam-visualizer",
  title: "IAM Policy Visualizer",
  description:
    "A client-side tool that parses AWS IAM policy JSON and renders each statement as a risk-scored card — flagging wildcard actions, unscoped resources, missing Condition blocks, and privilege-escalation paths like unconditioned iam:PassRole in plain English. No policy data ever leaves the browser.",
  tags: [
    "TypeScript",
    "React",
    "Vite",
    "AWS IAM",
    "Security Tooling",
    "GitHub Actions",
    "Static Site",
    "Open-Source",
  ],
  images: ["/project-iam.png"],
  github: "https://github.com/yousafkhamza/iam-visualizer",
  demo: "https://yousafkhamza.github.io/iam-visualizer/",
},
{
  id: "podgauge",
  title: "podgauge",
  description:
    "A Kubernetes CPU/memory right-sizing tool that reads like a server-rack status wall instead of a spreadsheet. Ships with a read-only script that diffs kubectl top usage against configured requests/limits per Deployment, then paste the CSV into the browser — nothing leaves the tab. Suggests right-sized requests plus a memory limit with real headroom, but deliberately does NOT suggest a formula-based CPU limit by default: a limit sized off steady-state usage throttles JVM startup bursts (class loading, JIT warm-up) hard enough to turn a 10-20s boot into minutes, since only the request affects node scheduling — the limit is free to set generously or skip. A JVM-workloads toggle floors the fallback number at an observed startup-burst value for teams that must set one anyway.",
  tags: [
    "TypeScript",
    "React",
    "Vite",
    "Tailwind CSS",
    "Bash",
    "Kubernetes",
    "DevOps Tooling",
    "GitHub Actions",
    "Static Site",
    "Open-Source",
  ],
  images: ["/project-podgauge.png"],
  github: "https://github.com/yousafkhamza/podgauge",
  demo: "https://yousafkhamza.github.io/podgauge/",
},
{
  id: "aws-patch",
  title: "aws patch",
  description:
    "A production-grade Linux patch automation tool for AWS EC2, built in Bash. Supports Ubuntu, Amazon Linux 2 and Amazon Linux 2023 across multiple regions, with a ShellCheck-clean codebase, 51 passing tests, and a one-line installer.",
  tags: [
    "Bash", 
    "AWS EC2", 
    "Amazon Linux",
    "Ubuntu",
    "dnf",
    "apt",
    "yum",
    "Open-Source",
    "Patch Automation", 
    "ShellCheck", 
    "DevOps",
  ],
  images: ["/project-aws-batch.jpg"],
  github: "https://github.com/yousafkhamza/aws-patch",
  demo: "https://yousafkhamza.github.io/aws-patch/",
},
{
  id: "pxtrim",
  title: "pxtrim",
  description:
    "A tiny, fully client-side image resize, batch convert & compress tool. Drop one file or a whole batch, adjust scale/quality/format, and download — no uploads, no backend, no storage. Everything runs in the browser via the Canvas API for the current session only.",
  tags: [
    "JavaScript",
    "Vite",
    "Canvas API",
    "Frontend",
    "Open-Source",
    "GitHub Actions",
  ],
  images: ["/project-pxtrim.jpg"],
  github: "https://github.com/yousafkhamza/pxtrim",
  demo: "https://yousafkhamza.github.io/pxtrim/",
},
{
  id: "loadcannon",
  title: "loadcannon",
  description:
    "A CLI that load-tests internal and public HTTP APIs from one scenario format — public hostname, internal LB, or a direct IP with Host-header override, all through the same config. Wraps k6 for the actual traffic generation; loadcannon handles target resolution and secret injection. Tokens and passwords are never hardcoded — resolved at runtime from an env var, AWS SSM, or a masked prompt, and only ever passed to k6 via its process environment, never as a CLI argument or written to disk. Ships with six live example scenarios so it runs end-to-end against real public test APIs with zero setup.",
  tags: [
    "Go",
    "k6",
    "Kubernetes",
    "AWS",
    "DevOps Tooling",
    "GitHub Actions",
    "Static Site",
    "Open-Source",
  ],
  images: ["/project-loadcannon.png"],
  github: "https://github.com/yousafkhamza/loadcannon",
  demo: "https://yousafkhamza.github.io/loadcannon/",
},
{
  id: "openvpn-dns-tools",
  title: "openvpn-dns-tools",
  description:
    "A DNS-attribution toolkit for OpenVPN that answers what OpenVPN itself can't: who ran this query. Captures DNS on the tunnel interface and correlates it against live session state — status.log on Community Edition, sacli VPNStatus on Access Server (including AWS Marketplace) — auto-detecting which one you're running, no config edits either way. VPN IPs get reused across sessions, so every match is resolved by IP and timestamp together, never IP alone, and an unparseable record is skipped rather than guessed. Ships with a one-command installer that auto-detects your tunnel interface and attribution backend, then wires up short commands and systemd services end-to-end.",
  tags: [
    "Python",
    "Bash",
    "OpenVPN",
    "Networking",
    "DevOps Tooling",
    "GitHub Actions",
    "Static Site",
    "Open-Source",
  ],
  images: ["/project-vpn-tool.png"],
  github: "https://github.com/yousafkhamza/openvpn-dns-tools",
  demo: "https://yousafkhamza.github.io/openvpn-dns-tools/",
},
{
  id: "kubesizer",
  title: "kubesizer",
  description:
    "A client-side tool that parses kubectl top output and renders sized CPU/memory requests and limits per container — peak+buffer sizing for a single snapshot, or percentile-based sizing (p50 requests, p95 limits) automatically once multiple snapshots are pasted. Ships with a bundled capture script for gathering samples during peak load, and traces exactly which snapshot a container's data is missing from if a kubectl call fails mid-run. No cluster data ever leaves the browser.",
  tags: [
    "TypeScript",
    "Vite",
    "Kubernetes",
    "DevOps Tooling",
    "GitHub Actions",
    "Static Site",
    "Open-Source",
  ],
  images: ["/project-kubesizer.png"],
  github: "https://github.com/yousafkhamza/k8s-resource-sizer",
  demo: "https://yousafkhamza.github.io/k8s-resource-sizer/",
},
{
  id: "accessrig",
  title: "accessrig",
  description:
    "A one-command CLI wrapper around JumpServer's official jmsctl.sh installer, built after one too many manual PAM deployments went sideways. Detects install-vs-update from real container state (not a bookkeeping file that can drift out of sync), and treats 'latest' as something you opt into rather than something that happens silently — every install/update pins an explicit --version, with --list-versions and --current-version to check before you commit. Downgrading to an older release requires an explicit --confirm-downgrade flag on top of the automatic backup, since a JumpServer DB schema that's already migrated forward isn't guaranteed to run cleanly against older application code. Also sets DOMAINS in JumpServer's shared config at install time — skipping this is the single most common cause of a 'CSRF Failed: Origin checking failed' error the first time you access JumpServer over HTTPS through a real domain, and it's easy to miss until it's already biting you in front of users.",
  tags: [
    "Bash",
    "JumpServer",
    "PAM",
    "Docker",
    "DevOps Tooling",
    "AWS",
    "GitHub Actions",
    "CLI",
    "Open-Source",
  ],
  images: ["/project-accessrig.png"],
  github: "https://github.com/yousafkhamza/accessrig",
  demo: "https://yousafkhamza.github.io/accessrig/",
},
{
  id: "the-manifest",
  title: "The Manifest",
  description:
    "A self-publishing daily e-newspaper for cloud & infrastructure news — AWS, Azure, GCP, Kubernetes, Terraform, Python, Go, Rust, and JavaScript/Node.js. A GitHub Actions cron job pulls each topic's official RSS/Atom feed every morning, keeps only the publisher's own title, summary, and thumbnail (falling back to original per-topic cover art when a feed has none), and rebuilds a broadsheet-style front page with zero manual steps.",
  tags: [
    "JavaScript",
    "Vite",
    "RSS Aggregation",
    "GitHub Actions",
    "Static Site",
    "Automation",
    "Open-Source",
    "DevOps",
  ],
  images: ["/project-manifest.png"],
  github: "https://github.com/yousafkhamza/the-manifest",
  demo: "https://yousafkhamza.github.io/the-manifest/",
},
];
