import { useEffect, useState } from "react";
import { Github, ExternalLink, FolderGit2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@/data/projects";

const AUTO_ROTATE_MS = 3500;

const ProjectImage = ({ project, activeIndex }: { project: Project; activeIndex: number }) => {
  if (project.images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yousaf/20 via-accent to-yousaf-light/40 dark:from-yousaf/10 dark:via-accent/40 dark:to-yousaf-dark/20">
        <FolderGit2 className="w-14 h-14 text-yousaf/70" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <>
      {project.images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${project.title} screenshot ${i + 1}`}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            i === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasMultipleImages = project.images.length > 1;

  useEffect(() => {
    if (!hasMultipleImages || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % project.images.length);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(interval);
  }, [hasMultipleImages, isPaused, project.images.length]);

  const goTo = (index: number) => {
    setActiveIndex((index + project.images.length) % project.images.length);
  };

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col h-full group border border-border hover:border-yousaf/30 transition-colors bg-card">
      <div
        className="relative w-full aspect-video overflow-hidden bg-accent/50"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <ProjectImage project={project} activeIndex={activeIndex} />

        {hasMultipleImages && (
          <>
            <button
              aria-label="Previous screenshot"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              aria-label="Next screenshot"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-1.5">
              {project.images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show screenshot ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-foreground mb-2">{project.title}</h3>
        <p className="text-sm text-foreground/70 flex-1 leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>

        {(project.github || project.demo) && (
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border/50">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-yousaf transition-colors"
              >
                <Github className="w-4 h-4" />
                Code
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-yousaf transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Live
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
