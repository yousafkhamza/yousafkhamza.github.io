
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  intensity?: number;
}

const AnimatedCard = ({ 
  className, 
  children, 
  intensity = 10, 
  ...props 
}: AnimatedCardProps) => {
  // Floating/scale/rotation disabled for Hero section: static card
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = 0;
  const rotateY = 0;
  const scale = 1;

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{
        transform: "none",
        transition: "none",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
