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
      "Designed secure, multi-region AWS architecture with cost-optimised provisioning.",
      "Reduced critical vulnerabilities by 90% by integrating SAST, DAST, and container scans into CI/CD.",
      "Improved CI speed and flexibility by deploying GitHub Actions self-hosted runners on AWS.",
      "Enforced consistency across environments using Helm and Kustomize in Kubernetes deployments.",
      "Built an observability platform using Grafana, Prometheus, and Loki for proactive monitoring.",
      "Collaborated closely with development, QA, and security teams to align infrastructure changes with application requirements, reducing misconfigurations and deployment issues.",
      "Integrated Azure AD SSO with internal tools, improving access control and user experience.",
      "Migrated legacy services (Jenkins, Solr, Nginx) to AWS-native and managed alternatives.",
      "Led .NET, NodeJs, TypeScript application setup/migration to AWS, EKS.",
      "Experienced in cloud security best practices, IAM policies, and threat scanning.",
      "Secured AWS and Kubernetes access with RBAC and enforced MFA for tighter identity control.",
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
      " Managed GCP projects and implemented cost-effective infrastructure strategies.",
      " Streamlined CI/CD pipelines using AWS CodePipeline, reducing release cycles by 25%.",
      " Mentored junior engineers and conducted knowledge-sharing sessions on Terraform best practices, improving team efficiency and reducing onboarding time.",
      " Developed and deployed blue-green deployment strategies integrated with security checks.",
      " Managed Kubernetes workloads end-to-end using deployments, services, ingress, config maps, and secrets for secure, scalable delivery.",
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
      " Delivered AWS/Linux infrastructure support and automated OS patching using Ansible.",
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
