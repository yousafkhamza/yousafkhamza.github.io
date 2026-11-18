import { useSearchParams } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";
import IncidentResponse from "@/components/games/IncidentResponse";
import CommandRush from "@/components/games/CommandRush";
import Misconfig from "@/components/games/Misconfig";
import { cn } from "@/lib/utils";

const GAMES = [
  { id: "incident", title: "Incident Response", blurb: "Whack the incidents before they page you", Component: IncidentResponse },
  { id: "rush", title: "Command Rush", blurb: "220+ situations, 5 levels, type the fix", Component: CommandRush },
  { id: "misconfig", title: "Spot the Misconfig", blurb: "300+ files, 5 levels, find the line that breaks prod", Component: Misconfig },
] as const;

const PlayPage = () => {
  const [params, setParams] = useSearchParams();
  const active = GAMES.find((g) => g.id === params.get("game")) ?? GAMES[0];
  const Game = active.Component;

  return (
    <div>
      <PageHero
        path="play"
        title="On-call, but fun."
        description="Three small games about the job. Everything runs in your browser and your best scores stay on this device."
      />
      <section className="rule-t">
        <div className="wrap py-10 sm:py-14">
          <div className="grid sm:grid-cols-3 gap-3 mb-10" role="tablist" aria-label="Games">
            {GAMES.map((g, i) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={g.id === active.id}
                onClick={() => setParams({ game: g.id }, { replace: true })}
                className={cn(
                  "text-left panel px-4 py-3.5 transition-colors",
                  g.id === active.id ? "border-foreground bg-foreground text-background" : "hover:border-foreground/40"
                )}
              >
                <div className={cn("font-mono text-[11.5px]", g.id === active.id ? "text-background/60" : "text-muted-foreground")}>
                  game {i + 1}
                </div>
                <div className="text-[16px] font-semibold mt-0.5">{g.title}</div>
                <div className={cn("text-[13.5px] mt-0.5", g.id === active.id ? "text-background/75" : "text-muted-foreground")}>
                  {g.blurb}
                </div>
              </button>
            ))}
          </div>
          <Game key={active.id} />
        </div>
      </section>
    </div>
  );
};

export default PlayPage;
