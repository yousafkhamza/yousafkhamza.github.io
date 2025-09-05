import { useState, useEffect } from "react";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Terminal from "@/components/ui/Terminal";
import { Cloud, Server, Award, Terminal as TerminalIcon } from "lucide-react";

const About = () => {
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    // Check if URL contains terminal parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("terminal") === "true") {
      setShowTerminal(true);
      // Remove the parameter from URL
      window.history.replaceState({}, "", window.location.pathname + "#about");
    }

    // Listen for custom event to activate terminal
    const handleActivateTerminal = () => {
      setShowTerminal(true);
    };

    window.addEventListener("activateTerminal", handleActivateTerminal);

    // Cleanup event listener
    return () => {
      window.removeEventListener("activateTerminal", handleActivateTerminal);
    };
  }, []);

  const handleTerminalToggle = (show: boolean) => {
    setShowTerminal(show);
    if (!show) {
      // Clear any terminal parameter when closing
      window.history.replaceState({}, "", window.location.pathname + "#about");
    }
  };

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="chip mb-4">About Me</span>
          <h2 className="section-title">Who I Am</h2>
          <p className="text-foreground/70 mt-4 max-w-2xl mx-auto">
            {showTerminal ? (
              <>
                Interactive terminal mode! Use commands like{" "}
                <code className="bg-foreground/10 px-2 py-1 rounded">
                  cat resume.pdf
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
                  onClick={() => handleTerminalToggle(true)}
                  className="text-yousaf hover:underline font-medium"
                >
                  Try interactive terminal →
                </button>
              </>
            )}
          </p>
        </div>

        {/* Terminal always comes first, then the cards */}
        <div className="max-w-6xl mx-auto flex flex-col gap-8 lg:gap-10">
          <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 flex flex-col">
            {showTerminal ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TerminalIcon className="w-5 h-5" />
                    Interactive Terminal
                  </h3>
                  <button
                    onClick={() => handleTerminalToggle(false)}
                    className="text-sm text-foreground/60 hover:text-foreground"
                  >
                    Show Profile ←
                  </button>
                </div>
                <Terminal
                  interactive={true}
                  height="355px"
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
                    Senior DevOps Engineer with 6+ years of experience
                    architecting cloud-native solutions and automating
                    infrastructure. Specialized in building secure, scalable
                    CI/CD pipelines and reducing operational overhead through
                    innovation.
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yousaf rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                        <strong>Cloud Platforms:</strong> AWS Solutions
                        Architect certified with expertise in EKS, Lambda, RDS,
                        and Infrastructure as Code
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yousaf rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                        <strong>Container Orchestration:</strong> Kubernetes
                        (CKA certified), Docker, Helm with production-grade
                        deployments and scaling
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yousaf rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                        <strong>DevSecOps:</strong> Integrated security
                        practices reducing vulnerabilities by 90% using SAST,
                        DAST, and automated scanning tools
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yousaf rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                        <strong>Leadership:</strong> Team leadership, mentoring,
                        and delivering enterprise-grade infrastructure
                        automation solutions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 sm:gap-6">
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
