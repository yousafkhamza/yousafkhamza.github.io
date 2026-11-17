export const profile = {
  name: "Yousaf K Hamza",
  role: "Senior DevOps / DevSecOps & Platform Engineer",
  location: "Dubai, UAE",
  timezone: "Asia/Dubai",
  email: "yousaf.k.hamza@gmail.com",
  phone: "+971 50 985 2566",
  phoneAlt: "+91 77367 20639",
  workAuth: "UAE employment visa",
  careerStart: "2018-10",
  openTo: ["Senior DevOps", "Platform Engineering", "SRE", "DevSecOps"],
  domains: ["Fintech & payments", "Regulated enterprise", "Multi-cloud"],
  linkedin: "https://www.linkedin.com/in/yousafkhamza/",
  github: "https://github.com/yousafkhamza",
  resume: "/resume.pdf",
  summary:
    "Senior DevOps & Platform Engineer with 8+ years leading secure, highly available AWS and Kubernetes platforms for fintech and regulated enterprises. Owns production end to end: EKS migrations, Terraform automation, GitOps delivery, and SOC 2 / PCI / ISO 27001 controls built into CI/CD.",
};

/** whole years since the first role, so the number never goes stale */
export const yearsOfExperience = () => {
  const [y, m] = profile.careerStart.split("-").map(Number);
  const now = new Date();
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  return Math.floor(months / 12);
};

export interface Impact {
  metric: string;
  value: number;
  /** how the number is printed */
  display: string;
  direction: "down" | "up";
  how: string;
  where: string;
}

export const impact: Impact[] = [
  { metric: "Critical security findings", value: 90, display: "−90%", direction: "down", how: "scanning + policy checks in CI/CD", where: "Alamy" },
  { metric: "Infrastructure provisioning time", value: 70, display: "−70%", direction: "down", how: "end-to-end Terraform", where: "Pay10" },
  { metric: "Deployment effort", value: 60, display: "−60%", direction: "down", how: "30+ apps moved ECS → EKS with Helm", where: "Pay10" },
  { metric: "Incident triage time", value: 40, display: "−40%", direction: "down", how: "Grafana, Prometheus, Loki dashboards", where: "Pay10" },
  { metric: "Release cycle", value: 25, display: "−25%", direction: "down", how: "Jenkins + Docker pipeline rework", where: "Quantiphi" },
  { metric: "Monthly AWS bill", value: 25, display: "−20–25%", direction: "down", how: "rightsizing, Karpenter, HPA/VPA", where: "Pay10" },
];

export interface Service {
  id: string;
  title: string;
  who: string;
  what: string[];
  format: string;
}

export const services: Service[] = [
  {
    id: "career",
    title: "1:1 DevOps career guidance",
    who: "Sysadmins, support engineers and juniors moving into DevOps, or mid-level engineers aiming for senior.",
    what: [
      "Where you are vs. what senior roles actually ask for",
      "A learning path built around projects, not course lists",
      "Which certifications are worth it for your target role",
      "Moving into the UAE / Gulf job market",
    ],
    format: "Video call",
  },
  {
    id: "resume",
    title: "Resume & LinkedIn review",
    who: "Anyone applying for DevOps, Platform, SRE or Cloud roles.",
    what: [
      "Rewrite bullets around impact and numbers",
      "Keywords recruiters and ATS filters look for",
      "Portfolio and GitHub that back up the resume",
      "Written notes you can keep",
    ],
    format: "Async review + short call",
  },
  {
    id: "interview",
    title: "Mock DevOps interview",
    who: "Engineers with an interview coming up.",
    what: [
      "Kubernetes, AWS, Terraform and CI/CD questions at the right level",
      "A live troubleshooting scenario",
      "System design for a production platform",
      "Honest feedback on what to fix",
    ],
    format: "Video call",
  },
  {
    id: "infra",
    title: "Infrastructure review",
    who: "Startups and small teams running on AWS or Kubernetes without a dedicated platform engineer.",
    what: [
      "Cost, security and reliability quick wins",
      "IAM, network and Kubernetes configuration check",
      "CI/CD and release process review",
      "A prioritised list you can act on",
    ],
    format: "Call + written report",
  },
];
