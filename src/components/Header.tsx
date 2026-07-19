import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/components/ui/ThemeProvider";
import { cn } from "@/lib/utils";
import { Moon, Sun, Menu, X } from "lucide-react";
import AnimatedYKHLogo from "./ui/AnimatedYKHLogo";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Experience", to: "/experience" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "backdrop-blur-lg bg-background/85 border-border"
          : "backdrop-blur-lg bg-background/60 border-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 min-w-0 flex-shrink overflow-hidden"
        >
          <AnimatedYKHLogo size={34} />
          <span className="font-bold text-base sm:text-lg tracking-tight truncate">
            Yousaf K Hamza
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "px-3.5 py-2 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "text-yousaf bg-yousaf/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/60"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener"
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold bg-yousaf text-white rounded-full hover:bg-yousaf-dark transition-colors"
          >
            Resume
          </a>

          <button
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-full p-2 hover:bg-accent transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 backdrop-blur-lg bg-background/95 border-t border-border animate-fade-in shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "text-base font-medium py-3 px-3 rounded-lg transition-colors",
                  pathname === item.to
                    ? "text-yousaf bg-yousaf/10"
                    : "text-foreground/80 hover:bg-accent/50"
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener"
              className="mt-2 text-center px-4 py-2.5 text-sm font-semibold bg-yousaf text-white rounded-full"
            >
              Download Resume
            </a>

            <Link
              to="/play"
              className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-sm text-muted-foreground hover:text-yousaf transition-colors px-3"
            >
              <span>🎮 On-call for five minutes?</span>
              <span className="text-xs font-mono text-yousaf">Play →</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
