import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, FileDown } from "lucide-react";
import { profile, yearsOfExperience } from "@/data/profile";
import { experiences } from "@/data/experience";
import { certifications } from "@/data/certifications";

const coreCerts = certifications.filter((c) => c.core && c.id !== "genai").map((c) => c.short);

/** the recruiter view: everything needed to decide "call or not" in one block */
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
    <aside className="panel shadow-[0_1px_0_hsl(var(--border)),0_18px_40px_-28px_hsl(var(--foreground)/0.35)]" aria-label="Profile summary">
      <div className="flex items-center justify-between px-5 h-11 border-b border-border">
        <span className="font-mono text-[12px] text-muted-foreground">
          <span className="text-yousaf">$</span> describe engineer yousaf
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11.5px] text-ok">
          <span className="dot" /> Available
        </span>
      </div>
      <dl className="px-5 py-4 grid grid-cols-[96px_1fr] gap-x-4 gap-y-2.5 text-[14px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-mono text-[12px] text-muted-foreground pt-[2px]">{k}</dt>
            <dd className="leading-snug">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex border-t border-border">
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener"
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 text-[14px] font-medium hover:bg-secondary transition-colors"
        >
          <FileDown className="w-4 h-4" /> Resume PDF
        </a>
        <button
          onClick={copy}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 text-[14px] font-medium border-l border-border hover:bg-secondary transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-ok" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy summary"}
        </button>
      </div>
    </aside>
  );
};

const Hero = () => {
  const companies = [...experiences].map((e) => e.company.replace(" UAE", "").replace(" IS", ""));
  return (
    <div className="wrap pt-12 sm:pt-20 pb-16 sm:pb-24">
      <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-14 items-start">
        <div>
          <h1 className="font-mono text-[13px] text-muted-foreground mb-6">
            {profile.name} <span className="text-border">/</span> Senior DevOps &amp; Platform Engineer, Dubai
          </h1>
          <p className="text-[44px] sm:text-[64px] lg:text-[72px] font-semibold tracking-[-0.035em] leading-[0.98] text-foreground">
            I keep production
            <br />
            <span className="hl">boring.</span>
          </p>
          <p className="mt-7 text-[18px] sm:text-[19px] leading-relaxed text-muted-foreground max-w-[54ch]">
            {yearsOfExperience()}+ years running AWS and Kubernetes platforms for fintech and regulated
            enterprises. I migrate workloads without drama, automate the infrastructure with Terraform and
            GitOps, and build the security controls into the pipeline instead of bolting them on for the audit.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/projects" className="btn-primary">
              See the work <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-ghost">
              Get in touch
            </Link>
          </div>
          <div className="mt-12">
            <div className="label mb-3">Where I have worked</div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium text-foreground/80">
              {companies.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
        </div>
        <QuickRead />
      </div>
    </div>
  );
};

export default Hero;
