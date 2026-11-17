import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  label?: string;
  title?: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  border?: boolean;
  /** signal colour for this section's label and accents */
  color?: "green" | "cyan" | "violet" | "amber" | "pink";
}

const Section = ({ id, label, title, intro, aside, children, className, border = true, color = "green" }: SectionProps) => (
  <section
    id={id}
    className={cn("py-16 sm:py-24 scroll-mt-20", border && "rule-t", className)}
    style={{ ["--sec" as string]: `var(--c-${color})`, ["--c" as string]: `var(--c-${color})` }}
  >
    <div className="wrap">
      {(label || title) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            {label && <div className="eyebrow">{label}</div>}
            {title && <h2 className="h-section">{title}</h2>}
            {intro && <p className="lede mt-3">{intro}</p>}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      )}
      {children}
    </div>
  </section>
);

export default Section;
