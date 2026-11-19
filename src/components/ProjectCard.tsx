import { useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export const CATEGORY_COLOR: Record<string, string> = {
  AI: "violet",
  Kubernetes: "cyan",
  Security: "pink",
  AWS: "amber",
  Tools: "green",
};

const ProjectCard = ({ project, index, compact = false }: { project: Project; index?: number; compact?: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const shownTags = project.tags.slice(0, 5);
  const extra = project.tags.length - shownTags.length;

  return (
    <article className="panel flex flex-col h-full overflow-hidden group transition-transform duration-300 hover:-translate-y-1">
      <a
        href={project.demo ?? project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-video overflow-hidden border-b border-border bg-secondary"
        tabIndex={-1}
      >
        {project.images[0] && (
          <img
            src={project.images[0]}
            alt={`${project.title} screenshot`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </a>
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {index !== undefined && <span className="label mr-1">{String(index + 1).padStart(2, "0")}</span>}
          {project.categories.map((c) => (
            <span key={c} className="tag">
              {c}
            </span>
          ))}
        </div>
        <h3 className="mt-3 font-display text-[26px] font-bold leading-[1.05]">{project.title}</h3>
        <p
          className={cn(
            "mt-2 text-[15px] leading-relaxed text-muted-foreground",
            !expanded && (compact ? "line-clamp-3" : "line-clamp-4")
          )}
        >
          {project.description}
        </p>
        {!compact && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="self-start mt-1.5 text-[14px] font-semibold underline decoration-2 decoration-[hsl(var(--sign))] underline-offset-4"
            aria-expanded={expanded}
          >
            {expanded ? "− less" : "+ read more"}
          </button>
        )}
        {!compact && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {shownTags.map((t) => (
              <span key={t} className="tool">
                {t}
              </span>
            ))}
            {extra > 0 && <span className="tool">+{extra}</span>}
          </div>
        )}
        <div className="mt-auto pt-5 flex items-center gap-2">
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-primary h-10 px-4 text-[15px]">
              Live <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-ghost h-10 px-4 text-[15px]">
              <Github className="w-4 h-4" /> Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
