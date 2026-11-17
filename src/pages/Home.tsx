import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy } from "lucide-react";
import Hero from "@/components/home/Hero";
import ReleaseHistory from "@/components/home/ReleaseHistory";
import ImpactBoard from "@/components/home/ImpactBoard";
import StackView from "@/components/home/StackView";
import Section from "@/components/layout/Section";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import { projects } from "@/data/projects";
import { certifications } from "@/data/certifications";
import { education } from "@/data/education";
import { profile, services } from "@/data/profile";

const CopyEmail = () => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(profile.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.location.href = `mailto:${profile.email}`;
        }
      }}
      className="btn-ghost font-mono text-[14px]"
    >
      {copied ? <Check className="w-4 h-4 text-ok" /> : <Copy className="w-4 h-4" />}
      {copied ? "copied" : profile.email}
    </button>
  );
};

const Home = () => {
  useEffect(() => {
    document.title = "Yousaf K Hamza | Senior DevOps & Platform Engineer, Dubai";
  }, []);

  const featured = projects.slice(0, 3);

  return (
    <div>
      <Hero />

      <Section
        id="career"
        label="Career"
        title="Release history"
        intro="Five roles, one direction: from looking after servers to owning the platform. Pick a release to read its notes."
      >
        <Reveal>
          <ReleaseHistory />
        </Reveal>
      </Section>

      <Section
        id="impact"
        label="Impact"
        title="Numbers from production"
        intro="Measured on real platforms, not in a lab. Each one is on the resume with the project behind it."
      >
        <Reveal>
          <ImpactBoard />
        </Reveal>
      </Section>

      <Section
        id="work"
        label="Open source"
        title="Built because I needed them"
        intro="Tools that started as a problem at work. All open source, all documented, most running in a browser with nothing to install."
        aside={
          <Link to="/projects" className="btn-link">
            All {projects.length} projects <ArrowRight className="w-4 h-4" />
          </Link>
        }
      >
        <div className="grid md:grid-cols-3 gap-5">
          {featured.map((p, i) => (
            <Reveal key={p.id}>
              <ProjectCard project={p} index={i} compact />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="stack" label="Stack" title="What I work with" intro="The first line in each group is what I run in production today. The grey line is what I have shipped with before.">
        <StackView />
      </Section>

      <Section id="credentials" label="Credentials" title="Certified and qualified">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-[var(--radius)] overflow-hidden">
          {certifications.map((c) => (
            <div key={c.id} className="bg-card px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <div className={c.core ? "text-[15px] font-semibold" : "text-[14.5px]"}>{c.title}</div>
                <div className="text-[13px] text-muted-foreground mt-0.5">{c.organization}</div>
              </div>
              <span className="font-mono text-[12px] text-muted-foreground shrink-0">{c.date}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          {education.map((e) => (
            <div key={e.degree} className="border-l-2 border-foreground pl-4">
              <div className="label mb-1">Education</div>
              <div className="text-[16px] font-semibold">{e.degree}</div>
              <div className="text-[14px] text-muted-foreground">{e.school}</div>
              <div className="font-mono text-[12px] text-muted-foreground mt-1">{e.period}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="services"
        label="Office hours"
        title="I also help people get into DevOps"
        intro="Career guidance, resume reviews, mock interviews and infrastructure reviews. Ask through the contact form."
        aside={
          <Link to="/services" className="btn-link">
            How it works <ArrowRight className="w-4 h-4" />
          </Link>
        }
      >
        <div className="border-t border-border">
          {services.map((s, i) => (
            <Link
              key={s.id}
              to={`/contact?topic=${s.id}`}
              className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[56px_1fr_1.4fr_auto] gap-4 items-center py-5 border-b border-border group"
            >
              <span className="font-mono text-[13px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[18px] font-semibold group-hover:text-yousaf transition-colors">{s.title}</span>
              <span className="hidden sm:block text-[14px] text-muted-foreground">{s.who}</span>
              <span className="font-mono text-[12.5px] inline-flex items-center gap-1 text-foreground/70 group-hover:text-yousaf">
                ask <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <section className="rule-t">
        <div className="wrap py-20 sm:py-28">
          <div className="label mb-4">Hiring?</div>
          <h2 className="text-[34px] sm:text-[52px] font-semibold tracking-[-0.03em] leading-[1.05] max-w-[20ch]">
            Looking for someone to own your platform?
          </h2>
          <p className="lede mt-5">
            Open to senior DevOps, platform engineering and SRE roles. The fastest way to reach me is
            email or LinkedIn.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/contact?topic=hiring" className="btn-primary">
              Start a conversation <ArrowRight className="w-4 h-4" />
            </Link>
            <CopyEmail />
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
