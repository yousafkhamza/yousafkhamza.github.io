import { useState } from "react";
import AnimatedCard from "@/components/ui/AnimatedCard";

const experiences = [
  {
    id: "Pay10",
    title: "DevOps Engineer",
    company: "Pay10",
    logo: "/pay10.png",
    period: "Oct 2025 - Present",
    location: "United Arab Emirates",
    description: [
      " Deployed and managed microservices on AWS ECS with API Gateway, ensuring high availability, scalability, and secure communication.",
      " Automated infrastructure provisioning and configuration using Terraform, enabling consistent, version-controlled IaC deployments.",
      " Designed and maintained CI/CD pipelines in Jenkins integrated with GitLab, improving build, test, and release efficiency.",
      " Conducted compliance and audit reviews for fintech cloud environments, ensuring alignment with UAE regulatory and security standards.",
      " Administered Linux servers and FreeIPA authentication, enhancing access control, identity management, and operational security.",
      " Developed Bash automation scripts for deployment, monitoring, and system maintenance across containers and standalone environments.",
    ],
  },
  {
    id: "alamy",
    title: "DevOps Engineer",
    company: "Alamy",
    logo: "/alamy.png",
    period: "Nov 2023 - Oct 2025",
    location: "Trivandrum, India",
    description: [
      " Architected and implemented cloud-native infrastructure on AWS using Terraform, Docker, EKS, Jenkins, GitHub Actions, and Helm to enable scalable, secure, and fully automated CI/CD pipelines.",
      " Implemented high-availability and disaster recovery architecture for MSSQL, MySQL, PostgreSQL, and AWS ElastiCache (Redis) across multiple environments, fully provisioned and managed through Terraform with CloudWatch monitoring and IAM-based security.",
      " Engineered automation solutions using Python (AWS Lambda) and Bash for large-scale systems, pipelines, and on-server operations, enhancing reliability and reducing manual intervention.",
      " Reduced vulnerabilities by 90% by integrating SAST, DAST, Grype and SonarQube into CI/CD.",
      " Improved CI speed and flexibility by deploying GitHub Actions self-hosted runners on AWS.",
      " Enforced consistency across environments using Helm and Kustomize in Kubernetes deployments.",
      " Built an observability platform using Grafana, Prometheus and Loki for proactive monitoring.",
      " Collaborated closely with development, QA, and security teams to align infrastructure changes with application requirements, reducing misconfigurations and deployment issues.",
      " Integrated Azure AD SSO with internal tools, improving access control and user experience.",
      " Migrated legacy services (e.g., Solr to AWS OpenSearch, on-prem NGINX to AWS EKS) and modern applications (Node.js, TypeScript, React.js) to AWS-native and AWS EKS.",
      " Automated OpenSearch cluster provisioning, scaling, and monitoring with Terraform and scripts.",
      " Experienced in cloud security best practices, IAM policies, and threat scanning.",
      " Secured AWS and Kubernetes access with RBAC and enforced MFA for tighter identity control.",
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
      " Architected end-to-end, multi-environment DevOps workflows with scalable, secure, and automated infrastructure on AWS.",
      " Streamlined CI/CD pipelines using AWS CodePipeline, reducing release cycles by 25%.",
      " Built and optimised end-to-end database infrastructure, including PostgreSQL, MSSQL, MariaDB, with performance tuning and replication.",
      " Used CloudFormation for legacy stack provisioning alongside Terraform.",
      " Created DynamoDB tables and AWS ElastiCache (Redis) clusters infrastructure for caching.",
      " Developed and deployed blue-green deployment strategies integrated with security checks.",
      " Managed Kubernetes workloads end-to-end using deployments, services, ingress, config maps, and secrets for secure, scalable delivery.",
      " Set up and managed centralised logging with the ELK stack (Elasticsearch, Logstash, Kibana) to enhance observability and accelerate incident response.",
      " Mentored juniors and led KT sessions, improving team performance and onboarding efficiency.",
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
      " Delivered AWS-based Linux infrastructure support and automated configuration and patching with Ansible across multi-node EC2 setups.",
      " Deployed monitoring using Zabbix/Nagios for 100+ shared servers.",
      " Improved system uptime and reliability by automating incident response and implementing robust monitoring and alerting practices.",
      " Proactively defined and tracked SLAs & SLOs for core services to maintain reliability and resolution.",
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
      " Led a 5-member tech support team, managing AWS and Linux-based environments.",
      " Automated infrastructure for staging environments and hardened servers with backup policies.",
      " Created shell scripts to automate user provisioning, backups, and environment health checks, reducing manual workload by 40%.",
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
