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
