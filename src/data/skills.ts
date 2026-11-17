export interface SkillGroup {
  id: string;
  label: string;
  /** in production right now (highlighted) */
  daily: string[];
  /** shipped with before, or used occasionally */
  also: string[];
}

// Kept roughly even (5-6 daily, 4-5 also) so the boxes line up.
export const skillGroups: SkillGroup[] = [
  {
    id: "cloud",
    label: "Cloud",
    daily: ["AWS", "EKS", "EC2", "IAM", "RDS", "S3"],
    also: ["CloudTrail", "AWS Organizations", "Azure (AKS, Entra ID)", "GCP (GKE)"],
  },
  {
    id: "containers",
    label: "Containers",
    daily: ["Kubernetes", "Docker", "Helm", "Karpenter", "HPA / VPA"],
    also: ["Amazon ECS", "AKS", "GKE", "OpenShift"],
  },
  {
    id: "iac",
    label: "IaC & scripting",
    daily: ["Terraform", "Bash", "Python"],
    also: ["CloudFormation", "Ansible", "Go (CLI tools)", "TypeScript"],
  },
  {
    id: "cicd",
    label: "CI/CD & GitOps",
    daily: ["Argo CD", "GitHub Actions", "Jenkins", "Kustomize"],
    also: ["GitLab CI", "Bitbucket Pipelines", "Concourse CI", "k6 load tests"],
  },
  {
    id: "security",
    label: "Security & compliance",
    daily: ["GuardDuty", "Wazuh", "Trivy", "JumpServer PAM", "HashiCorp Vault"],
    also: ["Checkov", "SonarQube", "PCI DSS", "SOC 2", "ISO 27001"],
  },
  {
    id: "observability",
    label: "Observability",
    daily: ["Prometheus", "Grafana", "Loki", "Grafana Alloy", "CloudWatch"],
    also: ["OpenTelemetry", "Fluent Bit", "ELK", "New Relic"],
  },
  {
    id: "ai",
    label: "AI & LLM Ops",
    daily: ["Agentic AI", "RAG", "Ollama", "Qwen", "Claude API", "Amazon Bedrock"],
    also: ["Qdrant", "vLLM", "GPU node pools", "OpenAI / Gemini APIs"],
  },
  {
    id: "network",
    label: "Networking & access",
    daily: ["VPC", "Route 53", "AWS WAF", "Site-to-Site VPN", "OpenVPN"],
    also: ["Direct Connect", "NAT Gateway", "Squid proxy", "SSO (Entra ID)"],
  },
  {
    id: "data",
    label: "Data & streaming",
    daily: ["PostgreSQL", "MySQL"],
    also: ["MSSQL", "MongoDB", "DynamoDB", "Apache Kafka", "Kinesis"],
  },
];
