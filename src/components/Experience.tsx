import { useState } from "react";
import AnimatedCard from "@/components/ui/AnimatedCard";

const experiences = [
  {
    id: "alamy",
    title: "DevOps Engineer",
    company: "Alamy Inc",
    logo: "/alamy.png",
    period: "Nov 2023 - Present",
    location: "Trivandrum, India",
    description: [
      "Optimized AWS infrastructure efficiency by 20% using EC2, S3, RDS, IAM, and tagging methods.",
      "Implemented Terraform-based IAM user management with GitHub-controlled versioning for 90% of modifications.",
      "Configured Azure Active Directory (AAD) app registrations for secure application access.",
      "Enhanced EKS deployments with optimized CI/CD workflows and auto-scaling policies.",
      "Integrated security tools (Snyk, Trivy, Grype, SonarQube, Checkov) for 90% improved code quality and security.",
    ],
  },
  {
    id: "quantiphi",
    title: "Senior Platform Engineer",
    company: "Quantiphi Inc",
    logo: "https://images.seeklogo.com/logo-png/43/1/quantiphi-logo-png_seeklogo-434243.png",
    period: "Aug 2021 - Nov 2023",
    location: "Trivandrum, India",
    description: [
      "Managed GCP cost optimization, reducing cloud expenditure using billing and budgeting tools.",
      "Implemented Blue-Green deployments, achieving 100% uptime and seamless rollbacks.",
      "Orchestrated CI/CD pipelines with GitHub Actions, Jenkins, reducing deployment time by 25%.",
      "Led Agile sprint planning, improving project timelines by 20% and boosting team morale by 15%.",
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
      "Mentored a team of 5 cloud support engineers for efficient issue resolution and collaboration.",
      "Implemented cost monitoring strategies, saving up to 15% annually on AWS budgets.",
      "Automated security checks using Ansible for 100+ servers, ensuring compliance.",
    ],
  },
  {
    id: "activelobby",
    title: "System Engineer (TechOps)",
    company: "Activelobby Information Systems",
    logo: "/al.png",
    period: "Oct 2018 - Mar 2020",
    location: "Ernakulam, India",
    description: [
      "Containerized applications using Docker, improving deployment consistency by 20%.",
      "Implemented AWS infrastructure, enhancing cost efficiency and product quality by 20%.",
      "Deployed Nagios and Zabbix monitoring for 150+ servers, reducing downtime by 98%.",
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
