import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

interface CloudAnimationProps {
  className?: string;
}

// A quiet, drifting network-of-nodes background — evokes an infra/topology
// diagram rather than literal clouds, to match the terminal-inspired theme.
const CloudAnimation = ({ className }: CloudAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const isDark = theme === "dark";
    const nodeColor = isDark ? "34, 197, 94" : "22, 163, 74"; // green
    const accentColor = "245, 158, 11"; // amber, used sparingly
    const lineOpacity = isDark ? 0.09 : 0.06;
    const nodeOpacity = isDark ? 0.4 : 0.28;
    const linkDistance = 130;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      accent: boolean;
    }

    const nodes: Node[] = [];
    const nodeCount = Math.min(45, Math.floor((canvas.width * canvas.height) / 26000));

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.5 + 1,
        accent: Math.random() < 0.08,
      });
    }

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connecting lines between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < linkDistance) {
            const opacity = lineOpacity * (1 - dist / linkDistance);
            ctx.strokeStyle = `rgba(${nodeColor}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${node.accent ? accentColor : nodeColor}, ${nodeOpacity})`;
        ctx.fill();

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
};

export default CloudAnimation;
