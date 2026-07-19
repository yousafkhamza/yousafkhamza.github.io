import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Home } from "lucide-react";
import CloudAnimation from "@/components/ui/CloudAnimation";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "404 - Page Not Found | Yousaf K Hamza";
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <ThemeProvider defaultTheme="system">
      <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden">
        <CloudAnimation />
        <div className="relative z-10 rounded-2xl border border-border p-10 max-w-md w-full text-center bg-card">
          <h1 className="text-7xl font-extrabold text-yousaf mb-4 font-mono">404</h1>
          <h2 className="text-xl font-bold mb-3">Page not found</h2>
          <p className="text-muted-foreground mb-8 text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yousaf text-white rounded-full text-sm font-semibold hover:bg-yousaf-dark transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default NotFound;
