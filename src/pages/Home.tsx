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
import { profile, services } from "@/data/profile";
import Price from "@/components/Price";
import Pass from "@/components/Pass";
import { CertPasses, QualificationPasses } from "@/components/Credentials";
import RunwayGame from "@/components/home/RunwayGame";

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
      className="btn-ghost px-4 text-[15px]"
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
        <div className="grid md:grid-cols-2 gap-5">
          {services.map((s, i) => (
            <Pass
              key={s.id}
              tone="sign"
              row="lg"
              stubWidth="210px"
              className="transition-transform hover:-translate-y-1"
              label={`Office hours · ${String(i + 1).padStart(2, "0")}`}
              code={s.format}
              main={
                <div className="p-5 sm:p-6">
                  <h3 className="font-display text-[26px] font-bold leading-[1.05]">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.who}</p>
                </div>
              }
              stub={
                <div className="p-5 sm:p-6 h-full flex lg:flex-col items-end lg:items-start justify-between gap-4">
                  <div>
                    <div className="label mb-1">Fare</div>
                    <Price usd={s.priceUsd} unit={s.unit} />
                  </div>
                  <Link to={`/contact?topic=${s.id}`} className="btn-ghost h-10 px-4 text-[15px]">
                    Ask <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              }
            />
          ))}
        </div>
      </Section>

      <Section id="stack" color="amber" label="Stack" title="What I work with" intro="The highlighted tools are what I run in production today. The rest I have shipped with before.">
        <StackView />
      </Section>

      <Section id="credentials" color="cyan" label="Credentials" title="Certified and qualified">
        <CertPasses />
        <div className="mt-8">
          <QualificationPasses />
        </div>
      </Section>

      <section className="rule-t">
        <div className="wrap py-16 sm:py-24">
          <Pass
            as="div"
            tone="sign"
            row="lg"
            stubWidth="min(42%, 480px)"
            label="Now boarding · Hiring?"
            code="Gate A1 · Dubai"
            main={
              <div className="px-6 sm:px-10 py-10 sm:py-14">
                <h2 className="font-display text-[42px] sm:text-[64px] font-bold tracking-[-0.02em] leading-[0.95] max-w-[16ch]">
                  Looking for someone to own your platform?
                </h2>
                <p className="lede mt-5">
                  Open to senior DevOps, platform engineering and SRE roles. The fastest way to reach me is
                  email or LinkedIn.
                </p>
                <div className="mt-9 grid grid-cols-1 sm:grid-cols-[1fr_auto] xl:flex xl:flex-wrap gap-3">
                  <Link to="/contact?topic=hiring" className="btn-primary px-4 sm:col-span-2">
                    Start a conversation <ArrowRight className="w-4 h-4" />
                  </Link>
                  <CopyEmail />
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost px-4">
                    LinkedIn
                  </a>
                </div>
              </div>
            }
            stub={<RunwayGame />}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
