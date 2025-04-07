import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

type Command = {
  command: string;
  output: string;
  delay?: number;
};

const defaultCommands: Command[] = [
  {
    command: "$ whoami",
    output: "yousaf_k_hamza",
    delay: 800,
  },
  {
    command: "$ ls -l",
    output: `total 8
-rw-r--r-- 1 ykh ykh  4096 Jun 1 1:00 profile
-rw-r--r-- 1 ykh ykh  2048 Jun 1 1:00 skills
-rw-r--r-- 1 ykh ykh  3072 Jun 1 1:00 projects
-rw-r--r-- 1 ykh ykh  1024 Jun 1 1:00 certs`,
    delay: 1000,
  },
  {
    command: "cat profile",
    output: `📋 DevOps Engineer Profile
----------------------------
🚀 Name: Yousaf K Hamza
🌐 Specialization: Cloud with DevSecOps
🏆 Mission: Be a DevSecOps professional

💡 Core Expertise:
  - Cloud Architecture & Optimization
  - Kubernetes & Container Orchestration
  - CI/CD Pipeline Engineering
  - Infrastructure as Code (IaC)
  - Security & Compliance Automation`,
    delay: 1500,
  },
  {
    command: "cat skills",
    output: `🔧 Technical Arsenal:
  [Cloud Platforms]
  ◉ AWS     ◉ Azure    ◉ GCP
  
  [DevOps Tools]
  ◉ Terraform   ◉ Kubernetes    ◉ Docker
  ◉ Jenkins     ◉ GitLab CI     ◉ GitHub Actions
  ◉ CircleCI    ◉ ArgoCD        ◉ HAProxy 
  ◉ Vault       ◉ NGINX         ◉ ServiceNow       
  ◉ Jira        ◉ Confluence
  
  [Monitoring & Observability]
  ◉ Prometheus  ◉ Grafana       ◉ ELK Stack
  ◉ New Relic   ◉ PagerDuty 

  [Scripting & Automation]
  ◉ Python      ◉ Bash          ◉ PowerShell
  ◉ Ansible     ◉ Helm          ◉ Packer
  ◉ CloudFormation

  [Security Tools]
  ◉ Snyk         ◉ Trivy              ◉ Checkov
  ◉ Checkmarx    ◉ SonarQube          ◉ OWASP Tools`,
    delay: 1200,
  },
  {
    command: "cat projects",
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
    command: "cat certs",
    output: `🏅 Professional Certifications:
  ◉ AWS Solutions Architect - Associate
  ◉ Certified Kubernetes Administrator (CKA)
  ◉ HashiCorp Terraform Associate
  ◉ Fundamentals of Ethical Hacking
  ◉ Oracle Cloud Infrastructure Foundations Certified Associate
  ◉ LFS169: GitOps`,
    delay: 1000,
  },
];

const Terminal = ({
  children,
  title = "devops@yousaf:~$",
  commands = defaultCommands,
  height = "600px", // Default height, can be overridden
}: {
  children?: React.ReactNode;
  title?: string;
  commands?: Command[];
  height?: string;
}) => {
  const { theme } = useTheme();
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Command typing and output display logic
  const typeCommandAndOutput = useCallback(() => {
    if (currentCommandIndex >= commands.length || isProcessingCommand) return;

    setIsProcessingCommand(true);
    const currentCommand = commands[currentCommandIndex];
    let commandText = "";
    let outputText = "";
    let commandComplete = false;
    let outputComplete = false;

    // Add newline before new command (except first one)
    if (currentCommandIndex > 0) {
      setDisplayedContent((prev) => `${prev}\n`);
    }

    const typeCommand = () => {
      if (commandText.length < currentCommand.command.length) {
        commandText += currentCommand.command[commandText.length];
        setDisplayedContent(
          (prev) =>
            `${prev}${prev.endsWith("\n") ? title + " " : ""}${
              currentCommand.command[commandText.length - 1]
            }`
        );
        setTimeout(typeCommand, 50);
      } else {
        commandComplete = true;
        // Add a small delay before showing output
        setTimeout(() => {
          setDisplayedContent((prev) => `${prev}\n`);
          setTimeout(typeOutput, 200);
        }, 300);
      }
    };

    const typeOutput = () => {
      if (outputText.length < currentCommand.output.length) {
        outputText += currentCommand.output[outputText.length];
        setDisplayedContent(
          (prev) => `${prev}${currentCommand.output[outputText.length - 1]}`
        );
        setTimeout(typeOutput, outputText.length % 3 === 0 ? 20 : 10); // Variable typing speed for more natural feel
      } else {
        outputComplete = true;
        // Move to next command after delay
        setTimeout(() => {
          setCurrentCommandIndex((prev) => prev + 1);
          setIsTyping(true);
          setIsProcessingCommand(false);
        }, currentCommand.delay || 1000);
      }
    };

    // Start typing the command
    typeCommand();
  }, [currentCommandIndex, commands, title, isProcessingCommand]);

  // Trigger typing for each command
  useEffect(() => {
    if (isTyping && currentCommandIndex < commands.length) {
      typeCommandAndOutput();
      setIsTyping(false);
    }
  }, [isTyping, currentCommandIndex, commands.length, typeCommandAndOutput]);

  // Determine background and text color based on theme
  const bgColor = theme === "dark" ? "bg-black" : "bg-gray-900";
  const textColor = "text-green-400";

  return (
    <div className="terminal-container rounded-lg overflow-hidden border border-foreground/10 shadow-lg w-full">
      <div className="terminal-header flex items-center p-3 bg-gray-800 text-white">
        <div className="terminal-buttons flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="terminal-title text-sm font-mono">{title}</div>
      </div>
      <div
        className={`terminal-content p-4 font-mono text-sm overflow-y-auto ${bgColor} ${textColor}`}
        style={{
          height: height,
          maxHeight: height,
        }}
      >
        <div className="whitespace-pre-wrap">
          {displayedContent}
          <span
            className={`inline-block w-2 h-5 bg-green-400 ml-1 ${
              cursorVisible ? "opacity-100" : "opacity-0"
            }`}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
