import { useState, useEffect } from "react";
import AnimatedCard from "@/components/ui/AnimatedCard";

interface SkillCardProps {
  skill: {
    name: string;
    icon: string;
    proficiency: number;
    category: string;
  };
  index: number;
}

const SkillCard = ({ skill, index }: SkillCardProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Animate progress bar
          let progress = 0;
          const increment = skill.proficiency / 50; // 50 frames for smooth animation
          const timer = setInterval(() => {
            progress += increment;
            if (progress >= skill.proficiency) {
              progress = skill.proficiency;
              clearInterval(timer);
            }
            setAnimatedProgress(Math.floor(progress));
          }, 20);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`skill-${index}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [skill.proficiency, index, isVisible]);

  return (
    <AnimatedCard
      id={`skill-${index}`}
      className="glass-card rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 group"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
          <img
            src={skill.icon}
            alt={skill.name}
            className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
            loading="lazy"
          />
        </div>
        <div>
          <h3 className="font-bold text-foreground group-hover:text-yousaf transition-colors">
            {skill.name}
          </h3>
          <p className="text-xs text-foreground/60">{skill.category}</p>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2 mb-1 overflow-hidden">
        <div
          className="bg-gradient-to-r from-yousaf to-yousaf-dark h-2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${animatedProgress}%` }}
        ></div>
      </div>
      <p className="text-right text-sm text-foreground/70 font-medium">
        {animatedProgress}%
      </p>
    </AnimatedCard>
  );
};

export default SkillCard;
