import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";
import ProjectCard from "@/components/ProjectCard";
import { projects, projectCategories, ProjectCategory } from "@/data/projects";
import { cn } from "@/lib/utils";

type Filter = "All" | ProjectCategory;

const ProjectsPage = () => {
  const [params, setParams] = useSearchParams();
  const fromUrl = projectCategories.find((c) => c.toLowerCase() === params.get("filter"));
  const [filter, setFilterState] = useState<Filter>(fromUrl ?? "All");
  const setFilter = (f: Filter) => {
    setFilterState(f);
    setParams(f === "All" ? {} : { filter: f.toLowerCase() }, { replace: true });
  };


  const counts = useMemo(() => {
    const c: Record<string, number> = { All: projects.length };
    projectCategories.forEach((cat) => (c[cat] = projects.filter((p) => p.categories.includes(cat)).length));
    return c;
  }, []);

  const shown = filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <div>
      <PageHero
        path="projects"
        title="Built because I needed them."
        description="Each one started as something I kept doing by hand at work. All open source, documented, and most run in a browser with nothing to install."
      />
      <section className="rule-t">
        <div className="wrap py-10 sm:py-14">
          <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter projects">
            {(["All", ...projectCategories] as Filter[]).map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "h-9 px-3.5 rounded-[4px] border font-mono text-[12.5px] transition-colors",
                  filter === f
                    ? "bg-foreground text-background border-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/40"
                )}
              >
                {f === "All" ? "all" : f.toLowerCase()} <span className="opacity-60">{counts[f]}</span>
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {shown.map((p) => (
              <ProjectCard key={p.id} project={p} index={projects.indexOf(p)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
