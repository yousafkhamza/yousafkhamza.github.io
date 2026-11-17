import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X, FileDown, Search } from "lucide-react";
import { openCommandMenu } from "@/components/CommandMenu";
import { useTheme } from "@/components/ui/ThemeProvider";
import { cn } from "@/lib/utils";
import { profile } from "@/data/profile";
import { useClock } from "@/hooks/useClock";

const navLinks = [
  { label: "Experience", to: "/experience" },
  { label: "Projects", to: "/projects" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

/** thin line above the nav: the three things a recruiter checks first */
const StatusStrip = () => {
  const time = useClock(profile.timezone);
  return (
    <div className="border-b border-border bg-secondary/60">
      <div className="wrap h-8 flex items-center justify-between gap-4 font-mono text-[11.5px] text-muted-foreground">
        <span className="flex items-center gap-2 min-w-0">
          <span className="dot shrink-0" />
          <span className="truncate">
            <span className="text-foreground">Open to new roles</span>
            <span className="hidden sm:inline"> · Senior DevOps, Platform, SRE</span>
          </span>
        </span>
        <span className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline">{profile.residency}</span>
          <span className="hidden md:inline text-border">|</span>
          <span>
            Dubai {time} <span className="hidden sm:inline">GMT+4</span>
          </span>
        </span>
      </div>
    </div>
  );
};

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark =
    theme === "dark" ||
    (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header className="sticky top-0 z-50">
      <StatusStrip />
      <div
        className={cn(
          "bg-background/95 backdrop-blur-sm border-b transition-colors",
          scrolled ? "border-border" : "border-transparent"
        )}
      >
        <div className="wrap h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-baseline gap-2 group" aria-label="Home">
            <span className="text-[17px] font-semibold tracking-[-0.01em]">{profile.name}</span>
            <span className="hidden lg:inline font-mono text-[12px] text-muted-foreground group-hover:text-yousaf transition-colors">
              devops / platform
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 text-[14.5px] rounded-[4px] transition-colors",
                    isActive ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={openCommandMenu}
              className="hidden lg:inline-flex items-center gap-2 h-9 pl-3 pr-2 rounded-[4px] border border-border bg-card text-[13px] text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
              aria-label="Search the site"
            >
              <Search className="w-3.5 h-3.5" /> Search
              <kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded-[3px] bg-secondary border border-border">Ctrl K</kbd>
            </button>
            <button
              onClick={openCommandMenu}
              className="lg:hidden w-9 h-9 inline-flex items-center justify-center rounded-[4px] hover:bg-secondary"
              aria-label="Search the site"
            >
              <Search className="w-4 h-4" />
            </button>
            <a href={profile.resume} target="_blank" rel="noopener" className="hidden sm:inline-flex btn-primary h-9 px-4 text-[14px]">
              <FileDown className="w-4 h-4" /> Resume
            </a>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="w-9 h-9 inline-flex items-center justify-center rounded-[4px] hover:bg-secondary transition-colors"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-9 h-9 inline-flex items-center justify-center rounded-[4px] hover:bg-secondary"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t border-border bg-background" aria-label="Mobile">
            <div className="wrap py-3 flex flex-col">
              {[{ label: "Home", to: "/" }, ...navLinks].map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end
                  className={({ isActive }) =>
                    cn("py-3 text-[16px] border-b border-border/60", isActive ? "text-yousaf" : "text-foreground")
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <a href={profile.resume} target="_blank" rel="noopener" className="btn-primary mt-4">
                <FileDown className="w-4 h-4" /> Download resume
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
