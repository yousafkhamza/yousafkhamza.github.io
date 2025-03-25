import AnimatedCard from "@/components/ui/AnimatedCard";
import Terminal from "@/components/ui/Terminal";
import { Cloud, Server, Award } from "lucide-react";

const About = () => {
  const terminalContent = `# Yousaf K Hamza
  
> DevOps Engineer with 6+ years of expertise
> Based in Thrissur, Kerala, India 🇮🇳

Professional Journey:
- 6+ years in cloud infrastructure, automation, and security
- Expertise in AWS, Terraform, Kubernetes, and CI/CD pipelines
- Proven track record in optimizing cloud costs and deployment processes

Educational Background:
- MSc Computer Science (2021-2023), Bharathiar University
- BTech Computer Science (2014-2018), North East Frontier Technical University

# Core Competencies
- Cloud Infrastructure
- DevOps Automation
- Build Infrastructure as Code
- Kubernetes & Containerization
- Security Implementation
- Cost Optimization Strategies`;

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="chip mb-4">About Me</span>
          <h2 className="section-title">DevOps Engineer Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <AnimatedCard className="glass-card rounded-2xl p-8 lg:p-10 flex flex-col justify-center order-2 md:order-1">
            <Terminal>{terminalContent}</Terminal>
          </AnimatedCard>

          <div className="flex flex-col gap-6 order-1 md:order-2">
            <AnimatedCard className="glass-card rounded-2xl p-6 flex items-start space-x-4 transition-all hover:translate-x-1">
              <div className="rounded-full bg-yousaf/10 p-3 text-yousaf">
                <Cloud className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">
                  Cloud Infrastructure Specialist
                </h4>
                <p className="text-foreground/70">
                  Proficient in AWS, GCP, and Azure cloud platforms with
                  expertise in infrastructure optimization, cost management, and
                  scalable cloud solutions.
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard className="glass-card rounded-2xl p-6 flex items-start space-x-4 transition-all hover:translate-x-1">
              <div className="rounded-full bg-yousaf/10 p-3 text-yousaf">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">
                  DevOps & Automation Expert
                </h4>
                <p className="text-foreground/70">
                  Specializing in CI/CD pipelines, containerization with
                  Kubernetes and Docker, and implementing robust automation
                  strategies across cloud environments.
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard className="glass-card rounded-2xl p-6 flex items-start space-x-4 transition-all hover:translate-x-1">
              <div className="rounded-full bg-yousaf/10 p-3 text-yousaf">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">
                  Certified Professional
                </h4>
                <p className="text-foreground/70">
                  Holding multiple certifications including AWS Solutions
                  Architect, Certified Kubernetes Administrator, and Terraform
                  Associate Certification, demonstrating advanced expertise in
                  cloud technologies.
                </p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
