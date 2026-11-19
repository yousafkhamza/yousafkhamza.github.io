import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface PageHeroProps {
  path: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

/** top of every inner page: a wayfinding sign that says where you are */
const PageHero = ({ path, title, description, children }: PageHeroProps) => (
  <div className="relative">
    <div className="wrap relative pt-10 sm:pt-14 pb-10 sm:pb-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-0 mb-6 font-display text-[16px] font-bold uppercase tracking-[0.06em]">
        <Link to="/" className="px-2.5 py-1 bg-strip text-strip-fg hover:text-white rounded-l-lg">
          Home
        </Link>
        <span className="px-2.5 py-1 bg-sign text-[hsl(0_0%_7%)] rounded-r-lg" aria-current="page">
          → {path}
        </span>
      </nav>
      <h1 className="font-display text-[48px] sm:text-[76px] font-bold tracking-[-0.02em] leading-[0.95] max-w-[18ch]">{title}</h1>
      {description && <p className="lede mt-5">{description}</p>}
      {children}
    </div>
  </div>
);

export default PageHero;
