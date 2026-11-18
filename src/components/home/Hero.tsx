import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, FileDown } from "lucide-react";
import { profile, yearsOfExperience } from "@/data/profile";
import { experiences } from "@/data/experience";
import { certifications } from "@/data/certifications";
import PodField from "@/components/home/PodField";

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
    <aside className="panel overflow-hidden" aria-label="Profile summary">
      <div className="flex items-center justify-between px-5 h-11 border-b border-border">
        <span className="font-mono text-[12px] text-muted-foreground">
          <span className="text-c-green">$</span> <span className="text-c-cyan">describe</span> engineer yousaf
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11.5px] text-c-green bg-c-green/10 px-2 py-0.5 rounded-full">
          <span className="dot" /> Available
        </span>
      </div>
      <dl className="px-5 py-4 grid grid-cols-[96px_1fr] gap-x-4 gap-y-2.5 text-[14px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-mono text-[12px] text-c-violet pt-[2px]">{k}</dt>
            <dd className="leading-snug">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="flex border-t border-border">
        <a
          href={profile.resume}
          target="_blank"
          rel="noopener"
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 text-[14px] font-semibold text-c-green hover:bg-c-green/10 transition-colors"
        >
          <FileDown className="w-4 h-4" /> Resume PDF
        </a>
        <button
          onClick={copy}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 text-[14px] font-semibold border-l border-border text-c-cyan hover:bg-c-cyan/10 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-ok" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy summary"}
        </button>
      </div>
    </aside>
  );
};

const Squiggle = () => (
  <svg className="absolute left-0 right-0 -bottom-3 sm:-bottom-4 w-full h-4 sm:h-5" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden>
    <path
      d="M2 14 C 25 4, 45 4, 66 12 S 108 20, 130 10 S 172 2, 198 10"
      fill="none"
      stroke="hsl(var(--c-amber))"
      strokeWidth="5"
      strokeLinecap="round"
      className="[stroke-dasharray:260] [stroke-dashoffset:260] animate-[draw_1.2s_ease-out_.4s_forwards]"
    />
  </svg>
);

const Hero = () => (
  <div className="relative overflow-hidden">
    {/* backdrop: dot grid and two soft signal-colour lights */}
    <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden />
    <div className="absolute -top-48 -left-40 w-[640px] h-[640px] rounded-full" style={{ background: "radial-gradient(closest-side, hsl(var(--c-green) / var(--glow)), transparent)" }} aria-hidden />
    <div className="absolute top-0 -right-48 w-[700px] h-[700px] rounded-full" style={{ background: "radial-gradient(closest-side, hsl(var(--c-violet) / var(--glow)), transparent)" }} aria-hidden />

    <div className="wrap relative pt-12 sm:pt-16 pb-16 sm:pb-24">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-14 items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-c-green/40 bg-c-green/10 px-3 py-1.5 font-mono text-[12px] text-c-green">
            <span className="dot" /> Fintech &amp; payments since 2018
          </div>
          <h1 className="mt-6 font-mono text-[13px] text-muted-foreground">
            {profile.name} <span className="text-c-violet">/</span> Senior DevOps &amp; Platform Engineer, Dubai
          </h1>
          <p className="mt-4 font-display text-[50px] sm:text-[72px] lg:text-[84px] font-extrabold tracking-[-0.035em] leading-[0.95] text-foreground">
            I keep production{" "}
            <span className="relative inline-block text-c-green">
              boring
              <Squiggle />
            </span>
            .
          </p>
          <p className="mt-8 text-[18px] sm:text-[19px] leading-relaxed text-muted-foreground max-w-[54ch]">
            {yearsOfExperience()}+ years running <span className="text-foreground font-semibold">AWS</span> and{" "}
            <span className="text-foreground font-semibold">Kubernetes</span> platforms for fintech and regulated
            enterprises. I move workloads to EKS, automate infrastructure with Terraform and GitOps, and build security
            checks into the pipeline.
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
            <div className="flex flex-wrap gap-2">
              {experiences.map((e) => (
                <span
                  key={e.id}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[14px] font-semibold"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: `hsl(var(--c-${e.color}))` }} />
                  {e.company.replace(" UAE", "").replace(" IS", "")}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-5 lg:pt-4">
          <PodField />
          <QuickRead />
        </div>
      </div>
    </div>
  </div>
);
export default Hero;
