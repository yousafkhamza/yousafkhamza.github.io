import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

const AnimatedYKHLogo = ({ size = 40 }: { size?: number }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll("path");

    if (paths) {
      paths.forEach((path, index) => {
        const length = path.getTotalLength();

        // Reset path
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;

        // Animate path
        path.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
          duration: 1500,
          delay: index * 150,
          fill: "forwards",
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        });
      });
    }
  }, [theme]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors duration-300"
    >
      {/* Y letter */}
      <path
        d="M30 20L50 50L70 20"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="text-primary"
      />
      <path
        d="M50 50V80"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />

      {/* K letter */}
      <path
        d="M30 20V80"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      <path
        d="M30 50L60 20"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      <path
        d="M30 50L60 80"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />

      {/* H letter */}
      <path
        d="M70 20V80"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      <path
        d="M70 50H90"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
      <path
        d="M90 20V80"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />

      {/* Decorative circle */}
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 4"
        className="text-foreground/30"
      />
    </svg>
  );
};

export default AnimatedYKHLogo;
