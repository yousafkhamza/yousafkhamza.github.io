import { profile, yearsOfExperience } from "./profile";

/**
 * One source of truth for page titles and descriptions.
 * Used at runtime (useSeo) and at build time (scripts/prerender.mjs writes a
 * real HTML file per route, so search engines and link previews see the right
 * text without running JavaScript).
 */
export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  priority: number;
}

export const routeMeta = (): RouteMeta[] => {
  const y = yearsOfExperience();
  return [
    {
      path: "/",
      title: `${profile.name} (${profile.altName}) · Senior DevOps Engineer in Dubai, UAE`,
      description: `${profile.name} is a Senior DevOps & Platform Engineer in Dubai, UAE with ${y}+ years on AWS, Kubernetes (EKS), Terraform, GitOps and DevSecOps for fintech and regulated enterprises. Experience, open-source projects and resume.`,
      priority: 1.0,
    },
    {
      path: "/experience",
      title: `Experience · ${profile.name}, Senior DevOps Engineer UAE`,
      description: `${y}+ years of DevOps, SRE and platform engineering: Pay10 (Dubai), Alamy, Quantiphi and more. EKS migrations, Terraform, Argo CD, observability, PCI DSS and SOC 2 controls.`,
      priority: 0.9,
    },
    {
      path: "/projects",
      title: `Open-source DevOps projects · ${profile.name}`,
      description: `Open-source DevOps, Kubernetes, AWS security and AI tools built by ${profile.name} (${profile.handle}): K8s Incident Copilot, IAM Policy Visualizer, PodGauge, Universal Helm Chart and more.`,
      priority: 0.9,
    },
    {
      path: "/services",
      title: `DevOps career guidance, resume review & mock interviews · ${profile.name}`,
      description: `1:1 DevOps career guidance, resume and LinkedIn reviews, mock DevOps interviews and infrastructure reviews from a Senior DevOps Engineer in Dubai, UAE.`,
      priority: 0.7,
    },
    {
      path: "/contact",
      title: `Contact ${profile.name} · Senior DevOps Engineer, Dubai`,
      description: `Hiring a Senior DevOps, Platform or SRE engineer in the UAE? Contact ${profile.name} by email, LinkedIn or the form.`,
      priority: 0.7,
    },
    {
      path: "/play",
      title: `On-call games · ${profile.name}`,
      description: "Three small browser games about life in DevOps: incident response, a command-line speed run and spot-the-misconfiguration.",
      priority: 0.3,
    },
  ];
};

export const metaFor = (path: string) => {
  const all = routeMeta();
  return all.find((r) => r.path === path) ?? all[0];
};
