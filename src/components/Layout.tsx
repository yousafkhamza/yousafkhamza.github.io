import { useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const EASTER_EGG_PHRASE = "sudoplay";

const Layout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const bufferRef = useRef("");

  useEffect(() => {
    // Let visitors actually know the game exists — once per browser session,
    // shortly after they land, so it doesn't interrupt the first paint.
    const alreadyHinted = sessionStorage.getItem("game-hint-shown");
    if (!alreadyHinted && pathname !== "/play") {
      const hintTimer = setTimeout(() => {
        toast("🎮 There's a hidden game on this site", {
          description: "An on-call incident-response game. Type “sudo play” anywhere, or just click Play.",
          duration: 9000,
          action: {
            label: "Play",
            onClick: () => navigate("/play"),
          },
        });
        sessionStorage.setItem("game-hint-shown", "true");
      }, 2500);
      return () => clearTimeout(hintTimer);
    }
    // Only ever fire this once per session, regardless of later navigation.
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
    <ThemeProvider defaultTheme="system">
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
