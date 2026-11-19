import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A boarding pass: a header strip, the main part, a perforated tear line with
 * notches, and the stub. On a phone the stub always tears off below; from `row`
 * upwards it sits beside the main part (or before it, with `stubFirst`).
 */
interface PassProps {
  label: ReactNode;
  code?: ReactNode;
  tone?: "board" | "sign";
  /** screen width from which the stub moves beside the main part */
  row?: "md" | "lg";
  stubFirst?: boolean;
  /** stub width once it sits beside the main part */
  stubWidth?: string;
  main: ReactNode;
  stub: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  as?: "article" | "div" | "aside" | "section";
  ariaLabel?: string;
}

const Pass = ({
  label,
  code,
  tone = "board",
  row,
  stubFirst = false,
  stubWidth,
  main,
  stub,
  className,
  style,
  id,
  as: Tag = "article",
  ariaLabel,
}: PassProps) => (
  <Tag
    id={id}
    aria-label={ariaLabel}
    className={cn("pass", row && `pass-row-${row}`, stubFirst && "pass-stub-first", className)}
    style={{ ...style, ...(stubWidth ? { ["--stub-w" as string]: stubWidth } : {}) }}
  >
    <div className={cn("pass-head", `tone-${tone}`)}>
      <span>{label}</span>
      {code && <span className="shrink-0 opacity-90">{code}</span>}
    </div>
    <div className="pass-body">
      <div className="pass-main">{main}</div>
      <div className="pass-tear" aria-hidden />
      <div className="pass-stub">{stub}</div>
    </div>
  </Tag>
);

/** a small label / value pair, the way a boarding pass prints its fields */
export const PassField = ({ k, v, className }: { k: ReactNode; v: ReactNode; className?: string }) => (
  <div className={cn("min-w-0", className)}>
    <div className="label">{k}</div>
    <div className="font-display text-[19px] font-bold uppercase leading-tight truncate">{v}</div>
  </div>
);

export default Pass;
