import { useState } from "react";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Terminal from "@/components/ui/Terminal";
import { Cloud, Server, Award, Terminal as TerminalIcon } from "lucide-react";

const About = () => {
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="chip mb-4">About Me</span>
          <h2 className="section-title">DevOps Engineer Profile</h2>
          <p className="text-foreground/70 mt-4 max-w-2xl mx-auto">
            {showTerminal ? (
              <>
                Interactive terminal mode! Use commands like{" "}
                <code className="bg-foreground/10 px-2 py-1 rounded">
                  cat profile
                </code>
                ,
                <code className="bg-foreground/10 px-2 py-1 rounded mx-1">
                  ls
                </code>
                , or{" "}
                <code className="bg-foreground/10 px-2 py-1 rounded">help</code>{" "}
                to explore.
              </>
            ) : (
              <>
                Learn about my expertise and experience in DevOps and Cloud
                engineering.{" "}
                <button
                  onClick={() => setShowTerminal(true)}
                  className="text-yousaf hover:underline font-medium"
                >
                  Try interactive terminal →
                </button>
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 order-2 lg:order-1 flex flex-col">
            {showTerminal ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TerminalIcon className="w-5 h-5" />
                    Interactive Terminal
                  </h3>
                  <button
                    onClick={() => setShowTerminal(false)}
                    className="text-sm text-foreground/60 hover:text-foreground"
                  >
                    Show Profile ←
                  </button>
                </div>
                <Terminal
                  interactive={true}
                  height="440px"
                  title="Try typing 'help'"
                />
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                  About Yousaf K H
                </h3>
                <div className="space-y-3 sm:space-y-4 flex-1">
                  <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                    I'm a passionate DevOps Engineer with expertise in cloud
                    platforms, container orchestration, and infrastructure
                    automation. My mission is to bridge the gap between
                    development and operations through innovative solutions and
                    best practices.
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yousaf rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                        <strong>Cloud Expertise:</strong> AWS, Azure, GCP with
                        focus on scalable architecture and cost optimization
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yousaf rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                        <strong>DevOps Tools:</strong> Kubernetes, Docker,
                        Terraform, Jenkins, GitHub, CI/CD, Linux, Bash/Python
                        Scripting
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yousaf rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                        <strong>Security Focus:</strong> DevSecOps practices
                        with tools like Snyk, Grype, Trivy, and OWASP
                        integration
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yousaf rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                        <strong>Monitoring:</strong> Prometheus, Grafana, ELK
                        Stack for comprehensive observability
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:gap-6 order-1 lg:order-2">
            <AnimatedCard className="glass-card rounded-2xl p-4 sm:p-6 flex items-start space-x-3 sm:space-x-4 transition-all hover:translate-x-1">
              <div className="rounded-full bg-yousaf/10 p-2 sm:p-3 text-yousaf flex-shrink-0">
                <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-lg sm:text-xl font-bold mb-2 break-words">
                  Cloud Infrastructure Specialist
                </h4>
                <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                  Proficient in AWS, GCP, and Azure cloud platforms with
                  expertise in infrastructure optimization, cost management, and
                  scalable cloud solutions.
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard className="glass-card rounded-2xl p-4 sm:p-6 flex items-start space-x-3 sm:space-x-4 transition-all hover:translate-x-1">
              <div className="rounded-full bg-yousaf/10 p-2 sm:p-3 text-yousaf flex-shrink-0">
                <Server className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-lg sm:text-xl font-bold mb-2 break-words">
                  DevOps & Automation Expert
                </h4>
                <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                  Specializing in CI/CD pipelines, containerization with
                  Kubernetes and Docker, and implementing robust automation
                  strategies across cloud environments.
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard className="glass-card rounded-2xl p-4 sm:p-6 flex items-start space-x-3 sm:space-x-4 transition-all hover:translate-x-1">
              <div className="rounded-full bg-yousaf/10 p-2 sm:p-3 text-yousaf flex-shrink-0">
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-lg sm:text-xl font-bold mb-2 break-words">
                  Certified Professional
                </h4>
                <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
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
