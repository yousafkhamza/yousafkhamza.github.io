import { Github, ArrowUpRight, GitFork, Star, PenSquare } from "lucide-react";

const MediumIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 0v24h24V0H0zm19.938 5.686L18.651 6.9a.557.557 0 0 0-.214.534v13.469a.557.557 0 0 0 .214.534l1.257 1.214v.267h-6.324v-.267l1.302-1.264c.128-.128.128-.165.128-.359V9.854l-3.615 9.195h-.488L6.018 9.854v9.154c-.035.271.053.551.247.748l1.695 2.054v.267H2.01v-.267l1.695-2.054a.872.872 0 0 0 .232-.748V8.304a.644.644 0 0 0-.209-.536L2.597 5.686V5.42h5.668l4.394 9.637 3.858-9.637h5.4v.266z" />
  </svg>
);

const links = [
  {
    href: "https://github.com/yousafkhamza",
    icon: Github,
    label: "GitHub",
    heading: "More than these three repos",
    description:
      "Experiments, half-finished ideas, PRs to other projects, and the commit history behind everything shown here.",
    meta: [
      { icon: GitFork, text: "Public repos" },
      { icon: Star, text: "Contribution graph" },
    ],
  },
  {
    href: "https://medium.com/@yousaf.k.hamza",
    icon: MediumIcon,
    label: "Medium",
    heading: "The write-ups behind the code",
    description:
      "Postmortems, tool breakdowns, and notes from production incidents — the reasoning that doesn't fit in a README.",
    meta: [
      { icon: PenSquare, text: "Articles & postmortems" },
    ],
  },
];

const ExploreMore = () => {
  return (
    <div>
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <span className="eyebrow">Keep Going</span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Explore more of the work
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {links.map(({ href, icon: Icon, label, heading, description, meta }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 flex flex-col hover:border-yousaf/40 transition-colors"
          >
            <div
              className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-yousaf/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              aria-hidden
            />

            <div className="flex items-start justify-between mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-yousaf/10 text-yousaf group-hover:bg-yousaf group-hover:text-white transition-colors shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-yousaf group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-yousaf mb-2">
              {label}
            </span>
            <h3 className="font-bold text-lg text-foreground mb-2">{heading}</h3>
            <p className="text-sm text-foreground/70 leading-relaxed flex-1">{description}</p>

            <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border/50">
              {meta.map(({ icon: MetaIcon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground"
                >
                  <MetaIcon className="w-3.5 h-3.5" />
                  {text}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ExploreMore;
