import { useState } from "react";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { Award } from "lucide-react";

interface Certification {
  id: string;
  title: string;
  organization: string;
  logo: string;
  date: string;
  description: string;
  logoClassName?: string;
}

const certifications: Certification[] = [
  {
    id: "aws-saa",
    title: "AWS Certified Solutions Architect Associate",
    organization: "Amazon Web Services",
    logo: "/aws.png",
    date: "2023",
    description:
      "In-depth knowledge of AWS architectural best practices, cloud security, and cost optimization.",
  },
  {
    id: "cka",
    title: "Certified Kubernetes Administrator",
    organization: "The Linux Foundation",
    logo: "/cka.png",
    date: "2023",
    description:
      "Expertise in managing and securing Kubernetes clusters in production environments.",
  },
  {
    id: "terraform-associate",
    title: "Terraform Associate Certification",
    organization: "KodeKloud",
    logo: "/kk.png",
    date: "2023",
    description:
      "Proficiency in Infrastructure as Code using Terraform for cloud automation.",
  },
  {
    id: "ethical-hacking",
    title: "Fundamentals of Ethical Hacking",
    organization: "Offense Hackers Academy",
    logo: "/oa.png",
    date: "2023",
    description:
      "Foundational knowledge of penetration testing, security vulnerabilities, and ethical hacking techniques.",
  },
];

const Certifications = () => {
  const [activeCert, setActiveCert] = useState<string | null>(null);

  const toggleCert = (id: string) => {
    setActiveCert(activeCert === id ? null : id);
  };

  return (
    <section
      id="certifications"
      className="py-20 md:py-28 relative bg-accent/50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="chip mb-4">Achievements</span>
          <h2 className="section-title">Certifications</h2>
        </div>
        <div className="max-w-4xl mx-auto grid gap-6">
          {certifications.map((cert) => (
            <AnimatedCard
              key={cert.id}
              className={`glass-card rounded-xl p-6 transition-all duration-300 ${
                activeCert === cert.id ? "shadow-lg" : ""
              }`}
              onClick={() => toggleCert(cert.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center p-2 shadow-sm">
                  <img
                    src={cert.logo}
                    alt={cert.organization}
                    className={`w-full h-full object-contain ${
                      cert.logoClassName || ""
                    }`}
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground">
                    {cert.title}
                  </h3>
                  <p className="text-yousaf">{cert.organization}</p>
                  <p className="text-sm text-foreground/60">
                    Issued {cert.date}
                  </p>
                </div>
                <div className="text-yousaf">
                  <Award
                    className={`transition-transform duration-300 ${
                      activeCert === cert.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              {activeCert === cert.id && (
                <div className="mt-4 pt-4 border-t border-border/50 text-foreground/80 animate-fade-in">
                  {cert.description}
                </div>
              )}
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
