import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Github, Plane, Volume2, VolumeX } from "lucide-react";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experience";
import { certifications } from "@/data/certifications";
import { profile } from "@/data/profile";
import { useOfficeStatus } from "@/hooks/useOfficeStatus";
import SplitFlap, { setFlapSound } from "@/components/home/SplitFlap";
import { cn } from "@/lib/utils";

/**
 * The home page's flight board. Departures = projects (what a hiring manager wants
 * first), Arrivals = career, Connections = certifications. Switching boards makes
 * every cell flip like an old terminal's Solari board. Pick a row to read it in
 * full underneath. Everything comes from src/data, so it stays in sync.
 */
type Tab = "departures" | "arrivals" | "connections";

interface Row {
  id: string;
  code: string;
  name: string;
  detail: string;
  status: string;
  good?: boolean;
  /** blinks: the role I'm in now */
  live?: boolean;
  /** full sentence for screen readers, since the flap cells are decorative */
  label: string;
}

const TABS: { id: Tab; label: string; what: string; head: [string, string, string] }[] = [
  { id: "departures", label: "Departures", what: "Projects I have shipped", head: ["Flight", "Project", "Type"] },
  { id: "arrivals", label: "Arrivals", what: "Where I have worked", head: ["Year", "Company", "Role"] },
  { id: "connections", label: "Connections", what: "Certifications", head: ["Year", "Certificate", "Issuer"] },
];

const SHOW = 8;

/** two-letter flight code: initials, or the capitals of a one-word name (PipelineGuard → PG) */
const initials = (s: string) => {
  const words = s.replace(/[^A-Za-z0-9 -]/g, "").split(/[\s-]+/).filter(Boolean);
  if (words.length > 1) return words.map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const caps = (words[0].match(/[A-Z]/g) || []).join("");
  return (caps.length >= 2 ? caps : words[0]).slice(0, 2).toUpperCase();
};

const ROWS: Record<Tab, Row[]> = {
  departures: projects.map((p, i) => ({
    id: p.id,
    code: `${initials(p.title)} ${String(i + 1).padStart(2, "0")}`,
    name: p.title,
    detail: p.categories.join(" "),
    status: p.demo ? "Live demo" : "On GitHub",
    good: !!p.demo,
    label: `${p.title}, ${p.categories.join(", ")}, ${p.demo ? "live demo" : "open source"}`,
  })),
  arrivals: experiences.map((e) => ({
    id: e.id,
    code: e.start.slice(0, 4),
    name: e.company,
    detail: e.title,
    status: e.end ? "Departed" : "Boarding",
    good: !e.end,
    live: !e.end,
    label: `${e.title} at ${e.company}, ${e.period}${e.end ? "" : ", current role"}`,
  })),
  connections: certifications.map((c) => ({
    id: c.id,
    code: c.date,
    name: c.short,
    detail: c.organization,
    status: c.core ? "Core" : "Earned",
    good: c.core,
    label: `${c.title}, ${c.organization}, ${c.date}`,
  })),
};

/** how many flap cells each column gets, by screen width */
type Size = "sm" | "md" | "lg";
const LEN: Record<Size, { code: number; name: number; detail: number; status: number }> = {
  sm: { code: 0, name: 16, detail: 0, status: 9 },
  md: { code: 5, name: 18, detail: 0, status: 9 },
  lg: { code: 5, name: 22, detail: 20, status: 9 },
};
const sizeNow = (): Size =>
  typeof window === "undefined" ? "lg" : window.innerWidth >= 1024 ? "lg" : window.innerWidth >= 640 ? "md" : "sm";
const useBoardSize = () => {
  const [s, setS] = useState<Size>(sizeNow);
  useEffect(() => {
    const on = () => setS(sizeNow());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return s;
};

const useSecondsClock = (timeZone: string) => {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return t;
};

/** width of n flap cells, so header labels line up with the columns */
const cellsWidth = (n: number) => `calc(${n} * var(--cell-w) + ${Math.max(n - 1, 0)} * var(--cell-gap))`;

const Details = ({ tab, id }: { tab: Tab; id: string }) => {
  if (tab === "departures") {
    const p = projects.find((x) => x.id === id)!;
    return (
      <>
        <div className="label">Project · {p.categories.join(" · ")}</div>
        <h3 className="mt-1 font-display text-[32px] sm:text-[40px] font-bold uppercase leading-none">{p.title}</h3>
        <p className="mt-3 text-[16.5px] leading-relaxed text-foreground/85 max-w-[75ch]">{p.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.tags.slice(0, 8).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn-primary h-11">
              Open the live demo <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn-ghost h-11">
              <Github className="w-4 h-4" /> Code
            </a>
          )}
        </div>
      </>
    );
  }
  if (tab === "arrivals") {
    const e = experiences.find((x) => x.id === id)!;
    return (
      <>
        <div className="label">
          Career · {e.period} · {e.location}
        </div>
        <h3 className="mt-1 font-display text-[32px] sm:text-[40px] font-bold uppercase leading-none">{e.title}</h3>
        <div className="mt-1 text-[18px] font-semibold">{e.company}</div>
        <p className="mt-3 text-[17px] leading-relaxed font-medium max-w-[75ch]">{e.summary}</p>
        <ul className="mt-3 space-y-2 max-w-[80ch]">
          {e.description.slice(0, 3).map((d) => (
            <li key={d} className="relative pl-5 text-[15.5px] leading-relaxed text-foreground/80">
              <span className="absolute left-0 top-0 font-bold text-yousaf">→</span>
              {d}
            </li>
          ))}
        </ul>
        <Link to={`/experience#${e.id}`} className="btn-link mt-4">
          Full release notes <ArrowRight className="w-4 h-4" />
        </Link>
      </>
    );
  }
  const c = certifications.find((x) => x.id === id)!;
  return (
    <>
      <div className="label">Certification · {c.date}</div>
      <h3 className="mt-1 font-display text-[32px] sm:text-[40px] font-bold uppercase leading-none">{c.title}</h3>
      <div className="mt-2 text-[18px] font-semibold">{c.organization}</div>
      <Link to="/experience" className="btn-link mt-4">
        All certifications and education <ArrowRight className="w-4 h-4" />
      </Link>
    </>
  );
};

const DepartureBoard = () => {
  const [tab, setTab] = useState<Tab>("departures");
  const [sel, setSel] = useState<string>(ROWS.departures[0].id);
  const [all, setAll] = useState(false);
  const [sound, setSound] = useState(false);
  const size = useBoardSize();
  const L = LEN[size];
  const clock = useSecondsClock(profile.timezone);
  const { online, back } = useOfficeStatus(profile.timezone);
  const detailRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const meta = TABS.find((t) => t.id === tab)!;
  const rows = ROWS[tab];
  const shown = useMemo(() => (all ? rows : rows.slice(0, SHOW)), [rows, all]);

  useEffect(() => () => setFlapSound(false), []);

  const pickTab = (t: Tab) => {
    setTab(t);
    setSel(ROWS[t][0].id);
    setAll(false);
  };

  const onTabKey = (e: KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === tab);
    const next = e.key === "ArrowRight" ? (i + 1) % TABS.length : e.key === "ArrowLeft" ? (i - 1 + TABS.length) % TABS.length : -1;
    if (next < 0) return;
    e.preventDefault();
    pickTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  const pickRow = (id: string) => {
    setSel(id);
    // on smaller screens the details sit below a long board: bring them into view
    if (window.innerWidth < 1024) {
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 30);
    }
  };

  const toggleSound = () => {
    setFlapSound(!sound);
    setSound(!sound);
  };

  return (
    <div>
      <div className="board flapboard p-4 sm:p-6">
        {/* the sign above the board */}
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="flex items-center gap-4 min-w-0">
            <span className="grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-board-fg text-[hsl(0_0%_7%)] shrink-0">
              <Plane className="w-6 h-6 sm:w-7 sm:h-7 -rotate-45" strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-[40px] sm:text-[64px] font-bold uppercase leading-[0.85] tracking-[0.01em] text-board-fg">
                {meta.label}
              </h2>
              <p className="mt-1.5 font-display text-[15px] sm:text-[17px] font-semibold uppercase tracking-[0.08em] text-board-dim">
                {meta.what} · Dubai DXB
              </p>
            </div>
          </div>
          <div className="flex w-full sm:w-auto items-end justify-between sm:justify-end gap-4 sm:gap-6">
            <div className="sm:text-right font-display uppercase leading-none">
              <div className={cn("flex items-center sm:justify-end gap-1.5 text-[13px] sm:text-[14px] font-semibold tracking-[0.08em]", online ? "text-board-ok" : "text-board-dim")}>
                <span className={cn("w-2 h-2 rounded-full", online ? "bg-board-ok blink" : "bg-board-dim")} />
                {online ? "Online now" : `Offline · back ${back}`}
              </div>
              <div className="mt-1 text-[32px] sm:text-[40px] font-bold text-white tabular-nums" aria-label={`Dubai time ${clock}`}>
                {clock}
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={sound}
              aria-label={sound ? "Turn board sound off" : "Turn board sound on"}
              title={sound ? "Sound on" : "Hear the board"}
              className="mb-1 w-11 h-11 grid place-items-center rounded-xl border border-white/15 text-board-dim hover:text-board-fg hover:border-board-fg/60 transition-colors"
            >
              {sound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 sm:flex sm:flex-wrap gap-1.5 sm:gap-2" role="tablist" aria-label="Board" onKeyDown={onTabKey}>
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => (tabRefs.current[i] = el)}
              id={`board-tab-${t.id}`}
              role="tab"
              aria-selected={tab === t.id}
              aria-controls="board-panel"
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => pickTab(t.id)}
              className={cn(
                "min-h-11 px-2 sm:px-4 rounded-xl font-display text-[15px] sm:text-[19px] font-bold uppercase tracking-[0.03em] sm:tracking-[0.05em] transition-colors",
                tab === t.id ? "bg-board-fg text-[hsl(0_0%_7%)]" : "bg-white/5 text-board-fg hover:bg-white/10"
              )}
            >
              {t.label}
              <span className="hidden sm:inline font-sans text-[13px] font-medium normal-case tracking-normal opacity-75"> · {t.what.replace(" I have shipped", "").replace("Where I have worked", "Career")}</span>
            </button>
          ))}
        </div>

        <div id="board-panel" role="tabpanel" aria-labelledby={`board-tab-${tab}`} className="mt-5 overflow-hidden">
          <div className="flap-size flex gap-[var(--col-gap)] px-2 pb-2">
            {[
              ...(L.code ? [[meta.head[0], L.code] as [string, number]] : []),
              [meta.head[1], L.name],
              ...(L.detail ? [[meta.head[2], L.detail] as [string, number]] : []),
              ["Status", L.status],
            ].map(([h, n]) => (
              <span key={h as string} style={{ width: cellsWidth(n as number) }} className="shrink-0">
                <span className="block font-display text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.12em] text-board-dim">{h}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {shown.map((r, i) => {
              const on = r.id === sel;
              const d = i * 110;
              return (
                <button
                  key={`row-${i}`}
                  type="button"
                  aria-pressed={on}
                  aria-label={r.label}
                  onClick={() => pickRow(r.id)}
                  className={cn(
                    "flap-size flex gap-[var(--col-gap)] items-center w-full text-left px-2 py-1.5 rounded-xl font-display font-semibold transition-colors",
                    on ? "bg-white/[0.08] ring-2 ring-board-fg" : "hover:bg-white/[0.04]"
                  )}
                >
                  {L.code > 0 && <SplitFlap text={r.code} len={L.code} delay={d} className="text-board-fg" />}
                  <SplitFlap text={r.name} len={L.name} delay={d + 40} className="text-white" />
                  {L.detail > 0 && <SplitFlap text={r.detail} len={L.detail} delay={d + 80} className="text-board-fg" />}
                  <span className={cn(r.live && "blink")}>
                    <SplitFlap text={r.status} len={L.status} delay={d + 120} className={r.good ? "text-board-ok" : "text-board-dim"} />
                  </span>
                </button>
              );
            })}
          </div>
          {rows.length > SHOW && (
            <button
              type="button"
              onClick={() => setAll((v) => !v)}
              className="mt-3 w-full min-h-11 rounded-xl border border-dashed border-board-fg/50 font-display text-[16px] font-bold uppercase tracking-[0.06em] text-board-fg hover:bg-board-fg/10"
            >
              {all ? "Show fewer" : `Show all ${rows.length} ${meta.label.toLowerCase()}`}
            </button>
          )}
        </div>
      </div>

      <div ref={detailRef} className="mt-5 panel p-5 sm:p-7 scroll-mt-28" aria-live="polite">
        <Details tab={tab} id={sel} />
      </div>
    </div>
  );
};

export default DepartureBoard;
