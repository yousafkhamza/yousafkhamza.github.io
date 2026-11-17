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
    <article
      className="panel flex flex-col h-full overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--c)/0.6)] hover:shadow-[0_24px_60px_-28px_hsl(var(--c)/0.7)]"
      style={{ ["--c" as string]: `var(--c-${CATEGORY_COLOR[project.categories[0]] ?? "green"})` }}
    >
      <a
        href={project.demo ?? project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-video overflow-hidden border-b border-border bg-secondary"
        tabIndex={-1}
        aria-hidden
      >
        {project.images[0] && (
          <img
            src={project.images[0]}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </a>
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11.5px] text-muted-foreground">
          {index !== undefined && <span className="mr-1">{String(index + 1).padStart(2, "0")}</span>}
          {project.categories.map((c) => (
            <span
              key={c}
              className="px-2 py-0.5 rounded-full font-semibold"
              style={{ background: `hsl(var(--c-${CATEGORY_COLOR[c]}) / 0.14)`, color: `hsl(var(--c-${CATEGORY_COLOR[c]}))` }}
            >
              {c.toLowerCase()}
            </span>
          ))}
        </div>
        <h3 className="mt-3 font-display text-[22px] font-bold tracking-[-0.01em] group-hover:text-[hsl(var(--c))] transition-colors">{project.title}</h3>
        <p
          className={cn(
            "mt-2 text-[14.5px] leading-relaxed text-muted-foreground",
            !expanded && (compact ? "line-clamp-3" : "line-clamp-4")
          )}
        >
          {project.description}
        </p>
        {!compact && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="self-start mt-1.5 font-mono text-[12px] tint hover:underline"
            aria-expanded={expanded}
          >
            {expanded ? "− less" : "+ read more"}
          </button>
        )}
        {!compact && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {shownTags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
            {extra > 0 && <span className="tag text-muted-foreground">+{extra}</span>}
          </div>
        )}
        <div className="mt-auto pt-5 flex items-center gap-5 text-[14px] font-medium">
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 tint">
              Live <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <Github className="w-4 h-4" /> Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
