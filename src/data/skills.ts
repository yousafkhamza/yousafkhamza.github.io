export interface SkillGroup {
  id: string;
  label: string;
  /** daily = used in production right now, the rest = shipped with before */
  daily: string[];
  also: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "cloud",
    label: "Cloud",
    daily: ["AWS", "EKS", "EC2", "VPC", "IAM", "S3", "RDS", "Route 53", "WAF", "CloudTrail"],
    also: ["Azure (AKS, Entra ID, Key Vault)", "GCP (GKE, Compute Engine)", "AWS Organizations"],
  },
  {
    id: "containers",
    label: "Containers",
    daily: ["Kubernetes", "Docker", "Helm", "Karpenter", "HPA / VPA"],
    also: ["AKS", "GKE", "OpenShift", "Amazon ECS"],
  },
  {
    id: "iac",
    label: "Infrastructure as Code",
    daily: ["Terraform"],
    also: ["CloudFormation", "Ansible"],
  },
  {
    id: "cicd",
    label: "CI/CD & GitOps",
    daily: ["Argo CD", "GitHub Actions", "Jenkins", "Kustomize", "k6 load testing"],
    also: ["GitLab CI", "Bitbucket", "Concourse CI", "goreleaser", "Supply-chain security for CI"],
  },
  {
    id: "security",
    label: "Security & Compliance",
    daily: ["GuardDuty", "Wazuh", "Trivy", "JumpServer PAM", "HashiCorp Vault", "IAM least privilege"],
    also: ["Snyk", "SonarQube", "Checkov", "SAST / DAST / SCA", "OpenVPN", "PCI DSS", "SOC 2", "ISO 27001", "CBUAE audit"],
  },
  {
    id: "observability",
    label: "Observability",
    daily: ["Prometheus", "Grafana", "Loki", "Grafana Alloy", "CloudWatch"],
    also: ["OpenTelemetry", "Fluent Bit", "New Relic", "ELK"],
  },
  {
    id: "ai",
    label: "AI & LLM Ops",
    daily: ["Agentic AI (tool-calling agents)", "RAG", "LLM integration", "Ollama", "Qwen", "Claude API", "Amazon Bedrock", "Qdrant"],
    also: ["vLLM", "GPU NodePools (Karpenter)", "KEDA", "OpenAI / Gemini APIs", "Prompt design & evals", "AI code review in CI", "SageMaker", "MLOps", "FastAPI"],
  },
  {
    id: "code",
    label: "Scripting",
    daily: ["Bash", "Python"],
    also: ["Go (CLI tools)", "TypeScript", "React (internal tools)"],
  },
  {
    id: "data",
    label: "Data & streaming",
    daily: ["PostgreSQL", "MySQL"],
    also: ["MSSQL", "MongoDB", "DynamoDB", "Apache Kafka", "Kinesis"],
  },
];
