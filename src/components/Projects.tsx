import { useEffect, useState } from "react";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { Github, ExternalLink, FolderGit2, ChevronLeft, ChevronRight } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  // Add one or more screenshots here. Drop image files into /public
  // (e.g. /public/aws-patch-1.png) and reference them as "/aws-patch-1.png".
  // Leave the array empty ([]) to fall back to a generated placeholder.
  images: string[];
  github?: string;
  demo?: string;
}

/**
 * 👉 HOW TO ADD A NEW PROJECT
 * Just copy the block below and add it to this array — no other
 * code changes are required. The card, image carousel, and layout
 * will automatically pick it up.
 *
 * {
 *   id: "unique-id",
 *   title: "Project Name",
 *   description: "One or two sentences about what it does and why it matters.",
 *   tags: ["Bash", "AWS", "CI/CD"],
 *   images: ["/project-screenshot-1.png", "/project-screenshot-2.png"],
 *   github: "https://github.com/yousafkhamza/project",
 *   demo: "https://example.com", // optional
 * }
 */
const projects: Project[] = [
  {
    id: "aws-patch",
    title: "aws-patch",
    description:
      "A production-grade Linux patch automation tool for AWS EC2, built in Bash. Supports Ubuntu, Amazon Linux 2 and Amazon Linux 2023 across multiple regions, with a ShellCheck-clean codebase, 51 passing tests, and a one-line installer.",
    tags: ["Bash", 
      "AWS EC2", 
      "Amazon Linux",
      "Ubuntu",
      "dnf",
      "apt",
      "yum",
      "Open-Source",
      "Patch Automation", 
      "ShellCheck", 
      "DevOps",
    ],
    images: ["/project-aws-patch.jpg"],
    github: "https://github.com/yousafkhamza/aws-patch",
    demo: "https://yousafkhamza.github.io/aws-patch/",
  },
  {
  id: "universal-app-chart",
  title: "Universal App Helm Chart",
  description:
    "A production-ready, reusable Helm chart for deploying applications on Kubernetes and AWS EKS. Supports Deployments, StatefulSets, ALB Ingress, HPA, EBS, EFS, ConfigMaps, Secrets, IRSA, ServiceAccounts, node scheduling, health probes, and production-ready examples—all configurable through a single values.yaml.",
  tags: [
    "Helm",
    "Kubernetes",
    "AWS EKS",
    "Karpenter",
    "ArgoCD",
    "Open-Source",
    "DevOps",
    "Infrastructure as Code",
  ],
  images: ["/project-helm.jpg"],
  github: "https://github.com/yousafkhamza/universal-app-chart",
  demo: "https://yousafkhamza.github.io/universal-app-chart/",
},
{
  id: "pxtrim",
  title: "pxtrim",
  description:
    "A tiny, fully client-side image resize, batch convert & compress tool. Drop one file or a whole batch, adjust scale/quality/format, and download — no uploads, no backend, no storage. Everything runs in the browser via the Canvas API for the current session only.",
  tags: [
    "JavaScript",
    "Vite",
    "Canvas API",
    "Frontend",
    "Open-Source",
    "GitHub Actions",
  ],
  images: ["/project-pxtrim.jpg"],
  github: "https://github.com/yousafkhamza/pxtrim",
  demo: "https://yousafkhamza.github.io/pxtrim/",
},
];

const AUTO_ROTATE_MS = 3500;

const ProjectImage = ({
  project,
  activeIndex,
}: {
  project: Project;
  activeIndex: number;
}) => {
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
    <AnimatedCard className="glass-card rounded-xl overflow-hidden flex flex-col h-full group">
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
        <h3 className="font-bold text-lg text-foreground mb-2">
          {project.title}
        </h3>
        <p className="text-sm text-foreground/70 flex-1">
          {project.description}
        </p>

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
    </AnimatedCard>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="chip mb-4">Portfolio</span>
          <h2 className="section-title">Projects</h2>
          <p className="text-foreground/60 max-w-xl mx-auto mt-2">
            A few things I've built and open-sourced along the way.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
