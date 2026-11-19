import { useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/data/projects";
import Pass, { PassField } from "@/components/Pass";
import { flightCode } from "@/lib/flight";
import { cn } from "@/lib/utils";

export const CATEGORY_COLOR: Record<string, string> = {
  AI: "violet",
  Kubernetes: "cyan",
  Security: "pink",
  AWS: "amber",
  Tools: "green",
};

/** a project as a boarding pass: what it is above the tear, where to go (demo / code) on the stub */
const ProjectCard = ({ project, index, compact = false }: { project: Project; index?: number; compact?: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const shownTags = project.tags.slice(0, 5);
  const extra = project.tags.length - shownTags.length;
  const code = `${flightCode(project.title)}${index !== undefined ? ` ${String(index + 1).padStart(2, "0")}` : ""}`;

  return (
    <Pass
      className="h-full group transition-transform duration-300 hover:-translate-y-1"
      label={project.categories.join(" · ")}
      code={`Flight ${code}`}
      main={
        <div className="flex flex-col h-full">
          <a
            href={project.demo ?? project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative aspect-video overflow-hidden bg-secondary"
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
            <h3 className="font-display text-[28px] font-bold uppercase leading-none">{project.title}</h3>
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
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
                {extra > 0 && <span className="tag text-muted-foreground">+{extra}</span>}
              </div>
            )}
          </div>
        </div>
      }
      stub={
        <div className="px-5 sm:px-6 py-4 flex items-end justify-between gap-4">
          <PassField k="Status" v={project.demo ? "Live demo" : "Open source"} />
          <div className="flex items-center gap-2 shrink-0">
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
      }
    />
  );
};

export default ProjectCard;
