import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileDown } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { experiences } from "@/data/experience";
import { profile, yearsOfExperience } from "@/data/profile";
import { CertPasses, QualificationPasses } from "@/components/Credentials";

const ExperiencePage = () => {
  const { hash } = useLocation();


  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }, [hash]);

  return (
    <div>
      <PageHero
        path="experience"
        title={<>{yearsOfExperience()} years, five releases.</>}
        description="From TechOps support in 2018 to leading DevOps for a payments platform in Dubai. Full notes for every role below, newest first."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={profile.resume} target="_blank" rel="noopener" className="btn-primary">
            <FileDown className="w-4 h-4" /> Resume PDF
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            LinkedIn profile
          </a>
        </div>
      </PageHero>

      <section className="rule-t">
        <div className="wrap py-12 sm:py-16 flex flex-col gap-5">
          {experiences.map((e) => (
            <article
              key={e.id}
              id={e.id}
              className="panel scroll-mt-28 p-6 sm:p-8 grid md:grid-cols-[280px_1fr] gap-6 md:gap-12"
            >
              <header>
                <div className="flex items-center gap-2">
                  <span className="tag">{e.version}</span>
                  {!e.end && (
                    <span className="flex items-center gap-1.5 text-[14px] font-semibold text-ok">
                      <span className="dot" /> current
                    </span>
                  )}
                </div>
                <h2 className="mt-3 font-display text-[28px] font-bold leading-[1.05]">{e.title}</h2>
                <div className="mt-2 flex items-center gap-2.5">
                  <img src={e.logo} alt="" className="w-7 h-7 rounded-md object-contain bg-white border border-border" />
                  <span className="text-[16px] font-semibold text-yousaf">{e.company}</span>
                </div>
                <div className="mt-2 text-[14.5px] text-muted-foreground leading-relaxed">
                  {e.period}
                  <br />
                  {e.location}
                </div>
              </header>
              <div>
                <p className="text-[18px] leading-relaxed font-medium">{e.summary}</p>
                <ul className="mt-5 space-y-3">
                  {e.description.map((d) => (
                    <li key={d} className="relative pl-5 text-[15.5px] leading-relaxed text-foreground/80">
                      <span className="absolute left-0 top-0 font-bold text-yousaf">→</span>
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {e.stack.map((s) => (
                    <span key={s} className="tool">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Section label="Credentials" title="Certifications">
        <CertPasses />
      </Section>

      <Section label="Education" title="Where it started">
        <QualificationPasses />
      </Section>
    </div>
  );
};

export default ExperiencePage;
