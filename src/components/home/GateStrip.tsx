import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";

/**
 * Different people come here for different things. One row, four gates,
 * two links each: the shortest path for whoever is reading.
 */
type Go = { label: string; to: string; external?: boolean };

const GATES: { gate: string; who: string; title: string; body: string; go: [Go, Go] }[] = [
  {
    gate: "A1",
    who: "Recruiters & HR",
    title: "Hiring for a DevOps role",
    body: "For HR, talent teams and headhunters: the resume, every role with dates and results, and how to reach me.",
    go: [
      { label: "Resume PDF", to: profile.resume, external: true },
      { label: "Experience", to: "/experience" },
    ],
  },
  {
    gate: "B2",
    who: "Engineers",
    title: "Want to see the work",
    body: "For DevOps and software engineers: open-source tools with live demos and code, and the stack I run.",
    go: [
      { label: "Projects", to: "/projects" },
      { label: "GitHub", to: profile.github, external: true },
    ],
  },
  {
    gate: "C3",
    who: "New to DevOps",
    title: "Learning the job",
    body: "1:1 guidance, resume reviews and mock interviews, and four games to practise on.",
    go: [
      { label: "Office hours", to: "/services" },
      { label: "Play", to: "/play" },
    ],
  },
  {
    gate: "D4",
    who: "Startups & teams",
    title: "Help with your cloud",
    body: "An infrastructure review for teams on AWS or Kubernetes: cost, security and reliability fixes you can act on.",
    go: [
      { label: "Infrastructure review", to: "/services#infra" },
      { label: "Contact", to: "/contact?topic=infra" },
    ],
  },
];

const GoLink = ({ g, primary }: { g: Go; primary?: boolean }) => {
  const cls = primary ? "btn-primary h-10 px-4 text-[15px]" : "btn-link text-[15px]";
  return g.external ? (
    <a href={g.to} target="_blank" rel="noopener noreferrer" className={cls}>
      {g.label} <ArrowUpRight className="w-4 h-4" />
    </a>
  ) : (
    <Link to={g.to} className={cls}>
      {g.label} <ArrowRight className="w-4 h-4" />
    </Link>
  );
};

const GateStrip = () => (
  <section className="rule-t" aria-labelledby="gates-title">
    <div className="wrap py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <div className="eyebrow">Find your gate</div>
          <h2 id="gates-title" className="font-display text-[30px] sm:text-[36px] font-bold leading-[1.05]">
            What brings you here?
          </h2>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GATES.map((g) => (
          <div key={g.gate} className="panel p-5 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <span className="label">{g.who}</span>
              <span className="shrink-0 inline-grid place-items-center h-7 px-2 rounded-md bg-strip text-strip-fg font-display text-[14px] font-bold tracking-[0.04em]">
                {g.gate}
              </span>
            </div>
            <h3 className="mt-3 font-display text-[23px] font-bold leading-[1.1] whitespace-nowrap overflow-hidden text-ellipsis">{g.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{g.body}</p>
            <div className="mt-auto pt-5 flex flex-col items-start gap-3">
              <GoLink g={g.go[0]} primary />
              <GoLink g={g.go[1]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default GateStrip;
