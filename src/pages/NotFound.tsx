import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Home } from "lucide-react";
import AnimatedCard from "@/components/ui/AnimatedCard";
import CloudAnimation from "@/components/ui/CloudAnimation";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "404 - Page Not Found | yousaf Mohamed";

    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <CloudAnimation />

        <AnimatedCard className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-8xl font-bold text-yousaf mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-foreground/70 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <a
            href="/"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-yousaf text-white rounded-lg hover:bg-yousaf-dark transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </a>
        </AnimatedCard>
      </div>
    </ThemeProvider>
  );
};

export default NotFound;
