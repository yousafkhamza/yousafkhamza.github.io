import { useMemo, useState, KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { experiences } from "@/data/experience";
import { cn } from "@/lib/utils";
import Pass, { PassField } from "@/components/Pass";

const toMonths = (iso: string) => {
  const [y, m] = iso.split("-").map(Number);
  return y * 12 + (m - 1);
};
const nowIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

/**
 * Career as a release history: one segment per role on a real time axis.
 * Click (or arrow-key through) a release to read its notes.
 */
const ReleaseHistory = () => {
  const chronological = useMemo(() => [...experiences].reverse(), []);
  const [active, setActive] = useState(experiences[0].id);

  const start = toMonths(chronological[0].start);
  const end = toMonths(nowIso()) + 1;
  const span = end - start;
  const firstYear = Math.ceil(start / 12);
  const lastYear = Math.floor(end / 12);
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i);

  const current = experiences.find((e) => e.id === active)!;
  const idx = chronological.findIndex((e) => e.id === active);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" && idx < chronological.length - 1) setActive(chronological[idx + 1].id);
    if (e.key === "ArrowLeft" && idx > 0) setActive(chronological[idx - 1].id);
  };

  return (
    <div>
      {/* the track */}
      <div className="relative" role="tablist" aria-label="Career releases" onKeyDown={onKey}>
        <div className="relative h-14 sm:h-16 rounded-[var(--radius)] bg-board overflow-hidden">
          {chronological.map((e) => {
            const s = toMonths(e.start) - start;
            const len = (e.end ? toMonths(e.end) : end) - toMonths(e.start);
            const on = e.id === active;
            return (
              <button
                key={e.id}
                role="tab"
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(e.id)}
                className="absolute top-0 bottom-0 border-r-2 last:border-r-0 border-[hsl(0_0%_0%)] text-left px-2 sm:px-3 transition-all group"
                style={{
                  left: `${(s / span) * 100}%`,
                  width: `${(len / span) * 100}%`,
                  background: on ? "hsl(var(--sign))" : "hsl(var(--flap))",
                  color: on ? "hsl(0 0% 7%)" : "hsl(var(--board-fg))",
                }}
              >
                <span className="block font-mono text-[13px] sm:text-[14px] opacity-80">
                  {e.version}
                  {!e.end && (
                    <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full align-middle animate-pulse bg-current" />
                  )}
                </span>
                <span className="hidden sm:block font-display text-[18px] font-bold uppercase tracking-[0.03em] truncate">
                  {e.company.replace(" UAE", "").replace(" IS", "")}
                </span>
              </button>
            );
          })}
        </div>
        {/* year ticks */}
        <div className="relative h-6 mt-1.5">
          {years.map((y) => {
            const left = ((y * 12 - start) / span) * 100;
            if (left < 0 || left > 100) return null;
            return (
              <span
                key={y}
                className="absolute -translate-x-1/2 font-mono text-[13px] text-muted-foreground"
                style={{ left: `${left}%` }}
              >
                <span className="block w-px h-1.5 bg-border mx-auto mb-0.5" />
                <span className={cn(y % 2 === 1 && "hidden sm:inline")}>{y}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* release notes for the selected role, printed as a boarding pass */}
      <div key={current.id} className="mt-8 animate-fade-in" role="tabpanel">
        <Pass
          as="div"
          row="md"
          stubFirst
          stubWidth="280px"
          label={`Release ${current.version} · ${current.end ? "Departed" : "Now boarding"}`}
          code={current.location}
          stub={
            <div className="p-6 grid grid-cols-2 md:grid-cols-1 gap-4 content-start">
              <div className="col-span-2 md:col-span-1">
                <h3 className="font-display text-[26px] font-bold uppercase leading-[1.02]">{current.title}</h3>
                <div className="mt-1 text-[16px] font-semibold text-yousaf">{current.company}</div>
              </div>
              <PassField k="From" v={current.period.split(" – ")[0]} />
              <PassField k="To" v={current.end ? current.period.split(" – ")[1] : "Present"} />
              <div className="col-span-2 md:col-span-1 flex flex-wrap gap-1.5">
                {current.stack.map((s) => (
                  <span key={s} className="tag bg-card">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          }
          main={
            <div className="p-6 sm:p-8">
              <p className="text-[17px] leading-relaxed font-medium">{current.summary}</p>
              <ul className="mt-4 space-y-2.5">
                {current.description.slice(0, 3).map((d) => (
                  <li key={d} className="relative pl-5 text-[15.5px] leading-relaxed text-foreground/80">
                    <span className="absolute left-0 top-0 font-bold text-yousaf">→</span>
                    {d}
                  </li>
                ))}
              </ul>
              <Link to={`/experience#${current.id}`} className="btn-link mt-5">
                Full release notes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ReleaseHistory;
