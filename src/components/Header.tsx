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
    <div className="bg-strip text-strip-dim">
      <div className="wrap h-9 flex items-center justify-between gap-4 font-display text-[14px] font-semibold uppercase tracking-[0.06em]">
        <span className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-strip-ok shrink-0" />
          <span className="truncate">
            <span className="text-strip-ok">Open to new roles</span>
            <span className="hidden sm:inline"> · Senior DevOps, DevSecOps, Platform, SRE</span>
          </span>
        </span>
        <span className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline">{profile.residency}</span>
          <span className="hidden md:inline opacity-40">|</span>
          <span className="text-strip-fg">
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
          "bg-sign text-[hsl(0_0%_7%)] border-b border-[hsl(0_0%_0%/0.18)] transition-shadow",
          scrolled && "shadow-[0_8px_24px_-12px_hsl(0_0%_0%/0.35)]"
        )}
      >
        <div className="wrap h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="Home">
            <span className="w-10 h-10 grid place-items-center bg-[hsl(0_0%_7%)] text-[hsl(48_100%_50%)] font-display font-bold text-[19px] rounded-lg">
              YH
            </span>
            <span className="font-display text-[23px] font-bold uppercase tracking-[0.02em] leading-none">{profile.name}</span>
            <span className="hidden lg:inline font-display text-[15px] font-semibold uppercase tracking-[0.05em] opacity-70 group-hover:opacity-100 transition-opacity">
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
                    "px-3 py-2 font-display text-[18px] font-bold uppercase tracking-[0.04em] rounded-lg transition-colors",
                    isActive ? "bg-[hsl(0_0%_7%)] text-[hsl(48_100%_50%)]" : "hover:bg-[hsl(0_0%_7%/0.1)]"
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
              className="hidden lg:inline-flex items-center gap-2 h-10 pl-3 pr-2 rounded-lg border-[1.5px] border-[hsl(0_0%_7%/0.7)] text-[14px] font-semibold hover:bg-[hsl(0_0%_7%/0.1)] transition-colors"
              aria-label="Search the site"
            >
              <Search className="w-3.5 h-3.5" /> Search
              <kbd className="font-display text-[13px] font-bold px-1.5 py-0.5 rounded-lg bg-[hsl(0_0%_7%)] text-[hsl(48_100%_50%)]">Ctrl K</kbd>
            </button>
            <button
              onClick={openCommandMenu}
              className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-[hsl(0_0%_7%/0.1)]"
              aria-label="Search the site"
            >
              <Search className="w-4 h-4" />
            </button>
            <a href={profile.resume} target="_blank" rel="noopener" className="hidden sm:inline-flex btn h-10 px-4 text-[15px] bg-[hsl(0_0%_7%)] text-[hsl(48_100%_50%)] hover:bg-[hsl(0_0%_20%)]">
              <FileDown className="w-4 h-4" /> Resume
            </a>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-[hsl(0_0%_7%/0.1)] transition-colors"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-[hsl(0_0%_7%/0.1)]"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t-2 border-[hsl(0_0%_7%)] bg-background text-foreground" aria-label="Mobile">
            <div className="wrap py-3 flex flex-col">
              {[{ label: "Home", to: "/" }, ...navLinks].map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end
                  className={({ isActive }) =>
                    cn("py-3 font-display text-[22px] font-bold uppercase border-b border-border", isActive ? "text-yousaf" : "text-foreground")
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
