import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

interface CloudAnimationProps {
  className?: string;
}

const CloudAnimation = ({ className }: CloudAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    // Cloud particles
    const particles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      opacity: number;
      blur: number;
    }[] = [];
    
    // Tech icons
    const icons: {
      x: number;
      y: number;
      size: number;
      rotation: number;
      rotationSpeed: number;
      image: HTMLImageElement;
      opacity: number;
      speed: number;
    }[] = [];
    
    // Load tech icons
    const iconSources = [
      '/aws-icon.svg', 
      '/docker-icon.svg', 
      '/kubernetes-icon.svg',
      '/terraform-icon.svg'
    ];
    
    iconSources.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        icons.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 15 + Math.random() * 20,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() * 0.02) - 0.01,
          image: img,
          opacity: 0.1 + Math.random() * 0.2,
          speed: 0.2 + Math.random() * 0.4
        });
      };
    });
    
    // Create cloud particles
    const createParticles = () => {
      const particleCount = Math.floor(window.innerWidth / 15);
      const isDark = theme === 'dark';
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 8 + 2,
          color: isDark ? `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})` : `rgba(14, 165, 233, ${Math.random() * 0.08 + 0.03})`,
          speed: Math.random() * 0.7 + 0.2,
          opacity: 0.1 + Math.random() * 0.4,
          blur: Math.random() * 5
        });
      }
    };
    
    createParticles();
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw cloud particles
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        if (particle.blur > 0) {
          ctx.shadowBlur = particle.blur;
          ctx.shadowColor = particle.color;
        }
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Move particles from right to left
        particle.x -= particle.speed;
        
        // Reset particles when they go off screen
        if (particle.x < -particle.radius) {
          particle.x = canvas.width + particle.radius;
          particle.y = Math.random() * canvas.height;
        }
      });
      
      // Draw tech icons
      ctx.globalAlpha = 1;
      icons.forEach(icon => {
        ctx.save();
        ctx.translate(icon.x, icon.y);
        ctx.rotate(icon.rotation);
        ctx.globalAlpha = icon.opacity;
        ctx.drawImage(icon.image, -icon.size/2, -icon.size/2, icon.size, icon.size);
        ctx.restore();
        
        // Move icons
        icon.x -= icon.speed;
        icon.rotation += icon.rotationSpeed;
        
        // Reset icons when they go off screen
        if (icon.x < -icon.size) {
          icon.x = canvas.width + icon.size;
          icon.y = Math.random() * canvas.height;
        }
      });
    };
    
    animate();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);
  
  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
};

export default CloudAnimation;