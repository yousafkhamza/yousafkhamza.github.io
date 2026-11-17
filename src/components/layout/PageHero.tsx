import { ReactNode } from "react";

interface PageHeroProps {
  path: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

/** top of every inner page: a breadcrumb that reads like a shell path */
const PageHero = ({ path, title, description, children }: PageHeroProps) => (
  <div className="relative overflow-hidden">
  <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" aria-hidden />
  <div className="absolute -top-24 right-[-120px] w-[460px] h-[300px] rounded-full" style={{ background: "radial-gradient(closest-side, hsl(var(--c-cyan) / var(--glow)), transparent)" }} aria-hidden />
  <div className="absolute top-10 right-[22%] w-[360px] h-[260px] rounded-full" style={{ background: "radial-gradient(closest-side, hsl(var(--c-violet) / calc(var(--glow) * 0.7)), transparent)" }} aria-hidden />
  <div className="wrap relative pt-12 sm:pt-16 pb-10 sm:pb-14">
    <div className="font-mono text-[13px] text-muted-foreground mb-5">
      <span className="text-c-green">yousaf@portfolio</span>:<span className="text-c-cyan">~/{path}</span>$
    </div>
    <h1 className="font-display text-[40px] sm:text-[60px] font-extrabold tracking-[-0.03em] leading-[1.02] max-w-[18ch]">{title}</h1>
    {description && <p className="lede mt-5">{description}</p>}
    {children}
  </div>
  </div>
);

export default PageHero;
