import { useState } from "react";
import AnimatedCard from "@/components/ui/AnimatedCard";

const experiences = [
  {
    id: "alamy",
    title: "DevOps Engineer",
    company: "Alamy",
    logo: "/alamy.png",
    period: "Nov 2023 - Present",
    location: "Trivandrum, India",
    description: [
      "Architected and automated AWS infrastructure for multi-region scalability, cost efficiency, and security compliance.",
      "Migrated legacy Solr search infrastructure to AWS OpenSearch, improving search performance and reducing operational overhead.",
      "Designed and implemented GitOps workflow using Argo CD for Kubernetes deployments, enabling faster, consistent, and auditable releases across environments.",
      "Built and maintained GitHub Actions Self-Hosted Runners in AWS for optimized CI pipeline performance and flexibility across teams.",
      "Integrated DevSecOps tools (Snyk, Trivy, Checkov) into CI/CD pipelines, reducing critical vulnerabilities by 90%.",
      "Automated IAM role and resource provisioning using Terraform with AWS best practices and tagging policies.",
      "Deployed centralized observability stack using Grafana, Loki, and Prometheus for proactive monitoring and faster incident response.",
      "Collaborated with cross-functional teams on architecture decisions, security reviews, and infrastructure roadmaps.",
      "Standardized Kubernetes deployment patterns using Helm/Kustomize for multi-environment application management, ensuring consistency and scalability across dev, stage, and production clusters.",
      "Integrated Azure Active Directory (Azure AD) SSO with internal applications to enable secure authentication and seamless user access management across the organization.",
    ],
  },
  {
    id: "quantiphi",
    title: "Senior Platform Engineer",
    company: "Quantiphi",
    logo: "https://images.seeklogo.com/logo-png/43/1/quantiphi-logo-png_seeklogo-434243.png",
    period: "Aug 2021 - Nov 2023",
    location: "Trivandrum, India",
    description: [
      "Managed GCP project environments, resource provisioning, and cost optimization initiatives.",
      "Built and maintained CI/CD pipelines using AWS CodePipeline and Concourse CI, reducing release times by 25%.",
      "Automated infrastructure provisioning on AWS using Terraform and developed reusable IaC modules to accelerate environment setup.",
      "Implemented centralized logging and monitoring solutions using AWS CloudWatch and custom dashboards for enhanced observability and faster incident response.",
      "Designed blue-green deployment strategies and implemented security scanning across pipelines.",
      "Automated infrastructure and application deployments using Terraform and Kubernetes manifests.",
      "Drove Agile practices, facilitating sprint ceremonies and ensuring timely delivery.",
    ],
  },
  {
    id: "armia",
    title: "System Engineer (Cloud Support)",
    company: "Armia Systems",
    logo: "/armia.png",
    period: "May 2020 - Aug 2021",
    location: "Ernakulam, India",
    description: [
      "Provided cloud infrastructure support and automation for AWS and Linux-based systems.",
      "Configured proactive monitoring and alerting solutions for 100+ servers using Zabbix and Nagios.",
      "Automated patching and hardening of systems via Ansible playbooks.",
      "Led knowledge-sharing sessions for junior team members on cloud best practices.",
    ],
  },
  {
    id: "activelobby",
    title: "System Engineer (TechOps)",
    company: "Activelobby",
    logo: "/al.png",
    period: "Oct 2018 - Mar 2020",
    location: "Ernakulam, India",
    description: [
      "Implemented Docker-based containerization for application environments.",
      "Mentored a 5-member team, resolving escalations and managing Linux/Windows environments.",
      "Automated AWS infrastructure provisioning for development and staging environments.",
      "Configured server hardening, monitoring, and backup strategies.",
      "Collaborated with development teams for infrastructure support and incident resolution.",
    ],
  },
];

const Experience = () => {
  const [activeExperience, setActiveExperience] = useState(experiences[0].id);

  const handleTabClick = (id: string) => {
    setActiveExperience(id);
  };

  const activeExp =
    experiences.find((exp) => exp.id === activeExperience) || experiences[0];

  return (
    <section id="experience" className="py-20 md:py-28 relative bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="chip mb-4">My Journey</span>
          <h2 className="section-title">Professional Experience</h2>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible space-x-4 md:space-x-0 md:space-y-2 p-1 pb-4">
                {experiences.map((exp) => (
                  <button
                    key={exp.id}
                    className={`p-4 text-left rounded-lg transition-all flex-shrink-0 flex items-center space-x-3 ${
                      activeExperience === exp.id
                        ? "bg-white dark:bg-black/20 shadow-md"
                        : "hover:bg-white/50 dark:hover:bg-white/5"
                    }`}
                    onClick={() => handleTabClick(exp.id)}
                  >
                    <img
                      src={exp.logo}
                      alt={exp.company}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3
                        className={`font-medium truncate ${
                          activeExperience === exp.id
                            ? "text-yousaf"
                            : "text-foreground/70"
                        }`}
                      >
                        {exp.company}
                      </h3>
                      <p className="text-sm text-foreground/60 truncate">
                        {exp.period}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-8">
              <AnimatedCard className="glass-card rounded-2xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {activeExp.title}
                    </h3>
                    <p className="text-yousaf">{activeExp.company}</p>
                    <p className="text-sm text-foreground/60 mt-1">
                      {activeExp.period} • {activeExp.location}
                    </p>
                  </div>
                  <img
                    src={activeExp.logo}
                    alt={activeExp.company}
                    className="w-16 h-16 rounded-lg object-cover hidden sm:block"
                  />
                </div>
                <ul className="space-y-3">
                  {activeExp.description.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yousaf mr-3">•</span>
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
