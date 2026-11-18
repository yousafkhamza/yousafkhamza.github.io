import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Bot, BookOpenText, Github, ShieldAlert } from "lucide-react";
import { projects } from "@/data/projects";

/** The AI projects, each with a live demo. Shown three to a row on wide screens; add new ones here. */
const META: Record<string, { icon: typeof Bot; color: string; kicker: string; headline: string; body: string }> = {
  pipelineguard: {
    icon: ShieldAlert,
    color: "amber",
    kicker: "AI DevSecOps",
    headline: "Catches CI attacks before they land",
    body: "Scans GitHub Actions workflows against 36 attack patterns, points at the exact line and grades the pipeline. Claude or OpenAI drafts the fixed YAML. Runs in the browser, as a CLI, or as an Action with SARIF.",
  },
  "k8s-incident-copilot": {
    icon: Bot,
    color: "pink",
    kicker: "Agentic AI",
    headline: "An agent that debugs Kubernetes",
    body: "Watches your namespaces, investigates a broken pod with read-only cluster tools, and posts the root cause and the fix to Slack or Teams. Runs Qwen 2.5 on Ollama inside the cluster, or Claude, OpenAI, Gemini and Bedrock.",
  },
  "platform-copilot": {
    icon: BookOpenText,
    color: "violet",
    kicker: "RAG",
    headline: "Answers from your own docs",
    body: "Ask questions about your own runbooks and get answers cited back to the source file. Qdrant for retrieval, Ollama for inference, FastAPI in between, and nothing leaves the cluster.",
  },
};

const AiSection = () => {
  const items = projects.filter((p) => META[p.id]);
  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((p) => {
          const m = META[p.id];
          const Icon = m.icon;
          return (
            <article
              key={p.id}
              className="panel overflow-hidden flex flex-col group transition-transform hover:-translate-y-1 md:max-lg:last:odd:col-span-2 md:max-lg:last:odd:flex-row"
              style={{ ["--c" as string]: `var(--c-${m.color})` }}
            >
              <a href={p.demo ?? p.github} target="_blank" rel="noopener noreferrer" className="block aspect-video overflow-hidden border-b border-border md:max-lg:group-last:group-odd:w-1/2 md:max-lg:group-last:group-odd:shrink-0 md:max-lg:group-last:group-odd:self-center md:max-lg:group-last:group-odd:border-b-0 md:max-lg:group-last:group-odd:border-r" tabIndex={-1} aria-hidden>
                <img src={p.images[0]} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </a>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3">
                  <span className="inline-grid place-items-center w-9 h-9 rounded-lg tint-bg">
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] tint">{m.kicker}</span>
                  <span className="ml-auto font-mono text-[11.5px] text-muted-foreground">{p.title}</span>
                </div>
                <h3 className="mt-4 font-display text-[22px] font-bold leading-tight">{m.headline}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{m.body}</p>
                <div className="mt-auto pt-5 flex items-center gap-5 text-[14px] font-semibold">
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 tint">
                      See it live <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                      <Github className="w-4 h-4" /> Code
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <Link to="/projects?filter=ai" className="btn-link mt-6">
        AI projects on the projects page <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default AiSection;
