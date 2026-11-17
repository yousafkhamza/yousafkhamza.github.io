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
    daily: ["Argo CD", "GitHub Actions", "Jenkins", "Kustomize"],
    also: ["GitLab CI", "Bitbucket", "Concourse CI"],
  },
  {
    id: "security",
    label: "Security & Compliance",
    daily: ["GuardDuty", "Wazuh", "Trivy", "JumpServer PAM", "HashiCorp Vault"],
    also: ["Snyk", "SonarQube", "Checkov", "SAST / DAST / SCA", "PCI DSS", "SOC 2", "ISO 27001", "CBUAE audit"],
  },
  {
    id: "observability",
    label: "Observability",
    daily: ["Prometheus", "Grafana", "Loki", "CloudWatch"],
    also: ["OpenTelemetry", "Fluent Bit", "New Relic", "ELK"],
  },
  {
    id: "ai",
    label: "AI / ML & Data",
    daily: ["LLM integration", "Ollama", "Amazon Bedrock"],
    also: ["SageMaker", "Apache Kafka", "Kinesis", "MLOps"],
  },
  {
    id: "code",
    label: "Scripting",
    daily: ["Bash", "Python"],
    also: ["Go", "TypeScript"],
  },
  {
    id: "data",
    label: "Databases",
    daily: ["PostgreSQL", "MySQL"],
    also: ["MSSQL", "MongoDB", "DynamoDB"],
  },
];
