import { ArrowLeftRight, ShieldCheck, TrendingDown, Sparkles } from "lucide-react";

/** four proof points a hiring manager can scan in five seconds */
const ITEMS = [
  {
    icon: ArrowLeftRight,
    color: "cyan",
    title: "Migrations without drama",
    body: "30+ apps moved from ECS to EKS with Helm and Argo CD, deployment effort down 60%.",
  },
  {
    icon: ShieldCheck,
    color: "violet",
    title: "Audits that pass",
    body: "PCI DSS, SOC 2 and ISO 27001 checks run in every pipeline, so audits stop being a scramble.",
  },
  {
    icon: TrendingDown,
    color: "amber",
    title: "Bills that go down",
    body: "25% off the monthly AWS bill with rightsizing and Karpenter, with no hit to SLAs.",
  },
  {
    icon: Sparkles,
    color: "pink",
    title: "AI for incidents and code review",
    body: "Agents that diagnose broken pods, RAG over internal docs, and AI code review in CI.",
  },
];

const WhyStrip = () => (
  <section className="rule-t" aria-label="Why teams hire me">
    <div className="wrap py-10 sm:py-14">
      <div className="eyebrow">Why teams bring me in</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ITEMS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="panel p-5 sm:p-6">
            <span className="inline-grid place-items-center w-10 h-10 rounded-xl bg-sign/25 text-foreground dark:bg-sign/10 dark:text-[hsl(48_100%_70%)]">
              <Icon className="w-5 h-5" />
            </span>
            <div className="mt-4 font-display text-[22px] font-bold leading-[1.1]">{title}</div>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyStrip;
