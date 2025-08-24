import { useEffect, useState } from "react";

interface StatItem {
  number: number;
  label: string;
  suffix?: string;
}

const stats: StatItem[] = [
  { number: 7, label: "Years Experience", suffix: "+" },
  { number: 50, label: "Projects Completed", suffix: "+" },
  { number: 3, label: "Certifications", suffix: "+" },
  { number: 99, label: "Uptime SLA", suffix: "%" },
];

const AnimatedStats = () => {
  const [animatedNumbers, setAnimatedNumbers] = useState<number[]>(
    new Array(stats.length).fill(0)
  );

  useEffect(() => {
    const animateNumbers = () => {
      stats.forEach((stat, index) => {
        let current = 0;
        const increment = stat.number / 50; // 50 frames for smooth animation
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.number) {
            current = stat.number;
            clearInterval(timer);
          }
          setAnimatedNumbers((prev) => {
            const newNumbers = [...prev];
            newNumbers[index] = Math.floor(current);
            return newNumbers;
          });
        }, 30);
      });
    };

    // Start animation after a short delay
    const startTimer = setTimeout(animateNumbers, 1000);

    return () => {
      clearTimeout(startTimer);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-yousaf mb-2">
            {animatedNumbers[index]}
            {stat.suffix}
          </div>
          <div className="text-sm md:text-base text-foreground/70 font-medium">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedStats;
