import { Link } from "react-router-dom";
import { ArrowRight, Bot, BookOpenText, GitPullRequest, Cpu } from "lucide-react";
import { projects } from "@/data/projects";

/** DevOps for AI, and AI for DevOps: the work that maps to where the field is heading */
const AiSection = () => {
  const copilot = projects.find((p) => p.id === "k8s-incident-copilot");
  const rag = projects.find((p) => p.id === "platform-copilot");
  const cards = [
    {
      icon: Bot,
      color: "pink",
      kicker: "Agentic AI",
      title: "An agent that debugs Kubernetes",
      body: "K8s Incident Copilot investigates a broken pod with read-only cluster tools, finds the root cause and posts the fix to Slack or Teams. Runs Qwen 2.5 on Ollama inside the cluster, or Claude, OpenAI, Gemini and Bedrock.",
      href: copilot?.demo ?? copilot?.github,
    },
    {
      icon: BookOpenText,
      color: "violet",
      kicker: "RAG",
      title: "Answers from your own docs",
      body: "Platform Copilot: Qdrant for retrieval, Ollama for inference, every answer cited back to its source file. Nothing leaves the cluster.",
      href: rag?.demo ?? rag?.github,
    },
    {
      icon: GitPullRequest,
      color: "cyan",
      kicker: "AI in CI/CD",
      title: "LLM review before merge",
      body: "Wired an LLM code reviewer into the CI pipeline at Alamy to catch defects earlier and cut manual review effort.",
    },
    {
      icon: Cpu,
      color: "green",
      kicker: "Platform for AI",
      title: "Running models on your own EKS",
      body: "Worked through self-hosted LLM serving: vLLM on Karpenter GPU node pools, scaled with KEDA and shipped with Argo CD.",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {cards.map(({ icon: Icon, color, kicker, title, body, href }) => {
        const inner = (
          <>
            <div className="flex items-center gap-3">
              <span className="inline-grid place-items-center w-10 h-10 rounded-lg tint-bg">
                <Icon className="w-5 h-5" />
              </span>
              <span className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.08em] tint">{kicker}</span>
            </div>
            <div className="mt-4 font-display text-[21px] font-bold leading-tight">{title}</div>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{body}</p>
            {href && (
              <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold tint">
                See it live <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </>
        );
        const cls = "panel p-6 block border-l-4 transition-transform hover:-translate-y-0.5";
        const style = { ["--c" as string]: `var(--c-${color})`, borderLeftColor: `hsl(var(--c-${color}))` };
        return href ? (
          <a key={title} href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
            {inner}
          </a>
        ) : (
          <div key={title} className={cls} style={style}>
            {inner}
          </div>
        );
      })}
      <Link to="/projects?filter=ai" className="md:col-span-2 btn-link justify-self-start">
        All AI projects <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default AiSection;
