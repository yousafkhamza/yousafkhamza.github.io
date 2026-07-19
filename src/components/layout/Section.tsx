import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  border?: boolean;
  id?: string;
  containerClassName?: string;
}

const Section = ({ children, className = "", border = true, id, containerClassName = "" }: SectionProps) => (
  <section id={id} className={`py-16 md:py-24 ${border ? "border-b border-border/60" : ""} ${className}`}>
    <div className={`container mx-auto px-4 sm:px-6 max-w-6xl ${containerClassName}`}>{children}</div>
  </section>
);

export default Section;
