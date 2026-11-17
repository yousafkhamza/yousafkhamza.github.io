export interface Experience {
  id: string;
  /** release tag shown in the history, oldest = v1 */
  version: string;
  /** signal colour used for this role across the site */
  color: "green" | "cyan" | "violet" | "amber" | "pink";
  title: string;
  company: string;
  logo: string;
  period: string;
  /** ISO month the role started / ended (end = null for current) — drives the timeline widths */
  start: string;
  end: string | null;
  location: string;
  /** one line a recruiter can read in five seconds */
  summary: string;
  stack: string[];
  description: string[];
}

export const experiences: Experience[] = [
  {
    id: "pay10",
    color: "green",
    version: "v5",
    title: "Senior DevOps Engineer",
    company: "Pay10 UAE",
    logo: "/pay10.png",
    period: "Oct 2025 – Present",
    start: "2025-10",
    end: null,
    location: "Dubai, UAE",
    summary:
      "Lead DevOps for a payments platform: 30+ microservices on EKS at 99.9% availability, with PCI DSS and SOC 2 controls built in.",
    stack: ["AWS", "EKS", "Terraform", "Helm", "Argo CD", "Karpenter", "Grafana", "JumpServer", "Azure"],
    description: [
      "Lead DevOps for production AWS and Kubernetes platforms supporting 30+ microservices across Production, UAT and Pre-Production using Amazon EKS, Terraform, Helm and Argo CD, maintaining 99.9% availability.",
      "Led the migration of 30+ applications from Amazon ECS to Amazon EKS, standardising deployments with Helm charts and reducing deployment effort by 60% while eliminating environment drift.",
      "Automated end-to-end AWS provisioning across networking, compute, IAM, storage and Kubernetes with Terraform, cutting provisioning time by 70% and removing manual steps.",
      "Architected Privileged Access Management with JumpServer CE across 35 production Linux and Windows servers, with vaulted accounts, session recording and audit controls aligned with PCI DSS and SOC 2.",
      "Designed Azure disaster recovery for critical workloads, with geo-redundant backups and automated failover aligned with RTO/RPO and compliance requirements.",
      "Engineered an API security and load-testing platform with endpoint discovery, baseline calibration and automated k6 test generation to catch vulnerabilities before release.",
      "Built CI/CD and GitOps pipelines with Jenkins, Docker, Amazon ECR, Helm and Argo CD, enabling several production deployments a day with automated rollback and zero-downtime releases.",
      "Established centralised observability with Grafana, Prometheus, Loki and CloudWatch, including an API Gateway access-log dashboard, reducing mean incident triage time by 40%.",
      "Reduced monthly AWS costs by 20–25% through EC2 rightsizing, Karpenter, HPA/VPA autoscaling and EBS/EFS optimisation, with no impact on performance or SLAs.",
      "Primary engineer for the production Kubernetes platform: incident response, root cause analysis, capacity planning and security checks built into every pipeline.",
    ],
  },
  {
    id: "alamy",
    color: "pink",
    version: "v4",
    title: "Senior DevOps Engineer",
    company: "Alamy",
    logo: "/alamy.png",
    period: "Nov 2023 – Oct 2025",
    start: "2023-11",
    end: "2025-10",
    location: "Trivandrum, India",
    summary:
      "Owned the Kubernetes platform behind 50+ microservices and cut critical infrastructure security findings by 90%.",
    stack: ["Kubernetes", "AWS", "Direct Connect", "Azure AD / Entra ID", "CI/CD security", "LLM code review", "Databases"],
    description: [
      "Owned the Kubernetes platform supporting 50+ microservices across multiple environments, improving deployment consistency, scalability and reliability for engineering teams.",
      "Reduced critical infrastructure security findings by 90% by integrating automated vulnerability scanning and policy validation into CI/CD pipelines.",
      "Built highly available hybrid networking with AWS VPC, Direct Connect, Site-to-Site VPN and NAT Gateway to secure enterprise-to-cloud connectivity.",
      "Migrated legacy application and search workloads to cloud-native container platforms, improving scalability and resilience.",
      "Ran relational and distributed database platforms with backup, replication, high availability and disaster recovery in place.",
      "Implemented enterprise IAM, RBAC and SSO with AWS IAM and Azure AD (Entra ID), strengthening least-privilege access across cloud and SaaS platforms.",
      "Integrated an LLM-based AI code review tool into CI/CD to automate pre-merge analysis, catch defects earlier and reduce manual review effort.",
    ],
  },
  {
    id: "quantiphi",
    color: "amber",
    version: "v3",
    title: "Senior Platform Engineer (SRE)",
    company: "Quantiphi",
    logo: "/qph.png",
    period: "Aug 2021 – Nov 2023",
    start: "2021-08",
    end: "2023-11",
    location: "Trivandrum, India",
    summary:
      "Delivered multi-cloud infrastructure on AWS, Azure and GCP for enterprise clients and cut release cycles by 25%.",
    stack: ["Terraform", "AWS", "Azure", "GCP", "EKS / ECS / AKS", "Jenkins", "SageMaker", "Kafka"],
    description: [
      "Delivered multi-cloud infrastructure across AWS, Azure and GCP with Terraform, standardising repeatable deployments for enterprise clients.",
      "Ran container platforms on Amazon EKS, Amazon ECS and Azure AKS, with rolling and blue-green deployments for highly available applications.",
      "Contributed to multi-cloud architecture and design reviews, mentored engineers, and supported on-call operations and incident response.",
      "Optimised CI/CD pipelines with Jenkins, Git, Docker and Kubernetes, reducing release cycles by 25% while improving consistency.",
      "Provisioned and managed AWS SageMaker, Kinesis and Apache Kafka infrastructure for ML training and real-time data streaming workloads.",
      "Set up centralised monitoring, logging and secrets management with cloud-native and open-source tooling.",
    ],
  },
  {
    id: "armia",
    color: "violet",
    version: "v2",
    title: "Site Reliability Engineer",
    company: "Armia Systems",
    logo: "/armia.png",
    period: "Jun 2020 – Aug 2021",
    start: "2020-06",
    end: "2021-08",
    location: "Ernakulam, India",
    summary: "Ran monitoring and alerting for 100+ production servers against SLA/SLO targets.",
    stack: ["Linux", "Monitoring", "Patch management", "Capacity planning"],
    description: [
      "Modernised Linux provisioning, patch management and configuration management, improving consistency across production environments.",
      "Implemented monitoring and alerting for 100+ production servers, supporting SLA/SLO objectives and faster incident response.",
      "Performed capacity planning and production incident troubleshooting, reducing service disruptions.",
    ],
  },
  {
    id: "activelobby",
    color: "cyan",
    version: "v1",
    title: "TechOps Engineer",
    company: "Activelobby IS",
    logo: "/al.png",
    period: "Oct 2018 – Feb 2020",
    start: "2018-10",
    end: "2020-02",
    location: "Ernakulam, India",
    summary: "Where it started: Linux and Windows production servers, backups, patching and shell automation.",
    stack: ["Linux", "Windows Server", "Bash", "Backups"],
    description: [
      "Administered Linux and Windows production and staging servers, managing backups, patching, monitoring and maintenance.",
      "Automated operational tasks with shell scripting, reducing manual effort across a 5-member technical operations team.",
    ],
  },
];
