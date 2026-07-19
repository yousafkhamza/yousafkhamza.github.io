import { useState, useEffect } from "react";
import { GraduationCap, Award } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { experiences } from "@/data/experience";
import { education } from "@/data/education";
import { certifications } from "@/data/certifications";

const ExperiencePage = () => {
  const [openCert, setOpenCert] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Experience | Yousaf K Hamza";
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Career"
        title="Seven years building platforms that stay up."
        description="From TechOps support to leading Kubernetes platform architecture for fintech — here's the path, the credentials, and the schools it started at."
      />

      {/* EXPERIENCE TIMELINE */}
      <Section>
        <div className="relative max-w-3xl">
          <div className="absolute left-[23px] top-3 bottom-3 w-px bg-border" />
          <div className="space-y-10">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-16">
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full border-2 border-background overflow-hidden bg-white ring-1 ring-border">
                  <img src={exp.logo} alt={exp.company} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
                  <h3 className="text-lg font-bold text-foreground">{exp.title}</h3>
                  <span className="text-xs font-mono text-muted-foreground">{exp.period}</span>
                </div>
                <div className="text-sm text-yousaf font-medium mb-3">
                  {exp.company} · {exp.location}
                </div>
                <ul className="space-y-2">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex items-start text-sm text-foreground/75 leading-relaxed">
                      <span className="text-yousaf mr-2.5 mt-1 shrink-0 text-xs">●</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* EDUCATION */}
      <Section>
        <span className="eyebrow">Academic Background</span>
        <h2 className="section-title">Education</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 max-w-3xl">
          {education.map((edu) => (
            <div key={edu.degree} className="flex items-center gap-4 rounded-2xl border border-border p-5">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white flex items-center justify-center p-2 shrink-0">
                <img src={edu.logo} alt={edu.school} className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-foreground truncate">{edu.degree}</div>
                <div className="text-sm text-muted-foreground truncate">{edu.school}</div>
                <div className="text-xs font-mono text-yousaf mt-0.5">{edu.period}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CERTIFICATIONS */}
      <Section border={false}>
        <span className="eyebrow">Achievements</span>
        <h2 className="section-title">Certifications</h2>
        <div className="grid grid-cols-1 gap-3 mt-8 max-w-3xl">
          {certifications.map((cert) => {
            const isOpen = openCert === cert.id;
            return (
              <button
                key={cert.id}
                onClick={() => setOpenCert(isOpen ? null : cert.id)}
                className={`text-left rounded-xl border p-4 sm:p-5 transition-colors ${
                  isOpen ? "border-yousaf/40 bg-yousaf/5" : "border-border hover:border-yousaf/25"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-white flex items-center justify-center p-1.5 shrink-0">
                    <img
                      src={cert.logo}
                      alt={cert.organization}
                      className={`w-full h-full object-contain ${cert.logoClassName || ""}`}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground truncate">{cert.title}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {cert.organization} · {cert.date}
                    </div>
                  </div>
                  <Award
                    className={`w-4 h-4 text-yousaf shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
                {isOpen && (
                  <p className="text-sm text-foreground/70 leading-relaxed mt-3 pt-3 border-t border-border/60 animate-fade-in">
                    {cert.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
};

export default ExperiencePage;
