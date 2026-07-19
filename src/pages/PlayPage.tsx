import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Flame, Bug, Lock, Skull, CloudOff, Timer, Database, ShieldAlert } from "lucide-react";

// "Incident Response" — a small offline whack-a-pod game. Incidents pop up
// on random pods in the cluster; click them before the ring runs out. Miss
// three and it's a postmortem. Not a runner, not a Chrome-dino reskin —
// the mental model is lifted straight from actually being on-call.

const GRID_SIZE = 9;
const MAX_MISSES = 3;

const INCIDENT_TYPES = [
  { icon: Flame, label: "Outage", color: "text-red-500" },
  { icon: Bug, label: "Bug", color: "text-lime-500" },
  { icon: Lock, label: "Breach", color: "text-purple-400" },
  { icon: Skull, label: "OOMKilled", color: "text-orange-500" },
  { icon: CloudOff, label: "Net Down", color: "text-sky-400" },
  { icon: Timer, label: "Timeout", color: "text-amber-500" },
  { icon: Database, label: "DB Lock", color: "text-pink-400" },
  { icon: ShieldAlert, label: "CVE Found", color: "text-red-400" },
];

type Incident = {
  tile: number;
  type: (typeof INCIDENT_TYPES)[number];
  bornAt: number;
  durationMs: number;
} | null;

const TuxMascot = ({ alarmed }: { alarmed: boolean }) => (
  <svg
    viewBox="0 0 100 120"
    className={`w-16 h-20 sm:w-20 sm:h-24 transition-transform duration-200 ${
      alarmed ? "-rotate-3 scale-105" : ""
    }`}
  >
    <ellipse cx="50" cy="65" rx="34" ry="45" fill="#0a0d12" stroke="#22C55E" strokeWidth="2" />
    <ellipse cx="50" cy="75" rx="20" ry="30" fill="#e5e9ef" />
    <circle cx="39" cy="45" r="6" fill="#e5e9ef" />
    <circle cx="61" cy="45" r="6" fill="#e5e9ef" />
    <circle cx="39" cy="46" r="2.6" fill="#0a0d12" />
    <circle cx="61" cy="46" r="2.6" fill="#0a0d12" />
    <path d="M45 52 L55 52 L50 59 Z" fill="#F59E0B" />
    <ellipse cx="30" cy="108" rx="9" ry="4" fill="#F59E0B" />
    <ellipse cx="70" cy="108" rx="9" ry="4" fill="#F59E0B" />
  </svg>
);

const PlayPage = () => {
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [best, setBest] = useState<number>(() => {
    try {
      return Number(localStorage.getItem("incident-response-best") || 0);
    } catch {
      return 0;
    }
  });
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [incident, setIncident] = useState<Incident>(null);
  const [resolvedTile, setResolvedTile] = useState<number | null>(null);
  const [breachedTile, setBreachedTile] = useState<number | null>(null);
  const [progress, setProgress] = useState(1);

  const scoreRef = useRef(0);
  const missesRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const rafRef = useRef<number>();

  useEffect(() => {
    document.title = "Incident Response | Yousaf K Hamza";
  }, []);

  const endGame = useCallback(() => {
    setGameOver(true);
    setIncident(null);
    setStarted(false);
    setBest((prev) => {
      const next = Math.max(prev, scoreRef.current);
      try {
        localStorage.setItem("incident-response-best", String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const spawnIncident = useCallback(() => {
    const speedFactor = Math.max(0.45, 1 - scoreRef.current * 0.02);
    const durationMs = 1500 * speedFactor;
    const tile = Math.floor(Math.random() * GRID_SIZE);
    const type = INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)];
    const bornAt = performance.now();
    setIncident({ tile, type, bornAt, durationMs });
    setProgress(1);

    timeoutRef.current = setTimeout(() => {
      missesRef.current += 1;
      setMisses(missesRef.current);
      setBreachedTile(tile);
      setTimeout(() => setBreachedTile(null), 300);
      setIncident(null);
      if (missesRef.current >= MAX_MISSES) {
        endGame();
      } else {
        setTimeout(spawnIncident, 500);
      }
    }, durationMs);
  }, [endGame]);

  // progress ring animation
  useEffect(() => {
    if (!incident) return;
    const tick = () => {
      const elapsed = performance.now() - incident.bornAt;
      const remaining = Math.max(0, 1 - elapsed / incident.durationMs);
      setProgress(remaining);
      if (remaining > 0) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [incident]);

  const handleStart = () => {
    scoreRef.current = 0;
    missesRef.current = 0;
    setScore(0);
    setMisses(0);
    setGameOver(false);
    setStarted(true);
    spawnIncident();
  };

  const handleTileClick = (tileIndex: number) => {
    if (!incident || incident.tile !== tileIndex) return;
    clearTimeout(timeoutRef.current);
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setResolvedTile(tileIndex);
    setTimeout(() => setResolvedTile(null), 250);
    setIncident(null);
    setTimeout(spawnIncident, 350);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 bg-background">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-yousaf transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to the actual portfolio
      </Link>

      <div className="flex items-end gap-4 mb-2">
        <TuxMascot alarmed={!!incident || gameOver} />
        <div className="text-left">
          <span className="eyebrow">You're on-call</span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Incident Response</h1>
        </div>
      </div>
      <p className="text-sm text-muted-foreground max-w-sm text-center mb-8">
        A tiny offline game about being on-call. Details below ↓
      </p>

      <div className="relative rounded-2xl border border-yousaf/15 bg-card p-4 sm:p-6">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-[270px] sm:w-[320px]">
          {Array.from({ length: GRID_SIZE }).map((_, i) => {
            const isIncident = incident?.tile === i;
            const Icon = incident?.type.icon;
            const isResolved = resolvedTile === i;
            const isBreached = breachedTile === i;

            return (
              <button
                key={i}
                onClick={() => handleTileClick(i)}
                disabled={!started}
                className={`relative aspect-square rounded-xl border flex items-center justify-center transition-colors ${
                  isBreached
                    ? "border-red-500 bg-red-500/10"
                    : isResolved
                    ? "border-yousaf bg-yousaf/10"
                    : "border-border bg-black/5 dark:bg-black/20"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-yousaf/30" />

                {isIncident && Icon && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 animate-fade-in">
                    <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-border"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={2 * Math.PI * 16}
                        strokeDashoffset={2 * Math.PI * 16 * (1 - progress)}
                        className={incident.type.color}
                      />
                    </svg>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${incident.type.color}`} />
                    <span className={`text-[9px] font-mono font-semibold ${incident.type.color}`}>
                      {incident.type.label}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {(!started || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm rounded-2xl px-6">
            {gameOver ? (
              <div className="text-center mb-4">
                <p className="font-mono text-sm text-red-500 font-semibold">🔴 Postmortem time</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {score} incident{score === 1 ? "" : "s"} resolved
                </p>
              </div>
            ) : (
              <div className="text-center mb-5 max-w-[240px]">
                <p className="text-xs font-mono uppercase tracking-widest text-yousaf mb-2">
                  How to play
                </p>
                <ul className="text-xs text-muted-foreground space-y-1.5 text-left">
                  <li>▸ An icon pops up on a pod — that's an incident</li>
                  <li>▸ Click it before the ring runs out</li>
                  <li>▸ Miss 3 and it's a postmortem</li>
                  <li>▸ Gets faster the longer you survive</li>
                </ul>
              </div>
            )}
            <button
              onClick={handleStart}
              className="px-6 py-2.5 bg-yousaf text-white rounded-full text-sm font-semibold hover:bg-yousaf-dark transition-colors"
            >
              {gameOver ? "Redeploy" : "Go on-call"}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-8 mt-6 font-mono text-sm">
        <div>
          <span className="text-muted-foreground">resolved </span>
          <span className="text-yousaf font-bold">{score}</span>
        </div>
        <div>
          <span className="text-muted-foreground">missed </span>
          <span className="text-red-500 font-bold">
            {misses}/{MAX_MISSES}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">best </span>
          <span className="text-foreground font-bold">{best}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayPage;
