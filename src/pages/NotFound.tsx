import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const NotFound = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = "Page not found · Yousaf Hamza";
  }, []);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background text-foreground flex items-center">
        <div className="wrap max-w-[640px]">
          <div className="eyebrow">Flight not found</div>
          <h1 className="font-display text-[52px] sm:text-[72px] font-bold uppercase leading-[0.9] mb-6">This gate is closed.</h1>
          <pre className="panel p-6 font-code text-[13.5px] leading-[1.8] overflow-x-auto">
            <span className="text-muted-foreground">$ curl -I https://yousafkhamza.github.io{pathname}</span>
            {"\n"}HTTP/2 <span className="text-bad">404</span>
            {"\n"}x-reason: no such route
            {"\n"}x-hint: it was probably renamed during the redesign
          </pre>
          <Link to="/" className="btn-primary mt-6">
            Back to the home page
          </Link>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default NotFound;
