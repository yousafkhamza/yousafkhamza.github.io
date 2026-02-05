import { useState } from "react";
import AnimatedCard from "@/components/ui/AnimatedCard";

const experiences = [
  {
    id: "Pay10",
    title: "DevOps Engineer",
    company: "Pay10 UAE",
    logo: "/pay10.png",
    period: "Oct 2025 - Present",
    location: "United Arab Emirates",
    description: [
      " Architected secure, highly available (HA) AWS ECS microservices using Terraform, applying SRE and Reliability Engineering principles with 99.9% uptime and automated scaling.",
      " Built scalable serverless APIs using API Gateway and Lambda for mobile applications, delivering low-latency responses (<200 ms) with integrated logging, and monitoring.",
      " Built a SIEM/XDR-oriented cloud security monitoring platform using Wazuh, GuardDuty, AWS Config, and CloudWatch, centralizing alerts and reducing MTTR by 35% via Slack and Grafana dashboards.",
      " Implemented AWS WAF, CloudFront, and Global Accelerator to secure applications and edge traffic, blocking malicious requests and improving global response times by 30%.",
      " Embedded Trivy and SonarQube into CI/CD pipelines, reducing security and compliance risks by 40% before production deployments.",
      " Delivered hybrid partner connectivity using OpenVPN, Site-to-Site VPN, and AWS Direct Connect, supporting secure integrations with high availability.",
      " Engineered HA/DR-aware CloudWatch-to-S3 Glacier archival pipelines, meeting 100% SOC2, PCI, and CBUAE audit retention requirements.",
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
      " Designed and operated scalable AWS platforms using Terraform, EKS, and automated GitHub Actions CI/CD pipelines with Helm and Kustomize.",
      " Designed High Availability (HA) and Disaster Recovery (DR) architectures for MSSQL, MySQL, PostgreSQL, and Redis using Terraform automation.",
      " Reduced vulnerabilities by 90% through SAST/DAST/SCA integrations (Grype, Checkov, Checkmarx).",
      " Implemented GitHub Actions self-hosted runners on AWS to improve CI/CD cost and efficiency.",
      " Migrated Apache Solr to AWS OpenSearch, on-prem NGINX Gateway to EKS and on-prem Apache Tomcat, Zookeeper and Kafka to EKS/EC2 improving performance and reliability.",
      " Built complete observability stack using NewRelic, Prometheus, Grafana, and Loki for EKS Cluster.",
      " Integrated Azure Active Directory (AD) SSO for secure unified access across internal tools.",
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
      " Delivered multi-environment AWS and GCP platforms using Terraform and automated CI/CD.",
      " Implemented AWS CodePipeline, Jenkins workflows by reducing release cycles by 25%.",
      " Managed EKS, ECS, GKE, and Elastic Beanstalk with blue-green and rolling deployments.",
      " Implemented centralized ELK logging with dashboards for application observability.",
      " Developed Bash and Python automations to streamline operational tasks and reduce manual effort.",
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
      " Automated EC2 configuration, patching, and infrastructure tasks using Ansible and Bash.",
      " Deployed Zabbix/Nagios monitoring for 100+ servers improving uptime and response times.",
      " Defined SLAs/SLOs and improved reliability processes across environments.",
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
      " Managed AWS/Linux infrastructure and automated staging environments.",
      " Created Shell/Python automation for provisioning, backups, and system health checks.",
      " Led a 5-member technical support team and improved operational efficiency by 40%.",
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
