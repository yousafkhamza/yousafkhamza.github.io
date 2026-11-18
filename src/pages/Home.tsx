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
      className="btn-ghost font-mono text-[14px]"
    >
      {copied ? <Check className="w-4 h-4 text-ok" /> : <Copy className="w-4 h-4" />}
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
      <WhyStrip />

      <Section
        id="career"
        color="cyan"
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
        id="ai"
        color="pink"
        label="DevOps × AI"
        title="AI that takes the first look, before you do"
        intro="Where DevOps is heading: an agent that triages broken pods, a scanner that reviews CI pipelines for attacks, and retrieval over your own runbooks. All open source and live."
      >
        <AiSection />
      </Section>

      <Section
        id="work"
        color="violet"
        label="Open source"
        title="More tools I built because I needed them"
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

      <Section id="stack" color="amber" label="Stack" title="What I work with" intro="The highlighted tools are what I run in production today. The rest I have shipped with before.">
        <StackView />
      </Section>

      <Section id="credentials" color="cyan" label="Credentials" title="Certified and qualified">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-[var(--radius)] overflow-hidden">
          {certifications.map((c) => (
            <div key={c.id} className="bg-card px-5 py-4 flex items-start justify-between gap-4">
              <div>
                {c.core && <div className="font-mono text-[10.5px] font-semibold uppercase tracking-wider tint mb-1">core</div>}
                <div className={c.core ? "text-[15px] font-bold" : "text-[14.5px]"}>{c.title}</div>
                <div className="text-[13px] text-muted-foreground mt-0.5">{c.organization}</div>
              </div>
              <span className="font-mono text-[12px] text-muted-foreground shrink-0">{c.date}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          {education.map((e) => (
            <div key={e.degree} className="border-l-4 pl-4" style={{ borderColor: "hsl(var(--c-violet))" }}>
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
              <span className="font-display text-[22px] font-extrabold" style={{ color: `hsl(var(--c-${["green", "cyan", "violet", "amber"][i % 4]}))` }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[18px] font-semibold group-hover:text-yousaf transition-colors">{s.title}</span>
              <span className="hidden sm:block text-[14px] text-muted-foreground">{s.who}</span>
              <Price usd={s.priceUsd} unit={s.unit} compact className="hidden md:inline-flex" />
              <span className="font-mono text-[12.5px] inline-flex items-center gap-1 text-foreground/70 group-hover:text-yousaf">
                ask <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <section className="rule-t">
        <div className="wrap py-16 sm:py-24">
          <div
            className="relative overflow-hidden rounded-[20px] border border-border px-6 sm:px-14 py-14 sm:py-20"
            style={{
              background:
                "radial-gradient(circle at 0% 0%, hsl(var(--c-green) / 0.22), transparent 45%), radial-gradient(circle at 100% 100%, hsl(var(--c-violet) / 0.22), transparent 50%), hsl(var(--card))",
            }}
          >
          <div className="font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-c-green mb-4">Hiring?</div>
          <h2 className="font-display text-[36px] sm:text-[58px] font-extrabold tracking-[-0.03em] leading-[1.02] max-w-[20ch]">
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
        </div>
      </section>
    </div>
  );
};

export default Home;
