import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import AnimatedCard from "@/components/ui/AnimatedCard";

const typewriterTexts = [
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Platform Engineer",
  "DevSecOps Enthusiast",
];

const Hero = () => {
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const text = typewriterTexts[typewriterIndex];
    let timer: NodeJS.Timeout;

    if (isTyping) {
      if (typewriterText.length < text.length) {
        timer = setTimeout(() => {
          setTypewriterText(text.substring(0, typewriterText.length + 1));
        }, 100);
      } else {
        setIsTyping(false);
        timer = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (typewriterText.length > 0) {
        timer = setTimeout(() => {
          setTypewriterText(
            typewriterText.substring(0, typewriterText.length - 1)
          );
        }, 50);
      } else {
        setIsTyping(true);
        setTypewriterIndex((typewriterIndex + 1) % typewriterTexts.length);
      }
    }

    return () => clearTimeout(timer);
  }, [typewriterText, typewriterIndex, isTyping]);

  return (
    <section
      id="home"
      className="min-h-screen relative flex flex-col justify-center items-center pt-16 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-yousaf/5 to-transparent dark:from-yousaf-dark/10 z-0"></div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center">
        <AnimatedCard className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-center">
          <div className="stagger-item stagger-delay-1 mb-6 relative inline-block">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-lg mx-auto">
              <img
                src="https://avatars.githubusercontent.com/u/47160283?v=4"
                alt="Yousaf K H"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="stagger-item stagger-delay-2 text-4xl md:text-5xl lg:text-6xl font-rockybilly text-foreground mb-4">
            Yousaf K H
          </h1>

          <div className="stagger-item stagger-delay-3 h-10 mb-6">
            <span className="text-xl md:text-2xl text-yousaf font-medium inline-flex items-center">
              {typewriterText}
              <span className="w-0.5 h-6 bg-yousaf ml-1 animate-pulse-slow"></span>
            </span>
          </div>

          <p className="stagger-item stagger-delay-4 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8">
            Transforming cloud infrastructure with innovative DevOps solutions.
            Specializing in AWS, Terraform, Kubernetes, and CI/CD automation.
          </p>

          <div className="stagger-item stagger-delay-5 flex items-center justify-center space-x-4 mb-8">
            <a
              href="#about"
              className="px-6 py-3 bg-yousaf text-white rounded-lg shadow-lg hover:bg-yousaf-dark transition-colors"
            >
              Discover More
            </a>
            <a
              href="#contact"
              className="px-6 py-3 bg-transparent border border-yousaf text-yousaf rounded-lg hover:bg-yousaf/10 transition-colors"
            >
              Get in Touch
            </a>
          </div>

          <div className="stagger-item stagger-delay-6 flex items-center justify-center space-x-6">
            <a
              href="https://github.com/yousafkhamza"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-yousaf transition-colors"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/yousafkhamza/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-yousaf transition-colors"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="https://medium.com/@yousaf.k.hamza"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-yousaf transition-colors"
              aria-label="Medium"
            >
              Medium
            </a>
          </div>
        </AnimatedCard>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-float">
        <a
          href="#about"
          className="text-foreground/60 hover:text-yousaf transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
