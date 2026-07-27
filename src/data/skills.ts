export interface Skill {
  name: string;
  icon: string;
  proficiency: number;
  category: string;
}

export const skills: Skill[] = [
  {
    name: "AWS",
    icon: "/skills/aws.png",
    proficiency: 90,
    category: "Cloud",
  },
  {
    name: "Azure",
    icon: "/skills/azure.png",
    proficiency: 60,
    category: "Cloud",
  },
  {
    name: "GCP",
    icon: "/skills/gcp.png",
    proficiency: 60,
    category: "Cloud",
  },
  {
    name: "Terraform",
    icon: "/skills/terraform.png",
    proficiency: 90,
    category: "IaC",
  },
  {
    name: "Kubernetes",
    icon: "/skills/kubernetes.png",
    proficiency: 80,
    category: "Container Orchestration",
  },
  {
    name: "Docker",
    icon: "/skills/docker.png",
    proficiency: 90,
    category: "Containerization",
  },
  {
    name: "Helm",
    icon: "/skills/helm.png",
    proficiency: 80,
    category: "Container Orchestration",
  },
  {
    name: "Karpenter",
    icon: "./karpenter.png",
    proficiency: 80,
    category: "Container Orchestration",
  },
  {
    name: "Jenkins",
    icon: "/skills/jenkins.png",
    proficiency: 80,
    category: "CI/CD",
  },
  {
    name: "GitHub Actions",
    icon: "/skills/github-actions.png",
    proficiency: 90,
    category: "CI/CD",
  },
  {
    name: "Argo CD",
    icon: "./argo.png",
    proficiency: 80,
    category: "CI/CD",
  },
  {
    name: "GitLab CI/CD",
    icon: "/skills/gitlab-cicd.png",
    proficiency: 60,
    category: "CI/CD",
  },
  {
    name: "Ansible",
    icon: "/skills/ansible.png",
    proficiency: 70,
    category: "Configuration Management",
  },
  {
    name: "Git",
    icon: "/skills/git.png",
    proficiency: 90,
    category: "Version Control",
  },
  {
    name: "Linux",
    icon: "/skills/linux.png",
    proficiency: 90,
    category: "Operating System",
  },
  {
    name: "Windows",
    icon: "/skills/windows.png",
    proficiency: 70,
    category: "Operating System",
  },
  {
    name: "Python",
    icon: "/skills/python.png",
    proficiency: 80,
    category: "Programming",
  },
  {
    name: "GoLang",
    icon: "/skills/golang.png",
    proficiency: 40,
    category: "Programming",
  },
  {
    name: "Bash",
    icon: "/skills/bash.png",
    proficiency: 90,
    category: "Programming",
  },
  {
    name: "AWS CloudFormation",
    icon: "/skills/aws-cloudformation.png",
    proficiency: 90,
    category: "IaC",
  },
  {
    name: "Concourse CI",
    icon: "/skills/concourse-ci.png",
    proficiency: 70,
    category: "CI/CD",
  },
  {
    name: "Prometheus",
    icon: "/skills/prometheus.png",
    proficiency: 90,
    category: "Monitoring",
  },
  {
    name: "Grafana",
    icon: "/skills/grafana.png",
    proficiency: 90,
    category: "Monitoring",
  },
  {
    name: "Datadog",
    icon: "/skills/datadog.png",
    proficiency: 40,
    category: "Monitoring",
  },
  {
    name: "ELK Stack",
    icon: "/skills/elk-stack.png",
    proficiency: 70,
    category: "Monitoring",
  },
  {
    name: "SonarQube",
    icon: "/skills/sonarqube.png",
    proficiency: 70,
    category: "Security",
  },
  {
    name: "Snyk",
    icon: "/skills/snyk.png",
    proficiency: 80,
    category: "Security",
  },
  {
    name: "Checkmarx",
    icon: "./checkmarx.png",
    proficiency: 50,
    category: "Security",
  },
  {
    name: "Trivy",
    icon: "/trivy.png",
    proficiency: 80,
    category: "Security",
  },
  {
    name: "Grype",
    icon: "/grype.png",
    proficiency: 85,
    category: "Security",
  },
  {
    name: "OWASP ZAP",
    icon: "./owasp.png",
    proficiency: 80,
    category: "Security",
  },
  {
    name: "WAF",
    icon: "./waf.png",
    proficiency: 90,
    category: "Security",
  },
  {
    name: "Wazuh",
    icon: "./wazuh.png",
    proficiency: 90,
    category: "Security",
  },
  {
    name: "Nginx",
    icon: "/skills/nginx.png",
    proficiency: 90,
    category: "Gateway",
  },
  {
    name: "AWS API Gateway",
    icon: "/skills/aws-api-gateway.png",
    proficiency: 80,
    category: "Gateway",
  },
  {
    name: "MySQL",
    icon: "/skills/mysql.png",
    proficiency: 80,
    category: "Database",
  },
  {
    name: "MongoDB",
    icon: "/skills/mongodb.png",
    proficiency: 70,
    category: "Database",
  },
  {
    name: "PostgreSQL",
    icon: "/skills/postgresql.png",
    proficiency: 60,
    category: "Database",
  },
  {
    name: "DynamoDB",
    icon: "/skills/dynamodb.png",
    proficiency: 70,
    category: "Database",
  },
];

export const skillCategories = Array.from(new Set(skills.map((s) => s.category)));
