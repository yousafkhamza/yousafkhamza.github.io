import { useEffect } from "react";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Volunteering from "@/components/Volunteering";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CloudAnimation from "@/components/ui/CloudAnimation";

const Index = () => {
  useEffect(() => {
    // Update document title
    document.title = "Yousaf K Hamza | DevOps Engineer";

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";

    // Handle hash navigation on page load
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    };

    window.addEventListener("load", handleHashNavigation);

    return () => {
      window.removeEventListener("load", handleHashNavigation);
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <CloudAnimation />
        <Header />
        <main className="overflow-x-hidden">
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Education />
          <Volunteering />
          <Certifications />
          <Contact />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
