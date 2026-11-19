import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHero from "@/components/layout/PageHero";
import ProjectCard from "@/components/ProjectCard";
import { projects, projectCategories, ProjectCategory } from "@/data/projects";
import { cn } from "@/lib/utils";
import { CATEGORY_COLOR } from "@/components/ProjectCard";

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
                style={{ ["--c" as string]: f === "All" ? "var(--primary)" : `var(--c-${CATEGORY_COLOR[f]})` }}
                className={cn(
                  "h-9 px-4 rounded-full border font-mono text-[14.5px] font-semibold transition-colors",
                  filter === f ? "bg-[hsl(var(--c))] text-background border-transparent" : "border-border bg-card tint"
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
