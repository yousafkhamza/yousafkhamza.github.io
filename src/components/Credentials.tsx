import { certifications } from "@/data/certifications";
import { education } from "@/data/education";

const certs = certifications.filter((c) => c.kind !== "recognition");
// newest recognition first
const recognitions = certifications.filter((c) => c.kind === "recognition").sort((a, b) => Number(b.date) - Number(a.date));

const Logo = ({ src, size = "w-11 h-11" }: { src: string; size?: string }) => (
  <img src={src} alt="" loading="lazy" className={`${size} shrink-0 rounded-lg object-contain bg-white border border-border p-1`} />
);

/** certifications: the core ones a recruiter filters on are marked, everything else is listed plainly */
export const CertPasses = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {certs.map((c) => (
      <div key={c.id} className="panel p-5 flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <Logo src={c.logo} size="w-10 h-10" />
          <div className="flex items-center gap-2">
            {c.core && <span className="tag bg-sign/30 border-sign/60 text-foreground dark:bg-sign/15 dark:text-[hsl(48_100%_70%)]">Core</span>}
            <span className="text-[14px] font-semibold text-muted-foreground tabular-nums">{c.date}</span>
          </div>
        </div>
        <div className={c.core ? "mt-4 text-[16px] font-bold leading-snug" : "mt-4 text-[15.5px] font-semibold leading-snug"}>{c.title}</div>
        <div className="text-[14px] text-muted-foreground mt-1">{c.organization}</div>
      </div>
    ))}
  </div>
);

const QualCard = ({ logo, kicker, title, sub, right }: { logo: string; kicker: string; title: string; sub: string; right: string }) => (
  <div className="panel p-5 sm:p-6 flex items-start gap-4">
    <Logo src={logo} size="w-12 h-12" />
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-3">
        <span className="label">{kicker}</span>
        <span className="text-[14px] font-semibold text-muted-foreground tabular-nums">{right}</span>
      </div>
      <div className="mt-1 font-display text-[22px] font-bold leading-tight">{title}</div>
      <div className="text-[15px] text-muted-foreground mt-1">{sub}</div>
    </div>
  </div>
);

/** degrees and the bodies that recognise them, one 2x2 grid so the rows line up */
export const QualificationPasses = () => (
  <div className="grid md:grid-cols-2 gap-4">
    {education.map((e) => (
      <QualCard key={e.degree} logo={e.logo} kicker="Education" title={e.degree} sub={e.school} right={e.period.replace(" - ", "–")} />
    ))}
    {recognitions.map((c) => (
      <QualCard key={c.id} logo={c.logo} kicker="Degree recognition · verified" title={c.title} sub={c.organization} right={c.date} />
    ))}
  </div>
);
