import { Link } from "react-router-dom";
import { Github, Linkedin, Gamepad2 } from "lucide-react";
import AnimatedYKHLogo from "./ui/AnimatedYKHLogo";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Experience", to: "/experience" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <AnimatedYKHLogo size={32} />
              <span className="font-bold text-base tracking-tight">Yousaf K Hamza</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Senior DevOps &amp; Platform Engineer building secure, highly available
              multi-cloud platforms across AWS, Azure, and GCP.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
            <div className="flex gap-12 sm:gap-16">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                  Site
                </div>
                <ul className="space-y-2">
                  {navLinks.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className="text-sm text-foreground/70 hover:text-yousaf transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                  Elsewhere
                </div>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://github.com/yousafkhamza"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-yousaf transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" /> GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/yousafkhamza/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-yousaf transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://medium.com/@yousaf.k.hamza"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-yousaf transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 0v24h24V0H0zm19.938 5.686L18.651 6.9a.557.557 0 0 0-.214.534v13.469a.557.557 0 0 0 .214.534l1.257 1.214v.267h-6.324v-.267l1.302-1.264c.128-.128.128-.165.128-.359V9.854l-3.615 9.195h-.488L6.018 9.854v9.154c-.035.271.053.551.247.748l1.695 2.054v.267H2.01v-.267l1.695-2.054a.872.872 0 0 0 .232-.748V8.304a.644.644 0 0 0-.209-.536L2.597 5.686V5.42h5.668l4.394 9.637 3.858-9.637h5.4v.266z" />
                      </svg>
                      Medium
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Catchy standalone badge — deliberately set apart from the plain link lists */}
            <Link
              to="/play"
              className="group shrink-0 flex items-center gap-3 self-start rounded-2xl border border-yousaf/25 bg-gradient-to-br from-yousaf/10 to-transparent px-4 py-3.5 hover:border-yousaf/50 hover:from-yousaf/15 transition-all"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-yousaf/15 text-yousaf group-hover:scale-110 transition-transform shrink-0">
                <Gamepad2 className="w-4.5 h-4.5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-foreground group-hover:text-yousaf transition-colors">
                  On-call for 5 minutes?
                </div>
                <div className="text-xs text-muted-foreground">Play the hidden game →</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {currentYear} Yousaf K Hamza. All rights reserved.</p>
          <p>Based in Dubai, United Arab Emirates 🇦🇪</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
