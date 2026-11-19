import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileDown } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { experiences } from "@/data/experience";
import { education } from "@/data/education";
import { certifications } from "@/data/certifications";
import { profile, yearsOfExperience } from "@/data/profile";

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
        <div className="wrap">
          {experiences.map((e) => (
            <article
              key={e.id}
              id={e.id}
              className="scroll-mt-28 grid md:grid-cols-[280px_1fr] gap-6 md:gap-12 py-12 border-b border-border last:border-b-0"
              style={{ ["--c" as string]: `var(--c-${e.color})` }}
            >
              <header className="md:sticky md:top-32 self-start">
                <div className="flex items-center gap-2">
                  <span className="tag tint-bg border-transparent font-semibold">{e.version}</span>
                  {!e.end && (
                    <span className="font-mono text-[13.5px] text-ok flex items-center gap-1.5">
                      <span className="dot" /> current
                    </span>
                  )}
                </div>
                <h2 className="mt-3 font-display text-[24px] font-bold leading-tight">{e.title}</h2>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <img src={e.logo} alt="" className="w-6 h-6 rounded-[4px] object-contain bg-white border border-border" />
                  <span className="text-[15px] font-bold tint">{e.company}</span>
                </div>
                <div className="mt-2 font-mono text-[14px] text-muted-foreground leading-relaxed">
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
                      <span className="absolute left-0 top-0 font-mono tint">+</span>
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {e.stack.map((s) => (
                    <span key={s} className="tag">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-[var(--radius)] overflow-hidden">
          {certifications.map((c) => (
            <div key={c.id} className="bg-card p-5">
              <div className="flex items-center justify-between font-mono text-[13.5px] text-muted-foreground">
                <span>{c.organization}</span>
                <span>{c.date}</span>
              </div>
              <div className={c.core ? "mt-2 text-[16px] font-semibold" : "mt-2 text-[15px]"}>{c.title}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Education" title="Where it started">
        <div className="grid sm:grid-cols-2 gap-5">
          {education.map((e) => (
            <div key={e.degree} className="panel p-6 flex items-start gap-4">
              <img src={e.logo} alt="" className="w-11 h-11 rounded-[4px] object-contain bg-white border border-border" />
              <div>
                <div className="text-[17px] font-semibold">{e.degree}</div>
                <div className="text-[14.5px] text-muted-foreground">{e.school}</div>
                <div className="font-mono text-[14px] text-muted-foreground mt-1">{e.period}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default ExperiencePage;
