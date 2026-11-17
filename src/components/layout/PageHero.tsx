import { ReactNode } from "react";

interface PageHeroProps {
  path: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

/** top of every inner page: a breadcrumb that reads like a shell path */
const PageHero = ({ path, title, description, children }: PageHeroProps) => (
  <div className="wrap pt-12 sm:pt-16 pb-10 sm:pb-14">
    <div className="font-mono text-[13px] text-muted-foreground mb-5">
      <span className="text-yousaf">~</span>/{path}
    </div>
    <h1 className="text-[36px] sm:text-[52px] font-semibold tracking-[-0.03em] leading-[1.05] max-w-[18ch]">{title}</h1>
    {description && <p className="lede mt-5">{description}</p>}
    {children}
  </div>
);

export default PageHero;
