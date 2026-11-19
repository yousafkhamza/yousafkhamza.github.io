import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileDown } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { experiences } from "@/data/experience";
import { profile, yearsOfExperience } from "@/data/profile";
import Pass, { PassField } from "@/components/Pass";
import { CertPasses, EducationPasses } from "@/components/Credentials";

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
        <div className="wrap py-12 sm:py-16 flex flex-col gap-6">
          {experiences.map((e) => (
            <Pass
              key={e.id}
              id={e.id}
              row="md"
              stubFirst
              stubWidth="300px"
              className="scroll-mt-28"
              label={`Release ${e.version} · ${e.end ? "Departed" : "Now boarding"}`}
              code={e.location}
              stub={
                <div className="p-6 grid grid-cols-2 md:grid-cols-1 gap-4 content-start">
                  <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2.5">
                      <img src={e.logo} alt="" className="w-8 h-8 rounded-lg object-contain bg-white border border-border" />
                      <span className="text-[16px] font-bold text-yousaf">{e.company}</span>
                      {!e.end && (
                        <span className="text-[13.5px] font-display font-semibold uppercase text-ok flex items-center gap-1.5">
                          <span className="dot" /> current
                        </span>
                      )}
                    </div>
                    <h2 className="mt-3 font-display text-[28px] font-bold uppercase leading-[1.02]">{e.title}</h2>
                  </div>
                  <PassField k="From" v={e.period.split(" – ")[0]} />
                  <PassField k="To" v={e.end ? e.period.split(" – ")[1] : "Present"} />
                </div>
              }
              main={
                <div className="p-6 sm:p-8">
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
                      <span key={s} className="tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </section>

      <Section label="Credentials" title="Certifications">
        <CertPasses />
      </Section>

      <Section label="Education" title="Where it started">
        <EducationPasses />
      </Section>
    </div>
  );
};

export default ExperiencePage;
