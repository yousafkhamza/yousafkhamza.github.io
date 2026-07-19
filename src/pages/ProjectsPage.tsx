import { useEffect } from "react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const ProjectsPage = () => {
  useEffect(() => {
    document.title = "Projects | Yousaf K Hamza";
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Open-Source"
        title="Tools I've built to fix my own problems."
        description="Side projects born from real DevOps friction — published, documented, and used in production. Each one started as 'I keep doing this by hand.'"
      />

      <Section border={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>
    </div>
  );
};

export default ProjectsPage;
