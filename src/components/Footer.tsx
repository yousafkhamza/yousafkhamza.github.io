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
              <span className="font-rockybilly text-xl md:text-3xl">
                Mohamed yousaf
              </span>
              <p className="text-sm text-foreground/60 mt-1">
                DevOps Engineer • Cloud Specialist • Cloud Engineer
              </p>
            </div>
          </div>

          <div className="flex items-center text-foreground/70">
            <p className="text-sm">
              © {currentYear} • Crafted with
              <Heart className="inline-block w-4 h-4 mx-1 text-yousaf" />
              in Kerala &amp; Dubai
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
