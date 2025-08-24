import AnimatedCard from "@/components/ui/AnimatedCard";
import Terminal from "@/components/ui/Terminal";
import { Cloud, Server, Award } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="chip mb-4">About Me</span>
          <h2 className="section-title">DevOps Engineer Profile</h2>
          <p className="text-foreground/70 mt-4 max-w-2xl mx-auto">
            Try the interactive terminal below! Use commands like{" "}
            <code className="bg-foreground/10 px-2 py-1 rounded">
              cat profile
            </code>
            ,<code className="bg-foreground/10 px-2 py-1 rounded mx-1">ls</code>
            , or{" "}
            <code className="bg-foreground/10 px-2 py-1 rounded">help</code> to
            explore.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          <AnimatedCard className="glass-card rounded-2xl p-6 lg:p-8 order-2 lg:order-1 flex flex-col">
            <Terminal
              interactive={true}
              height="480px"
              title="Interactive Terminal - Try typing 'help'"
            />
          </AnimatedCard>

          <div
            className="flex flex-col gap-6 order-1 lg:order-2"
            style={{ height: "588px" }}
          >
            <AnimatedCard className="glass-card rounded-2xl p-6 flex items-start space-x-4 transition-all hover:translate-x-1 flex-1">
              <div className="rounded-full bg-yousaf/10 p-3 text-yousaf flex-shrink-0">
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

            <AnimatedCard className="glass-card rounded-2xl p-6 flex items-start space-x-4 transition-all hover:translate-x-1 flex-1">
              <div className="rounded-full bg-yousaf/10 p-3 text-yousaf flex-shrink-0">
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

            <AnimatedCard className="glass-card rounded-2xl p-6 flex items-start space-x-4 transition-all hover:translate-x-1 flex-1">
              <div className="rounded-full bg-yousaf/10 p-3 text-yousaf flex-shrink-0">
                <Award className="w-6 h-9" />
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
