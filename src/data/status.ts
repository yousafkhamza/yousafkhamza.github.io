/**
 * The "platform status" section: each area I work in, the year it first shows up
 * in a role (see experience.ts stacks and descriptions), and the results behind it.
 * Every number here comes from experience.ts or profile.ts `impact`; the source role
 * is named so it can be checked.
 */
export interface StatusEvidence {
  value: string;
  label: string;
  /** a few words for the always-visible summary line, e.g. "critical findings" */
  short: string;
  /** which role the number comes from */
  where?: string;
}

export interface StatusComponent {
  id: string;
  name: string;
  /** first year this area appears in a role */
  from: number;
  evidence: StatusEvidence[];
}

export const statusComponents: StatusComponent[] = [
  {
    id: "linux",
    name: "Linux & automation",
    from: 2018,
    evidence: [{ value: "Linux + Windows", short: "production servers", label: "production servers, backups, patching and shell automation", where: "Activelobby IS" }],
  },
  {
    id: "observability",
    name: "Monitoring & observability",
    from: 2020,
    evidence: [
      { value: "100+", short: "servers monitored", label: "production servers monitored against SLA/SLO targets", where: "Armia Systems" },
      { value: "−40%", short: "triage time", label: "incident triage time with Grafana, Prometheus and Loki", where: "Pay10 UAE" },
    ],
  },
  {
    id: "cloud",
    name: "AWS & multi-cloud",
    from: 2021,
    evidence: [
      { value: "AWS · Azure · GCP", short: "multi-cloud", label: "multi-cloud infrastructure for enterprise clients", where: "Quantiphi" },
      { value: "−70%", short: "provisioning time", label: "infrastructure provisioning time with end-to-end Terraform", where: "Pay10 UAE" },
      { value: "−25%", short: "AWS bill", label: "monthly AWS bill: rightsizing, Karpenter, HPA/VPA", where: "Pay10 UAE" },
    ],
  },
  {
    id: "kubernetes",
    name: "Kubernetes / EKS",
    from: 2021,
    evidence: [
      { value: "50+", short: "microservices", label: "microservices on the Kubernetes platform I owned", where: "Alamy" },
      { value: "30+", short: "apps to EKS", label: "apps moved from ECS to EKS with Helm", where: "Pay10 UAE" },
      { value: "99.9%", short: "availability", label: "availability across 30+ microservices", where: "Pay10 UAE" },
    ],
  },
  {
    id: "delivery",
    name: "CI/CD & GitOps",
    from: 2021,
    evidence: [
      { value: "−25%", short: "release cycle", label: "release cycle", where: "Quantiphi" },
      { value: "−60%", short: "deployment effort", label: "deployment effort with Helm and Argo CD", where: "Pay10 UAE" },
    ],
  },
  {
    id: "security",
    name: "Security & compliance",
    from: 2023,
    evidence: [
      { value: "−90%", short: "critical findings", label: "critical infrastructure security findings", where: "Alamy" },
      { value: "35", short: "servers under PAM", label: "production servers behind privileged access management", where: "Pay10 UAE" },
      { value: "PCI DSS · SOC 2", short: "in the pipeline", label: "controls built into the pipeline", where: "Pay10 UAE" },
    ],
  },
  {
    id: "ai",
    name: "AI for operations",
    from: 2023,
    evidence: [{ value: "LLM", short: "code review in CI", label: "code review in CI", where: "Alamy" }],
  },
];
