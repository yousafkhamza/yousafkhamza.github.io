import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileDown, Gamepad2, Mail, Moon, FolderGit2, Linkedin } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "@/components/ui/ThemeProvider";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

/** Ctrl/⌘ + K anywhere: jump to a page, a section, a project or an action */
export const useCommandMenu = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-menu", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-menu", onOpen);
    };
  }, []);
  return { open, setOpen };
};

export const openCommandMenu = () => window.dispatchEvent(new Event("open-command-menu"));

const CommandMenu = () => {
  const { open, setOpen } = useCommandMenu();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const run = (fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 0);
  };
  const go = (to: string) => run(() => navigate(to));
  const section = (id: string) =>
    run(() => {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
    });

  const isDark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Where to? Try “eks”, “resume” or “game”" />
      <CommandList>
        <CommandEmpty>Nothing matches. Try a project name or a page.</CommandEmpty>
        <CommandGroup heading="Pages">
          {[
            ["Home", "/"],
            ["Experience", "/experience"],
            ["Projects", "/projects"],
            ["Services: career guidance, resume review", "/services"],
            ["Contact", "/contact"],
          ].map(([label, to]) => (
            <CommandItem key={to} value={`page ${label}`} onSelect={() => go(to)}>
              <ArrowRight className="mr-2 h-4 w-4" /> {label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="On the home page">
          {[
            ["Release history (career)", "career"],
            ["Numbers from production (impact)", "impact"],
            ["Stack and skills", "stack"],
            ["Certifications and education", "credentials"],
          ].map(([label, id]) => (
            <CommandItem key={id} value={`section ${label}`} onSelect={() => section(id)}>
              <ArrowRight className="mr-2 h-4 w-4" /> {label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Do">
          <CommandItem value="download resume pdf cv" onSelect={() => run(() => window.open(profile.resume, "_blank"))}>
            <FileDown className="mr-2 h-4 w-4" /> Download resume (PDF)
          </CommandItem>
          <CommandItem
            value="copy email address contact"
            onSelect={() => run(() => navigator.clipboard?.writeText(profile.email))}
          >
            <Mail className="mr-2 h-4 w-4" /> Copy email address
            <CommandShortcut>{profile.email}</CommandShortcut>
          </CommandItem>
          <CommandItem value="linkedin profile" onSelect={() => run(() => window.open(profile.linkedin, "_blank"))}>
            <Linkedin className="mr-2 h-4 w-4" /> Open LinkedIn
          </CommandItem>
          <CommandItem value="toggle theme dark light mode" onSelect={() => run(() => setTheme(isDark ? "light" : "dark"))}>
            <Moon className="mr-2 h-4 w-4" /> Switch to {isDark ? "light" : "dark"} theme
          </CommandItem>
          <CommandItem value="play game on-call sudo play" onSelect={() => go("/play")}>
            <Gamepad2 className="mr-2 h-4 w-4" /> Play the on-call games
            <CommandShortcut>sudo play</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem
              key={p.id}
              value={`project ${p.title} ${p.categories.join(" ")} ${p.tags.join(" ")}`}
              onSelect={() => run(() => window.open(p.demo ?? p.github, "_blank"))}
            >
              <FolderGit2 className="mr-2 h-4 w-4" /> {p.title}
              <CommandShortcut>{p.categories.join(" · ").toLowerCase()}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandMenu;
