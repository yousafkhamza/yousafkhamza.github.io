import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Github, Linkedin, ExternalLink } from "lucide-react";
import CloudAnimation from "@/components/ui/CloudAnimation";
import Section from "@/components/layout/Section";
import { skills, skillCategories } from "@/data/skills";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";

const stats = [
  { value: "7+", label: "Years Experience" },
  { value: "50+", label: "Microservices Managed" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "9", label: "Certifications" },
];

const Home = () => {
  useEffect(() => {
    document.title = "Yousaf K Hamza | Senior DevOps & Platform Engineer";
  }, []);

  const featured = projects.slice(0, 3);
  const recentRoles = experiences.slice(0, 2);

  return (
    <div>
      {/* HERO */}
      <div className="relative overflow-hidden border-b border-border/60">
        <CloudAnimation />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-6xl pt-20 pb-20 md:pt-28 md:pb-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yousaf/20 bg-yousaf/5 text-xs font-mono text-yousaf mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-yousaf animate-pulse-slow" />
            Currently @ Pay10, UAE — Senior DevOps &amp; Platform Engineer
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 max-w-4xl">
            Cloud infrastructure that{" "}
            <span className="text-yousaf">doesn't page you</span> at 3am.
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
            I'm Yousaf K Hamza, a Senior DevOps &amp; Platform Engineer building secure,
            highly available multi-cloud platforms across AWS, Azure, and GCP — for
            fintech and regulated enterprises that can't afford downtime.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-14">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-yousaf text-white rounded-full text-sm font-semibold hover:bg-yousaf-dark transition-colors"
            >
              View Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border rounded-full text-sm font-semibold hover:border-yousaf/40 hover:bg-accent/40 transition-colors"
            >
              Get In Touch
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Download Resume →
            </a>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-10 gap-y-6 sm:gap-y-4 pt-8 border-t border-border/60">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-extrabold text-foreground">{s.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SKILLS / TOOLBOX */}
      <Section>
        <span className="eyebrow">Toolbox</span>
        <h2 className="section-title">What I work with</h2>
        <p className="section-subtitle mb-10">
          The stack I reach for to design, ship, and operate production infrastructure.
        </p>

        <div className="space-y-6">
          {skillCategories.map((category) => (
            <div key={category} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground shrink-0 sm:w-40">
                {category}
              </div>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <span
                      key={skill.name}
                      className="inline-flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full text-xs font-medium bg-accent/60 text-accent-foreground border border-transparent hover:border-yousaf/20 transition-colors"
                    >
                      <img
                        src={skill.icon}
                        alt=""
                        className="w-4 h-4 object-contain rounded-sm bg-white/80"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {skill.name}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FEATURED PROJECTS */}
      <Section>
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="eyebrow">Selected Work</span>
            <h2 className="section-title mb-0">Featured projects</h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-yousaf hover:underline shrink-0"
          >
            View all projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((project) => (
            <Link
              key={project.id}
              to="/projects"
              className="group rounded-2xl overflow-hidden border border-border hover:border-yousaf/30 transition-colors bg-card"
            >
              <div className="aspect-video overflow-hidden bg-accent/40">
                {project.images[0] ? (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    {project.title}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-foreground mb-1.5">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* EXPERIENCE TEASER */}
      <Section border={false}>
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="eyebrow">Career</span>
            <h2 className="section-title mb-0">Where I've built</h2>
          </div>
          <Link
            to="/experience"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-yousaf hover:underline shrink-0"
          >
            View full experience
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recentRoles.map((exp) => (
            <div key={exp.id} className="rounded-2xl border border-border p-6 hover:border-yousaf/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <img src={exp.logo} alt={exp.company} className="w-10 h-10 rounded-full object-cover bg-white" />
                <div>
                  <div className="font-bold text-foreground">{exp.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {exp.company} · {exp.period}
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
                {exp.description[0]}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA BAND */}
      <Section border={false} className="pt-0">
        <div className="rounded-3xl border border-yousaf/15 bg-gradient-to-br from-yousaf/[0.07] to-transparent px-8 py-14 md:py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Let's build something reliable.
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Open to senior DevOps, platform, and SRE roles — or a conversation about
            your infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-yousaf text-white rounded-full text-sm font-semibold hover:bg-yousaf-dark transition-colors"
            >
              Get In Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-4 mt-2 sm:mt-0 sm:ml-2">
              <a
                href="https://github.com/yousafkhamza"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-yousaf transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/yousafkhamza/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-yousaf transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
