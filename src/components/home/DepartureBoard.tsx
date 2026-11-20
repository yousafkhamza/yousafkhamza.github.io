import { CSSProperties, KeyboardEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Github, Plane, Volume2, VolumeX } from "lucide-react";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experience";
import { certifications } from "@/data/certifications";
import { profile } from "@/data/profile";
import { useOfficeStatus } from "@/hooks/useOfficeStatus";
import SplitFlap, { armFlapSound, getFlapSound, setFlapSound } from "@/components/home/SplitFlap";
import Pass, { PassField } from "@/components/Pass";
import { cn } from "@/lib/utils";
import { flightCode } from "@/lib/flight";
import { placeName, sameClockAsHome } from "@/lib/visitor";
import { useVisitor } from "@/hooks/useVisitor";

/**
 * The home page's flight board. Departures = career (where I flew from, newest
 * first), Arrivals = projects (what landed), Connections = certifications.
 * Switching boards makes every cell flip like an old terminal's Solari board.
 * Pick a row and its boarding pass prints underneath. All data from src/data.
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

const TABS: { id: Tab; label: string; short: string; what: string; head: [string, string, string] }[] = [
  { id: "departures", label: "Departures", short: "Career", what: "Career · where I have worked", head: ["Year", "Company", "Role"] },
  { id: "arrivals", label: "Arrivals", short: "Projects", what: "Projects · what I have built", head: ["Flight", "Project", "Type"] },
  { id: "connections", label: "Connections", short: "Certifications", what: "Certifications · what I have earned", head: ["Year", "Certificate", "Issuer"] },
];

const SHOW = 8;

const ROWS: Record<Tab, Row[]> = {
  departures: experiences.map((e) => ({
    id: e.id,
    code: e.start.slice(0, 4),
    name: e.company,
    detail: e.title,
    status: e.end ? "Departed" : "Boarding",
    good: !e.end,
    live: !e.end,
    label: `${e.title} at ${e.company}, ${e.period}${e.end ? "" : ", current role"}`,
  })),
  arrivals: projects.map((p, i) => ({
    id: p.id,
    code: `${flightCode(p.title)} ${String(i + 1).padStart(2, "0")}`,
    name: p.title,
    detail: p.categories.join(" "),
    status: p.demo ? "Live" : "GitHub",
    good: !!p.demo,
    label: `${p.title}, ${p.categories.join(", ")}, ${p.demo ? "live demo" : "open source"}`,
  })),
  connections: certifications.map((c) => ({
    id: c.id,
    code: c.date,
    name: c.short,
    detail: c.organization,
    status: c.kind === "recognition" ? "Verified" : c.core ? "Core" : "Earned",
    good: c.core || c.kind === "recognition",
    label: `${c.title}, ${c.organization}, ${c.date}`,
  })),
};

/** how many flap cells each column gets, by screen width; cell size is then fitted to fill the row */
type Size = "sm" | "md" | "lg";
const LEN: Record<Size, { code: number; name: number; detail: number; status: number }> = {
  sm: { code: 0, name: 16, detail: 0, status: 8 },
  md: { code: 5, name: 18, detail: 0, status: 8 },
  lg: { code: 5, name: 22, detail: 20, status: 8 },
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

/** the boarding pass printed for the selected row */
const Details = ({ tab, id, row }: { tab: Tab; id: string; row: Row }) => {
  if (tab === "arrivals") {
    const p = projects.find((x) => x.id === id)!;
    return (
      <Pass
        as="div"
        row="lg"
        stubWidth="300px"
        label={`Arrivals · ${p.categories.join(" · ")}`}
        code={`Flight ${row.code}`}
        main={
          <div className="p-5 sm:p-7">
            <h2 className="font-display text-[32px] sm:text-[38px] font-bold leading-[1.02]">{p.title}</h2>
            <p className="mt-3 text-[16.5px] leading-relaxed text-foreground/85 max-w-[75ch]">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.slice(0, 8).map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        }
        stub={
          <div className="p-5 sm:p-6 grid grid-cols-2 lg:grid-cols-1 gap-4 content-start">
            <PassField k="Flight" v={row.code} />
            <PassField k="Status" v={p.demo ? "Live demo" : "Open source"} />
            <div className="col-span-2 lg:col-span-1 flex flex-wrap gap-2 pt-1">
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn-primary h-11 flex-1">
                  Live demo <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
              {p.github && (
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn-ghost h-11 flex-1">
                  <Github className="w-4 h-4" /> Code
                </a>
              )}
            </div>
          </div>
        }
      />
    );
  }
  if (tab === "departures") {
    const e = experiences.find((x) => x.id === id)!;
    return (
      <Pass
        as="div"
        row="lg"
        stubWidth="300px"
        label={`Departures · ${e.version}`}
        code={e.end ? "Departed" : "Now boarding"}
        main={
          <div className="p-5 sm:p-7">
            <h2 className="font-display text-[32px] sm:text-[38px] font-bold leading-[1.02]">{e.title}</h2>
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
          </div>
        }
        stub={
          <div className="p-5 sm:p-6 grid grid-cols-2 lg:grid-cols-1 gap-4 content-start">
            <PassField k="From" v={e.period.split(" – ")[0]} />
            <PassField k="To" v={e.end ? e.period.split(" – ")[1] : "Present"} />
            <PassField k="Gate" v={e.location} className="col-span-2 lg:col-span-1" />
            <Link to={`/experience#${e.id}`} className="btn-ghost h-11 col-span-2 lg:col-span-1">
              Full release notes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        }
      />
    );
  }
  const c = certifications.find((x) => x.id === id)!;
  return (
    <Pass
      as="div"
      row="lg"
      stubWidth="300px"
      label="Connections · Certification"
      code={c.core ? "Core" : "Earned"}
      main={
        <div className="p-5 sm:p-7">
          <h2 className="font-display text-[32px] sm:text-[38px] font-bold leading-[1.02]">{c.title}</h2>
          <div className="mt-2 text-[18px] font-semibold">{c.organization}</div>
        </div>
      }
      stub={
        <div className="p-5 sm:p-6 grid grid-cols-2 lg:grid-cols-1 gap-4 content-start">
          <PassField k="Issued" v={c.date} />
          <PassField k="Code" v={c.short} />
          <Link to="/experience" className="btn-ghost h-11 col-span-2 lg:col-span-1">
            All certifications <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      }
    />
  );
};

const DepartureBoard = () => {
  const [tab, setTab] = useState<Tab>("departures");
  const [sel, setSel] = useState<string>(ROWS.departures[0].id);
  const [all, setAll] = useState(false);
  const [sound, setSound] = useState(getFlapSound);
  const size = useBoardSize();
  const L = LEN[size];
  const clock = useSecondsClock(profile.timezone);
  const office = useOfficeStatus(profile.timezone);
  // the visitor's own clock, only when it reads differently from Dubai
  const visitor = useVisitor();
  const vtz = sameClockAsHome(visitor.tz) ? null : visitor.tz;
  const localClockFull = useSecondsClock(vtz ?? profile.timezone);
  const panelRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [fitVars, setFitVars] = useState<CSSProperties>({});

  const meta = TABS.find((t) => t.id === tab)!;
  const rows = ROWS[tab];
  const shown = useMemo(() => (all ? rows : rows.slice(0, SHOW)), [rows, all]);
  const selRow = rows.find((r) => r.id === sel) ?? rows[0];

  useEffect(() => armFlapSound(), []);

  // size the flap cells so every row runs exactly edge to edge of the board
  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const calc = () => {
      const W = el.clientWidth - 16; // the row's own padding
      const cols = [L.code, L.name, L.detail, L.status].filter(Boolean);
      const n = cols.reduce((a, b) => a + b, 0);
      const cellGap = W >= 900 ? 2 : 1;
      const colGap = W >= 900 ? 14 : W >= 520 ? 10 : 6;
      const cw = (W - (n - cols.length) * cellGap - (cols.length - 1) * colGap) / n;
      setFitVars({
        fontSize: `${Math.min(cw / 0.74, 26)}px`,
        ["--cell-w" as string]: `${cw}px`,
        ["--cell-gap" as string]: `${cellGap}px`,
        ["--col-gap" as string]: `${colGap}px`,
      });
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [L]);

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
    // on smaller screens the pass sits below a long board: bring it into view
    if (window.innerWidth < 1024) {
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 30);
    }
  };

  const toggleSound = () => {
    setFlapSound(!sound);
    setSound(!sound);
  };

  const cols: [string, number][] = [
    ...(L.code ? [[meta.head[0], L.code] as [string, number]] : []),
    [meta.head[1], L.name],
    ...(L.detail ? [[meta.head[2], L.detail] as [string, number]] : []),
    ["Status", L.status],
  ];

  return (
    <div>
      <section className="board p-4 sm:p-6" aria-label="Flight board: career, projects and certifications">
        {/* the sign above the board */}
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="flex items-center gap-4 min-w-0">
            <span className="grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-sign text-ink shrink-0">
              <Plane className={cn("w-6 h-6 sm:w-7 sm:h-7 transition-transform", tab === "arrivals" ? "rotate-[135deg]" : "-rotate-45")} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[40px] sm:text-[64px] font-bold uppercase leading-[0.85] tracking-[0.01em] text-board-title" aria-hidden>
                {meta.label}
              </p>
              <p className="mt-1.5 font-display text-[15px] sm:text-[17px] font-semibold uppercase tracking-[0.08em] text-board-dim">
                {meta.what}
              </p>
            </div>
          </div>
          <div className="flex w-full sm:w-auto items-end justify-between sm:justify-end gap-4 sm:gap-6">
            <div className="sm:text-right font-display uppercase leading-none">
              <div
                className={cn("flex items-center sm:justify-end gap-1.5 text-[13px] sm:text-[14px] font-semibold tracking-[0.08em]", office.online ? "text-board-ok" : "text-board-dim")}
                data-testid="office-status"
              >
                <span className={cn("w-2 h-2 shrink-0 rounded-full", office.online ? "bg-board-ok blink" : "bg-board-dim")} />
                <span>
                  {/* hours in the visitor's own clock; in the UAE that is simply Dubai time */}
                  {office.online
                    ? `Online now · until ${office.untilLocal ?? office.until}${vtz ? " your time" : ""}`
                    : `Offline · back ${office.backLocal ?? office.back}${vtz ? " your time" : ""}`}
                </span>
              </div>
              {/* airport world clocks: the visitor's city (big) next to Dubai, where I am; one clock in the UAE */}
              <div className="mt-1.5 flex items-end gap-5 sm:gap-6 sm:justify-end" data-testid="world-clocks">
                {vtz && (
                  <div className="text-left sm:text-right">
                    <div
                      className="text-[32px] sm:text-[40px] font-bold text-board-text tabular-nums"
                      aria-label={`Your time ${localClockFull}`}
                      data-testid="board-clock"
                    >
                      {localClockFull}
                    </div>
                    <div className="mt-1 text-[12.5px] sm:text-[13px] font-semibold tracking-[0.1em] text-board-dim" data-testid="your-time">
                      {visitor.source === "ip" && visitor.city ? visitor.city : placeName(vtz)} · your time
                    </div>
                  </div>
                )}
                <div className={cn("text-left sm:text-right", vtz && "pl-5 sm:pl-6 border-l border-board-text/15")}>
                  <div
                    className={cn("font-bold tabular-nums", vtz ? "text-[22px] sm:text-[26px] text-board-fg" : "text-[32px] sm:text-[40px] text-board-text")}
                    aria-label={`Dubai time ${clock}`}
                    data-testid={vtz ? "dubai-clock" : "board-clock"}
                  >
                    {vtz ? clock.slice(0, 5) : clock}
                  </div>
                  <div className="mt-1 text-[12.5px] sm:text-[13px] font-semibold tracking-[0.1em] text-board-dim" data-testid={vtz ? "dubai-label" : "your-time"}>
                    {vtz ? "Dubai · I'm here" : "Dubai, UAE · GMT+4"}
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={sound}
              aria-label={sound ? "Turn board sound off" : "Turn board sound on"}
              title={sound ? "Board sound on" : "Board sound off"}
              className={cn(
                "mb-1 w-11 h-11 grid place-items-center rounded-xl border transition-colors",
                sound ? "border-board-fg/60 text-board-fg" : "border-board-text/15 text-board-dim hover:text-board-fg"
              )}
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
                tab === t.id ? "bg-sign text-ink" : "bg-board-text/[0.06] text-board-fg hover:bg-board-text/10"
              )}
            >
              {t.label}
              <span className="hidden sm:inline font-sans text-[13px] font-medium normal-case tracking-normal"> · {t.short}</span>
            </button>
          ))}
        </div>

        <div ref={panelRef} id="board-panel" role="tabpanel" aria-labelledby={`board-tab-${tab}`} className="mt-5">
          <div className="flap-size flex gap-[var(--col-gap)] px-2 pb-2" style={fitVars}>
            {cols.map(([h, n]) => (
              <span key={h} style={{ width: cellsWidth(n) }} className="shrink-0">
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
                  style={fitVars}
                  className={cn(
                    "flap-size flex gap-[var(--col-gap)] items-center w-full text-left px-2 py-1.5 rounded-xl font-display font-semibold transition-colors",
                    on ? "bg-board-text/[0.06] ring-2 ring-board-fg" : "hover:bg-board-text/[0.04]"
                  )}
                >
                  {L.code > 0 && <SplitFlap text={r.code} len={L.code} delay={d} className="text-board-fg" />}
                  <SplitFlap text={r.name} len={L.name} delay={d + 40} className="text-board-text" />
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
              {all ? "Show fewer" : `Show all ${rows.length} ${meta.short.toLowerCase()}`}
            </button>
          )}
        </div>
      </section>

      <div ref={detailRef} className="mt-5 scroll-mt-28" aria-live="polite">
        <Details tab={tab} id={selRow.id} row={selRow} />
      </div>
    </div>
  );
};

export default DepartureBoard;
