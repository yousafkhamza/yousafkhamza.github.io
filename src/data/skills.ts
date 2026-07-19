export interface Skill {
  name: string;
  icon: string;
  proficiency: number;
  category: string;
}

export const skills: Skill[] = [
  {
    name: "AWS",
    icon: "https://www.svgrepo.com/show/448266/aws.svg",
    proficiency: 90,
    category: "Cloud",
  },
  {
    name: "Azure",
    icon: "https://www.svgrepo.com/show/452062/microsoft.svg",
    proficiency: 60,
    category: "Cloud",
  },
  {
    name: "GCP",
    icon: "https://www.svgrepo.com/show/448223/gcp.svg",
    proficiency: 60,
    category: "Cloud",
  },
  {
    name: "Terraform",
    icon: "https://www.svgrepo.com/show/354447/terraform-icon.svg",
    proficiency: 90,
    category: "IaC",
  },
  {
    name: "Kubernetes",
    icon: "https://www.svgrepo.com/show/448233/kubernetes.svg",
    proficiency: 80,
    category: "Container Orchestration",
  },
  {
    name: "Docker",
    icon: "https://www.svgrepo.com/show/452192/docker.svg",
    proficiency: 90,
    category: "Containerization",
  },
  {
    name: "Helm",
    icon: "https://www.svgrepo.com/show/448231/helm.svg",
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
    icon: "https://www.svgrepo.com/show/373699/jenkins.svg",
    proficiency: 80,
    category: "CI/CD",
  },
  {
    name: "GitHub Actions",
    icon: "https://www.svgrepo.com/show/512317/github-142.svg",
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
    icon: "https://www.svgrepo.com/show/353785/gitlab.svg",
    proficiency: 60,
    category: "CI/CD",
  },
  {
    name: "Ansible",
    icon: "https://www.svgrepo.com/show/373429/ansible.svg",
    proficiency: 70,
    category: "Configuration Management",
  },
  {
    name: "Git",
    icon: "https://www.svgrepo.com/show/452210/git.svg",
    proficiency: 90,
    category: "Version Control",
  },
  {
    name: "Linux",
    icon: "https://www.svgrepo.com/show/448236/linux.svg",
    proficiency: 90,
    category: "Operating System",
  },
  {
    name: "Windows",
    icon: "https://www.svgrepo.com/show/382713/windows-applications.svg",
    proficiency: 70,
    category: "Operating System",
  },
  {
    name: "Python",
    icon: "https://www.svgrepo.com/show/452091/python.svg",
    proficiency: 80,
    category: "Programming",
  },
  {
    name: "GoLang",
    icon: "https://www.svgrepo.com/show/355038/golang.svg",
    proficiency: 40,
    category: "Programming",
  },
  {
    name: "Bash",
    icon: "https://www.svgrepo.com/show/353478/bash-icon.svg",
    proficiency: 90,
    category: "Programming",
  },
  {
    name: "AWS CloudFormation",
    icon: "https://images.seeklogo.com/logo-png/43/2/aws-cloudformation-logo-png_seeklogo-430935.png",
    proficiency: 90,
    category: "IaC",
  },
  {
    name: "Concourse CI",
    icon: "https://www.svgrepo.com/show/353595/concourse.svg",
    proficiency: 70,
    category: "CI/CD",
  },
  {
    name: "Prometheus",
    icon: "https://www.svgrepo.com/show/354219/prometheus.svg",
    proficiency: 90,
    category: "Monitoring",
  },
  {
    name: "Grafana",
    icon: "https://www.svgrepo.com/show/448228/grafana.svg",
    proficiency: 90,
    category: "Monitoring",
  },
  {
    name: "Datadog",
    icon: "https://www.svgrepo.com/show/448219/datadog.svg",
    proficiency: 40,
    category: "Monitoring",
  },
  {
    name: "ELK Stack",
    icon: "https://www.svgrepo.com/show/373575/elastic.svg",
    proficiency: 70,
    category: "Monitoring",
  },
  {
    name: "SonarQube",
    icon: "https://www.svgrepo.com/show/354365/sonarqube.svg",
    proficiency: 70,
    category: "Security",
  },
  {
    name: "Snyk",
    icon: "https://www.svgrepo.com/show/448249/snyk.svg",
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
    icon: "https://www.svgrepo.com/show/373924/nginx.svg",
    proficiency: 90,
    category: "Gateway",
  },
  {
    name: "AWS API Gateway",
    icon: "https://www.svgrepo.com/show/353444/aws-api-gateway.svg",
    proficiency: 80,
    category: "Gateway",
  },
  {
    name: "MySQL",
    icon: "https://www.svgrepo.com/show/473731/mysql.svg",
    proficiency: 80,
    category: "Database",
  },
  {
    name: "MongoDB",
    icon: "https://www.svgrepo.com/show/439231/mongodb.svg",
    proficiency: 70,
    category: "Database",
  },
  {
    name: "PostgreSQL",
    icon: "https://www.svgrepo.com/show/439268/postgresql.svg",
    proficiency: 60,
    category: "Database",
  },
  {
    name: "DynamoDB",
    icon: "https://www.svgrepo.com/show/353450/aws-dynamodb.svg",
    proficiency: 70,
    category: "Database",
  },
];

export const skillCategories = Array.from(new Set(skills.map((s) => s.category)));
