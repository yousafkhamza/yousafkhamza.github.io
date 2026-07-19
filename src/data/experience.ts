export interface Experience {
  id: string;
  title: string;
  company: string;
  logo: string;
  period: string;
  location: string;
  description: string[];
}

export const experiences: Experience[] = [
  {
    id: "Pay10",
    title: "DevOps Engineer",
    company: "Pay10 UAE",
    logo: "/pay10.png",
    period: "Oct 2025 - Present",
    location: "United Arab Emirates",
    description: [
      "Architected and operated highly available AWS and Azure platforms supporting 30+ microservices across Production, UAT, and Pre-Production environments using Amazon EKS, Terraform, Helm, ArgoCD, and GitOps, maintaining 99.9% service availability.",
      "Led the migration of 30+ applications from Amazon ECS to Amazon EKS, standardizing deployments with Helm charts and ArgoCD ApplicationSets, reducing deployment effort by 60% while improving release consistency and scalability.",
      "Automated cloud infrastructure provisioning using Terraform, eliminating manual deployments and reducing infrastructure provisioning time by 70% across networking, compute, IAM, storage, and Kubernetes resources.",
      "Built enterprise CI/CD and GitOps pipelines using Jenkins, Git, Helm, Docker, Amazon ECR, and ArgoCD, enabling multiple production-ready deployments daily with automated rollback, version control, and zero-downtime deployment strategies.",
      "Implemented centralized observability using Grafana, Prometheus, Loki, and Amazon CloudWatch, improving incident detection and reducing troubleshooting time by 40% through proactive monitoring, alerting, and infrastructure dashboards.",
      "Optimized AWS infrastructure through EC2 rightsizing, Kubernetes autoscaling (Karpenter, HPA/VPA), EBS/EFS optimization, and CloudWatch log retention improvements, contributing to 20–25% monthly cloud cost savings while maintaining application performance.",
      "Embedded DevSecOps practices into CI/CD pipelines through automated security scanning, IAM best practices, and infrastructure validation while serving as the primary DevOps engineer for production Kubernetes platforms, leading incident response, root cause analysis, capacity planning, and continuous reliability improvements.",
    ],
  },
  {
    id: "alamy",
    title: "Senior DevOps Engineer",
    company: "Alamy",
    logo: "/alamy.png",
    period: "Nov 2023 - Oct 2025",
    location: "Trivandrum, India",
    description: [
      "Managed Kubernetes-based application platforms supporting 50+ microservices across multiple environments, improving platform stability, workload scalability, and release consistency.",
      "Engineered highly available cloud networking using AWS VPC, Direct Connect, Site-to-Site VPN, NAT Gateway, Route Tables, and Security Groups, ensuring secure hybrid connectivity between enterprise and cloud environments.",
      "Administered relational and distributed database platforms, implementing backup, replication, high availability, and disaster recovery strategies to support business continuity objectives.",
      "Improved application security by integrating automated vulnerability assessments, policy validation, and security controls into delivery workflows, reducing critical infra security findings by 90%.",
      "Modernized legacy application and search workloads by migrating them to cloud-native container platforms, improving scalability, operational resilience, and overall system performance.",
      "Implemented enterprise identity and access management using AWS IAM, Azure Active Directory (Entra ID), RBAC, and SSO to strengthen access governance and least-privilege security.",
    ],
  },
  {
    id: "quantiphi",
    title: "Senior Platform Engineer",
    company: "Quantiphi",
    logo: "/qph.png",
    period: "Aug 2021 - Nov 2023",
    location: "Trivandrum, India",
    description: [
      "Delivered multi-cloud infrastructure across AWS, Azure, and GCP using Terraform and Infrastructure as Code, enabling standardized and repeatable cloud deployments.",
      "Managed container platforms including Amazon EKS, Amazon ECS, and Azure Kubernetes Service (AKS), implementing rolling and blue-green deployment strategies for highly available applications.",
      "Built CI/CD pipelines using Jenkins, Git, Docker, and Kubernetes, reducing release cycles by 25% while improving deployment consistency.",
      "Implemented centralized monitoring, logging, and secrets management using cloud-native services and open-source observability tools, improving platform visibility and operational efficiency.",
    ],
  },
  {
    id: "armia",
    title: "System Engineer (Cloud Support)",
    company: "Armia Systems",
    logo: "/armia.png",
    period: "Jun 2020 - Aug 2021",
    location: "Ernakulam, India",
    description: [
      "Automated Linux-based cloud infrastructure provisioning, patch management, and configuration management using scripting and automation tools, improving operational consistency.",
      "Designed monitoring and alerting solutions for 100+ production servers, improving infrastructure availability and supporting SLA/SLO objectives.",
      "Performed capacity planning, performance tuning, and incident troubleshooting to improve production stability and reduce service disruptions.",
    ],
  },
  {
    id: "activelobby",
    title: "System Engineer (TechOps)",
    company: "Activelobby",
    logo: "/al.png",
    period: "Oct 2018 - Feb 2020",
    location: "Ernakulam, India",
    description: [
      "Managed Linux and Windows servers supporting production and staging environments, including system administration, backup management, and infrastructure maintenance.",
      "Automated operational tasks using shell scripting, improving deployment efficiency, reducing manual effort, and supporting a 5-member technical operations team.",
    ],
  },
];
