import { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const Reveal = ({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" }) => {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  return (
    <Tag ref={ref} className={cn("reveal", inView && "in", className)}>
      {children}
    </Tag>
  );
};

export default Reveal;
