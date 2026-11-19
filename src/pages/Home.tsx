import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy } from "lucide-react";
import Hero from "@/components/home/Hero";
import ReleaseHistory from "@/components/home/ReleaseHistory";
import ImpactBoard from "@/components/home/ImpactBoard";
import StackView from "@/components/home/StackView";
import WhyStrip from "@/components/home/WhyStrip";
import AiSection from "@/components/home/AiSection";
import Section from "@/components/layout/Section";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import { projects } from "@/data/projects";
import { certifications } from "@/data/certifications";
import { education } from "@/data/education";
import { profile, services } from "@/data/profile";
import Price from "@/components/Price";

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
      className="btn-ghost border-board-fg text-board-fg hover:bg-board-fg hover:text-[hsl(0_0%_7%)] text-[15px]"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? "copied" : profile.email}
    </button>
  );
};

const Home = () => {

  // the AI projects have their own section above, so lead with the rest here
  const featured = projects.filter((p) => !p.categories.includes("AI")).slice(0, 3);

  return (
    <div>
      <Hero />

      <Section
        id="ai"
        color="pink"
        label="DevOps × AI"
        title="AI that takes the first look, before you do"
        intro="AI projects I build and run myself, all open source. Each one has a live demo."
      >
        <AiSection />
      </Section>

      <Section
        id="work"
        color="violet"
        label="Open source"
        title="More open-source tools"
        intro="Each one started as a problem at work. All open source and documented, and most run in a browser with nothing to install."
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

      <Section
        id="career"
        color="cyan"
        label="Career"
        title="Release history"
        intro="Five roles since 2018, from TechOps to running the platform. Pick one to see what I did there."
      >
        <Reveal>
          <ReleaseHistory />
        </Reveal>
      </Section>

      <WhyStrip />

      <Section
        id="impact"
        color="pink"
        label="Impact"
        title="Impact, in numbers"
        intro="What changed on the platforms I run at work, and what I build in my own time. Switch tabs to see both."
      >
        <Reveal>
          <ImpactBoard />
        </Reveal>
      </Section>

      <Section
        id="services"
        color="green"
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
              style={{ ["--c" as string]: `var(--c-${["green", "cyan", "violet", "amber"][i % 4]})` }}
              className="grid grid-cols-[40px_1fr_auto] sm:grid-cols-[56px_1fr_1.2fr_auto_auto] gap-4 items-center py-5 border-b border-border group"
            >
              <span className="font-display text-[22px] font-bold" style={{ color: `hsl(var(--c-${["green", "cyan", "violet", "amber"][i % 4]}))` }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[18px] font-semibold group-hover:text-yousaf transition-colors">{s.title}</span>
              <span className="hidden sm:block text-[14px] text-muted-foreground">{s.who}</span>
              <Price usd={s.priceUsd} unit={s.unit} compact className="hidden md:inline-flex" />
              <span className="font-mono text-[14.5px] inline-flex items-center gap-1 text-foreground/70 group-hover:text-yousaf">
                ask <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="stack" color="amber" label="Stack" title="What I work with" intro="The highlighted tools are what I run in production today. The rest I have shipped with before.">
        <StackView />
      </Section>

      <Section id="credentials" color="cyan" label="Credentials" title="Certified and qualified">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-[var(--radius)] overflow-hidden">
          {certifications.map((c) => (
            <div key={c.id} className="bg-card px-5 py-4 flex items-start justify-between gap-4">
              <div>
                {c.core && <div className="font-mono text-[13px] font-semibold uppercase tracking-wider tint mb-1">core</div>}
                <div className={c.core ? "text-[15px] font-bold" : "text-[14.5px]"}>{c.title}</div>
                <div className="text-[13px] text-muted-foreground mt-0.5">{c.organization}</div>
              </div>
              <span className="font-mono text-[14px] text-muted-foreground shrink-0">{c.date}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          {education.map((e) => (
            <div key={e.degree} className="border-l-4 pl-4" style={{ borderColor: "hsl(var(--c-violet))" }}>
              <div className="label mb-1">Education</div>
              <div className="text-[16px] font-semibold">{e.degree}</div>
              <div className="text-[14px] text-muted-foreground">{e.school}</div>
              <div className="font-mono text-[14px] text-muted-foreground mt-1">{e.period}</div>
            </div>
          ))}
        </div>
      </Section>

      <section className="rule-t">
        <div className="wrap py-16 sm:py-24">
          <div className="board relative overflow-hidden px-6 sm:px-14 py-14 sm:py-20">
          <div className="inline-flex items-center gap-2 mb-5 px-2.5 py-1 bg-board-fg text-[hsl(0_0%_7%)] font-display text-[15px] font-bold uppercase tracking-[0.06em]">Now boarding · Hiring?</div>
          <h2 className="font-display text-[44px] sm:text-[72px] font-bold uppercase leading-[0.92] max-w-[20ch] text-white">
            Looking for someone to own your platform?
          </h2>
          <p className="mt-5 text-[18px] leading-relaxed text-board-dim max-w-[60ch]">
            Open to senior DevOps, platform engineering and SRE roles. The fastest way to reach me is
            email or LinkedIn.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/contact?topic=hiring" className="btn-primary">
              Start a conversation <ArrowRight className="w-4 h-4" />
            </Link>
            <CopyEmail />
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost border-board-fg text-board-fg hover:bg-board-fg hover:text-[hsl(0_0%_7%)]">
              LinkedIn
            </a>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
