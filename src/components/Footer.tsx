import { Heart } from "lucide-react";
import AnimatedYKHLogo from "./ui/AnimatedYKHLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-accent relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <AnimatedYKHLogo size={50} />
            <div className="ml-2">
              <span className="font-mono font-bold text-lg md:text-xl tracking-tight">
                <span className="text-yousaf">~/</span>yousaf-k-hamza
              </span>

              <p className="text-sm text-foreground/60 mt-1">
                DevOps Engineer • DevSecOps Engineer • Cloud Engineer • Site
                Reliability Engineer • Platform Engineer
              </p>

              {/* NEW: Technical writing links (SEO + clean UI) */}
              <p className="text-xs text-foreground/50 mt-1">
                Technical writing:
                <a
                  href="https://medium.com/@yousafkhamza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 underline hover:text-foreground"
                >
                  Medium
                </a>
                <span className="mx-1">·</span>
                <a
                  href="https://linkedin.com/in/yousafkhamza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center text-foreground/70">
            <p className="text-sm">
              © {currentYear} • Crafted with
              <Heart className="inline-block w-4 h-4 mx-1 text-yousaf" />
              in Kerala, India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
