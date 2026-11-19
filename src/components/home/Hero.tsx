import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, FileDown } from "lucide-react";
import { profile, yearsOfExperience } from "@/data/profile";
import { experiences } from "@/data/experience";
import { certifications } from "@/data/certifications";
import DepartureBoard from "@/components/home/DepartureBoard";
import { useOfficeStatus } from "@/hooks/useOfficeStatus";
import { cn } from "@/lib/utils";

const coreCerts = certifications.filter((c) => c.core && c.id !== "genai").map((c) => c.short);

/** the recruiter view, as a boarding pass: everything needed to decide "call or not" */
const QuickRead = () => {
  const [copied, setCopied] = useState(false);
  const years = yearsOfExperience();

  const rows: [string, React.ReactNode][] = [
    ["Role", "Senior DevOps / DevSecOps & Platform Engineer"],
    ["Experience", `${years}+ years · since Oct 2018`],
    ["Current", `${experiences[0].title}, ${experiences[0].company}`],
    ["Based in", `Dubai, UAE · ${profile.residency}`],
    ["Certified", coreCerts.join(" · ")],
    ["Domain", profile.domains.join(" · ")],
    ["Open to", profile.openTo.join(" · ")],
  ];

  const asText = () =>
    [
      `${profile.name} — ${profile.role}`,
      ...rows.slice(1).map(([k, v]) => `${k}: ${typeof v === "string" ? v : ""}`),
      `Email: ${profile.email}`,
      `Phone: ${profile.phone}`,
      `LinkedIn: ${profile.linkedin}`,
      `Portfolio: https://yousafkhamza.github.io`,
    ].join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(asText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  return (
    <aside className="panel overflow-hidden" aria-label="Profile summary">
      <div className="flex items-center justify-between gap-3 px-5 h-12 bg-board text-board-fg">
        <span className="font-display text-[17px] font-bold uppercase tracking-[0.08em]">Boarding pass</span>
        <span className="flex items-center gap-1.5 font-display text-[15px] font-bold uppercase tracking-[0.06em] text-board-ok">
          <span className="w-2 h-2 rounded-full bg-board-ok" /> Available
        </span>
      </div>
      <div className="px-5 pt-4 pb-1 border-b-2 border-dashed border-border">
        <div className="label">Passenger</div>
        <div className="font-display text-[26px] font-bold uppercase leading-tight">{profile.name}</div>
      </div>
      <dl className="px-5 py-4 grid grid-cols-[96px_1fr] gap-x-4 gap-y-2.5 text-[15px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="label pt-[2px]">{k}</dt>
            <dd className="leading-snug font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex border-t-2 border-foreground/85">
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener"
          className="flex-1 inline-flex items-center justify-center gap-2 h-12 text-[15px] font-semibold bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-strong))] transition-colors"
        >
          <FileDown className="w-4 h-4" /> Resume PDF
        </a>
        <button
          onClick={copy}
          className="flex-1 inline-flex items-center justify-center gap-2 h-12 text-[15px] font-semibold border-l-2 border-foreground/85 hover:bg-secondary transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-ok" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy summary"}
        </button>
      </div>
    </aside>
  );
};

/** live pill: online during Dubai office hours, otherwise when I'm back */
const LivePill = () => {
  const { online, back } = useOfficeStatus(profile.timezone);
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 font-display text-[15px] font-bold uppercase tracking-[0.05em] rounded-[3px]",
        online ? "bg-board text-board-ok" : "bg-board text-board-dim"
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", online ? "bg-board-ok blink" : "bg-board-dim")} />
      {online ? "Online now · Dubai, UAE" : `Offline · back ${back} · Dubai, UAE`}
    </div>
  );
};

const Hero = () => (
  <div className="relative">
    <div className="wrap relative pt-10 sm:pt-14 pb-14 sm:pb-20">
      <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-14 items-start">
        <div>
          <LivePill />
          <h1 className="mt-6 font-display text-[17px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            {profile.name} <span className="text-foreground">/</span> Senior DevOps &amp; Platform Engineer
          </h1>
          <p className="mt-3 font-display text-[64px] sm:text-[92px] lg:text-[108px] font-bold uppercase tracking-[-0.01em] leading-[0.86] text-foreground">
            I keep production{" "}
            <span className="relative inline-block px-2 -mx-1 bg-sign text-[hsl(0_0%_7%)]">boring</span>.
          </p>
          <p className="mt-8 text-[19px] sm:text-[20px] leading-relaxed text-muted-foreground max-w-[54ch]">
            {yearsOfExperience()}+ years running <span className="text-foreground font-semibold">AWS</span> and{" "}
            <span className="text-foreground font-semibold">Kubernetes</span> platforms for fintech and regulated
            enterprises. I move workloads to EKS, automate infrastructure with Terraform and GitOps, and build security
            checks into the pipeline.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/projects" className="btn-primary">
              See the work <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-ghost">
              Get in touch
            </Link>
          </div>
          <div className="mt-10">
            <div className="label mb-3">Where I have worked</div>
            <div className="flex flex-wrap gap-2">
              {experiences.map((e) => (
                <span
                  key={e.id}
                  className="inline-flex items-center gap-2 border-2 border-foreground/85 bg-card px-3 py-1 font-display text-[17px] font-bold uppercase tracking-[0.03em] rounded-[3px]"
                >
                  {!e.end && <span className="w-2 h-2 rounded-full bg-ok" aria-label="current" />}
                  {e.company.replace(" UAE", "").replace(" IS", "")}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:pt-2">
          <QuickRead />
        </div>
      </div>

      <div className="mt-12 sm:mt-16">
        <DepartureBoard />
      </div>
    </div>
  </div>
);
export default Hero;
