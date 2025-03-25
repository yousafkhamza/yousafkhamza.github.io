import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

type Command = {
  command: string;
  output: string;
  delay?: number;
};

const defaultCommands: Command[] = [
  {
    command: "whoami",
    output: "yousaf_k_hamza",
    delay: 800,
  },
  {
    command: "cat ~/devops-profile",
    output: `📋 DevOps Engineer Profile
----------------------------
🚀 Name: Yousaf K Hamza
🌐 Specialization: Cloud-Native DevSecOps
🏆 Mission: Transforming Infrastructure as Code

💡 Core Expertise:
  - Cloud Architecture & Optimization
  - Kubernetes & Container Orchestration
  - CI/CD Pipeline Engineering
  - Infrastructure as Code (IaC)
  - Security & Compliance Automation`,
    delay: 1500,
  },
  {
    command: "showcase-skills",
    output: `🔧 Technical Arsenal:
  [Cloud Platforms]
  ◉ AWS     ◉ Azure    ◉ GCP
  
  [DevOps Tools]
  ◉ Terraform   ◉ Kubernetes    ◉ Docker
  ◉ Jenkins     ◉ GitLab CI     ◉ GitHub Actions
  
  [Monitoring & Observability]
  ◉ Prometheus  ◉ Grafana       ◉ ELK Stack
  
  [Security Tools]
  ◉ Snyk              ◉ Trivy
  ◉ SonarQube         ◉ OWASP Tools`,
    delay: 1200,
  },
  {
    command: "recent-projects",
    output: `🚧 Recent Projects:
1. 🌐 NGINX Gateway for EKS & Hybrid Traffic Routing
    • Implemented NGINX gateway in EKS to route traffic between on-prem, AWS, and Kubernetes resources
    • Enabled monitoring with Prometheus and Grafana for visibility and performance insights
    • Optimized traffic flow for seamless hybrid cloud integration

2. 🔒 DevSecOps CI/CD Pipeline
   • Created end-to-end automated security scanning
   • Integrated vulnerability assessment
   • Achieved 99.9% compliance automation

3. 🤖 Infrastructure Automation Toolkit
   • Developed reusable Terraform modules
   • Created cross-cloud deployment strategies
   • Standardized infrastructure provisioning`,
    delay: 1000,
  },
  {
    command: "certifications",
    output: `🏅 Professional Certifications:
  ◉ AWS Solutions Architect - Associate
  ◉ Certified Kubernetes Administrator (CKA)
  ◉ HashiCorp Terraform Associate`,
    delay: 1000,
  },
];

const Terminal = ({
  children,
  title = "devops@yousaf:~$",
  commands = defaultCommands,
}: {
  children?: React.ReactNode;
  title?: string;
  commands?: Command[];
}) => {
  const { theme } = useTheme();
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Command typing and output display logic
  const typeCommandAndOutput = useCallback(() => {
    if (currentCommandIndex >= commands.length) return;

    const currentCommand = commands[currentCommandIndex];
    let commandPosition = 0;
    let isCommandTyped = false;

    const typingInterval = setInterval(() => {
      // Typing command
      if (!isCommandTyped && commandPosition < currentCommand.command.length) {
        setDisplayedContent(
          (prev) =>
            prev +
            (commandPosition === 0 ? "\n" + title + " " : "") +
            currentCommand.command.charAt(commandPosition)
        );
        commandPosition++;
      }
      // Pause briefly after typing command
      else if (!isCommandTyped) {
        isCommandTyped = true;
        commandPosition = 0;

        // Brief pause, then display output
        setTimeout(() => {
          setDisplayedContent((prev) => prev + "\n" + currentCommand.output);

          // Move to next command after delay
          setTimeout(() => {
            setCurrentCommandIndex((prev) => prev + 1);
            setIsTyping(true);
            clearInterval(typingInterval);
          }, currentCommand.delay || 1000);
        }, 500);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentCommandIndex, commands, title]);

  // Trigger typing for each command
  useEffect(() => {
    if (!isTyping || currentCommandIndex >= commands.length) return;

    const typingTimeout = setTimeout(() => {
      typeCommandAndOutput();
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(typingTimeout);
  }, [currentCommandIndex, isTyping, typeCommandAndOutput]);

  // Determine background and text color based on theme
  const bgColor = theme === "dark" ? "bg-black" : "bg-gray-900";
  const textColor = "text-green-400";

  return (
    <div className="terminal-container rounded-lg overflow-hidden border border-foreground/10 shadow-lg">
      <div className="terminal-header flex items-center p-3 bg-gray-800 text-white">
        <div className="terminal-buttons flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="terminal-title text-sm font-mono">{title}</div>
      </div>
      <div
        className={`terminal-content p-4 font-mono text-sm overflow-auto ${bgColor} ${textColor}`}
      >
        <div className="whitespace-pre-line">
          {displayedContent}
          <span
            className={`cursor ${cursorVisible ? "opacity-100" : "opacity-0"}`}
          >
            ▮
          </span>
        </div>
      </div>
      <style>
        {`
        .terminal-container {
          backdrop-filter: blur(16px);
          transition: all 0.3s ease;
        }
        .terminal-content {
          min-height: 250px;
          max-height: 50vh;
        }
        @media (max-width: 768px) {
          .terminal-content {
            min-height: 200px;
          }
        }
        .cursor {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        `}
      </style>
    </div>
  );
};

export default Terminal;
