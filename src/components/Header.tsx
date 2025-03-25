import { useState, useEffect } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { cn } from "@/lib/utils";
import { Moon, Sun, Menu, X } from "lucide-react";
import AnimatedYKHLogo from "./ui/AnimatedYKHLogo";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled
          ? "backdrop-blur-lg bg-white/70 dark:bg-black/30 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a
          href="#home"
          className="text-xl font-medium text-foreground flex items-center space-x-2"
        >
          <AnimatedYKHLogo size={70} />
          <span className="hidden sm:inline-block font-rockybilly text-5xl">
            Yousaf K Hamza
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {["About", "Experience", "Skills", "Certifications", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-foreground/80 hover:text-yousaf transition-colors relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yousaf transition-all duration-300 group-hover:w-full"></span>
              </a>
            )
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden rounded-full p-2 hover:bg-accent transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-lg bg-white/90 dark:bg-black/90 border-t border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {["About", "Experience", "Skills", "Certifications", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-foreground/80 hover:text-yousaf transition-colors py-2"
                  onClick={toggleMobileMenu}
                >
                  {item}
                </a>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
