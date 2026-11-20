import { useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSeo } from "@/hooks/useSeo";
import CommandMenu from "@/components/CommandMenu";
import { loadGeo } from "@/lib/visitor";

const EASTER_EGG_PHRASE = "sudoplay";

const Layout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const bufferRef = useRef("");
  useSeo();

  // look the visitor up by IP once, on any page, so prices, times and the
  // contact form all know where they are (a VPN changes it)
  useEffect(() => {
    void loadGeo();
  }, []);

  useEffect(() => {
    // Let visitors know the games exist: on every page load (not on in-app
    // navigation), shortly after landing, gone after 15 seconds at most.
    // Skipped on the Play page itself and for automated browsers (tests, bots).
    if (pathname === "/play" || navigator.webdriver) return;
    const hintTimer = setTimeout(() => {
      toast("Four on-call games are hidden on this site", {
        id: "game-hint",
        description: "Type “sudo play” anywhere, or click Play.",
        duration: 15000,
        action: {
          label: "Play",
          onClick: () => navigate("/play"),
        },
      });
    }, 2500);
    return () => clearTimeout(hintTimer);
    // once per page load, regardless of later navigation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(
      "%c👀 still here?",
      "font-size:14px;font-weight:bold;color:#22C55E;font-family:monospace"
    );
    console.log(
      "%cTry typing it anywhere on this page.",
      "font-size:12px;color:#22C55E;font-family:monospace"
    );

    const isTypingInField = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (isTypingInField(e.target) || e.key.length !== 1) return;
      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(
        -EASTER_EGG_PHRASE.length
      );
      if (bufferRef.current === EASTER_EGG_PHRASE) {
        bufferRef.current = "";
        navigate("/play");
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [navigate]);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CommandMenu />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
