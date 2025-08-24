import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";

type Command = {
  command: string;
  output: string;
  delay?: number;
};

type FileSystem = {
  [key: string]: string | FileSystem;
};

const fileSystem: FileSystem = {
  profile: `📋 DevOps Engineer Profile
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

  skills: `🔧 Technical Arsenal:
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
  ◉ Snyk        ◉ Trivy         ◉ Checkov
  ◉ Checkmarx   ◉ SonarQube     ◉ OWASP Tools`,

  projects: `🚧 Recent Projects:
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

  certs: `🏅 Professional Certifications:
  ◉ AWS Solutions Architect - Associate
  ◉ Certified Kubernetes Administrator (CKA)
  ◉ HashiCorp Terraform Associate
  ◉ Fundamentals of Ethical Hacking
  ◉ Oracle Cloud Infrastructure Foundations Certified Associate
  ◉ LFS169: GitOps`,

  contact: `📧 Contact Information:
Email: yousafkhamza@gmail.com
Location: Thrissur, Kerala, India 🇮🇳
LinkedIn: /in/yousafkhamza
GitHub: /yousafkhamza
Phone: +91 77366720639
Portfolio: yousafkhamza.github.io`,

  status: `🚀 System Status Dashboard
╔═══════════════════════════════════════════════════╗
║            DevOps Infrastructure Monitor          ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║ ☁️  Cloud Services:                               ║
║ • AWS Services          [████████████] ✅ HEALTHY ║
║ • Azure Resources       [████████████] ✅ HEALTHY ║
║ • GCP Projects          [████████████] ✅ HEALTHY ║
║                                                   ║
║ 🔧 DevOps Tools:                                  ║
║ • Kubernetes Cluster    [████████████] ✅ RUNNING ║
║ • CI/CD Pipeline        [████████████] ✅ ACTIVE  ║
║ • ArgoCD                [████████████] ✅ SYNCED  ║
║ • Terraform State       [████████████] ✅ SYNCED  ║
║                                                   ║
║ 📊 Monitoring & Security:                         ║
║ • Prometheus/Grafana    [████████████] ✅ ONLINE  ║
║ • ELK Stack             [████████████] ✅ ONLINE  ║
║ • Security Scans        [████████████] ✅ PASSED  ║
║ • Vulnerability Checks  [████████████] ✅ CLEAR   ║
║                                                   ║
║ 📈 Performance Metrics:                           ║
║ • System Uptime: 99.98%                          ║
║ • Active Pods: 47/50                             ║
║ • CPU Usage: 65%                                 ║
║ • Memory Usage: 70%                              ║
║ • Last Deployment: 2 hours ago                   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝`,

  resume: `📄 Resume Download
╔═══════════════════════════════════════════════════╗
║                  RESUME ACCESS                    ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║ 🔗 Direct Download:                              ║
║ → https://yousafkhamza.github.io/resume.pdf      ║
║                                                   ║
║ 📱 QR Code for Mobile:                           ║
║                                                   ║
║   ████████████████████████████████████████        ║
║   ██                                    ██        ║
║   ██  ██████  ████  ██████████  ██████  ██        ║
║   ██  ██  ██    ██  ██      ██  ██  ██  ██        ║
║   ██  ██████  ██████████████████████████  ██        ║
║   ██  ██████  ██████████████████████████  ██        ║
║   ██  ██  ██  ██  ████    ████  ██  ██  ██        ║
║   ██  ██████  ████  ██████████  ██████  ██        ║
║   ██                                    ██        ║
║   ████████████████████████████████████████        ║
║                                                   ║
║ � Scan with phone camera or use direct link     ║
║ 📧 Contact: yousaf.k.hamza@gmail.com             ║
║                                                   ║
╚═══════════════════════════════════════════════════╝`,

  github: `🐙 GitHub Statistics
╔═══════════════════════════════════════════════════╗
║              @yousafkhamza Profile                ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║ 📊 Repository Stats:                             ║
║ • Public Repositories: 50+                       ║
║ • Total Stars Earned: 200+                       ║
║ • Followers: 150+    • Following: 100+           ║
║                                                   ║
║ 💻 Language Distribution:                        ║
║                                                   ║
║ Python     ████████████████████████░░░░░░  80%   ║
║ Shell      ██████████████░░░░░░░░░░░░░░░░░░  35%   ║
║ YAML       ████████░░░░░░░░░░░░░░░░░░░░░░░░  25%   ║
║ Dockerfile ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░  15%   ║
║ JavaScript ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  10%   ║
║                                                   ║
║ 🚀 Notable Projects:                             ║
║ • Kubernetes deployment automation                ║
║ • CI/CD pipeline templates                       ║
║ • Infrastructure monitoring tools                ║
║                                                   ║
║ 🔗 Visit: https://github.com/yousafkhamza        ║
║                                                   ║
╚═══════════════════════════════════════════════════╝`,

  ".secret": `🎉 Congratulations! You found the hidden file! 🎉

🕵️ You're clearly someone who knows their way around a terminal!

🌟 Easter Egg Message:
"The best way to find out if you can trust somebody 
is to trust them." - Ernest Hemingway

💡 Fun DevOps Fact:
Did you know? The term "DevOps" was coined in 2009, 
but the practices have been around much longer!

🚀 Keep exploring, keep learning, and remember:
"There are only 10 types of people in the world:
those who understand binary and those who don't!" 😄

Thanks for being curious! 
- Yousaf K Hamza`,

  devops: {
    kubernetes: `⚡ Kubernetes Expertise:
- Cluster management and optimization
- Pod autoscaling and resource management
- Service mesh implementation (Istio)
- Helm chart development
- Multi-cluster deployments`,

    terraform: `🏗️ Infrastructure as Code:
- Multi-cloud resource provisioning
- State management and remote backends
- Module development and reusability
- Workspace management
- Policy as code implementation`,

    monitoring: `📊 Monitoring Stack:
- Prometheus & Grafana dashboards
- ELK stack for log aggregation
- APM with New Relic
- Custom metrics and alerting
- SRE best practices implementation`,

    ".devops": `🔒 Hidden DevOps Secrets 🔒

🎯 Advanced DevOps Tips:
1. Always use Infrastructure as Code
2. Monitor everything, alert on what matters
3. Automate the boring stuff
4. Fail fast, learn faster
5. Security is everyone's responsibility

🧠 Pro Tips:
• Use GitOps for deployment strategies
• Implement proper observability (logs, metrics, traces)
• Practice chaos engineering
• Document your runbooks
• Never deploy on Fridays! 😅

🏆 DevOps Zen:
"You build it, you run it, you own it!"`,
  },
};

const defaultCommands: Command[] = [
  {
    command: "$ whoami",
    output: "yousaf",
    delay: 800,
  },
  {
    command: "$ pwd",
    output: "/home/yousaf",
    delay: 500,
  },
  {
    command: "$ ls -la",
    output: `total 24
drwxr-xr-x 3 yousaf yousaf 4096 Aug 24 10:30 .
drwxr-xr-x 3 yousaf yousaf 4096 Aug 24 10:30 ..
-rw-r--r-- 1 yousaf yousaf  512 Aug 24 10:30 profile
-rw-r--r-- 1 yousaf yousaf  1024 Aug 24 10:30 skills
-rw-r--r-- 1 yousaf yousaf  2048 Aug 24 10:30 projects
-rw-r--r-- 1 yousaf yousaf  256 Aug 24 10:30 certs
-rw-r--r-- 1 yousaf yousaf  128 Aug 24 10:30 contact
drwxr-xr-x 2 yousaf yousaf 4096 Aug 24 10:30 devops

Type 'help' for available commands.`,
    delay: 1000,
  },
];

const Terminal = ({
  children,
  title = "devops@yousaf:~$",
  commands = defaultCommands,
  height = "500px", // Reduced height for better proportion
  interactive = false,
}: {
  children?: React.ReactNode;
  title?: string;
  commands?: Command[];
  height?: string;
  interactive?: boolean;
}) => {
  const { theme } = useTheme();
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);
  const [currentPath, setCurrentPath] = useState("/home/yousaf");
  const [userInput, setUserInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [interactiveOutput, setInteractiveOutput] = useState("");
  const [sessionStart] = useState(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (terminalRef.current && interactive) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [interactiveOutput, interactive]);

  // Interactive mode functions
  const getFileContent = (path: string): string => {
    const parts = path.split("/").filter((p) => p);
    let current: any = fileSystem;

    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return `cat: ${path}: No such file or directory`;
      }
    }

    return typeof current === "string"
      ? current
      : `cat: ${path}: Is a directory`;
  };

  const listDirectory = (path: string = "", flags: string[] = []): string => {
    const parts = path.split("/").filter((p) => p);
    let current: any = fileSystem;

    // If path is provided, navigate to it
    if (path) {
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part];
        } else {
          return `ls: cannot access '${path}': No such file or directory`;
        }
      }
    } else {
      // Use current directory context
      if (currentPath === "/home/yousaf/devops") {
        current = fileSystem.devops;
      }
    }

    if (typeof current === "object") {
      let items = Object.keys(current).map((key) => {
        const item = current[key];
        return typeof item === "object" ? `${key}` : key;
      });

      // Show hidden files only with -a flag
      const showHidden = flags.includes("a");
      if (!showHidden) {
        items = items.filter((item) => !item.startsWith("."));
      }

      // Handle different ls flags
      if (flags.includes("l") || flags.includes("la")) {
        // Long format listing
        const longFormat = items.map((item) => {
          const isDir = typeof current[item] === "object";
          const permissions = isDir ? "drwxr-xr-x" : "-rw-r--r--";
          const size = isDir ? "4096" : Math.floor(Math.random() * 2048 + 512);
          const date = "Aug 24 10:30";
          const displayName = isDir ? `${item}/` : item;
          return `${permissions} 1 yousaf yousaf ${size
            .toString()
            .padStart(4)} ${date} ${displayName}`;
        });

        const total = `total ${items.length * 4}`;
        return [total, ...longFormat].join("\n");
      }

      // Regular ls - add / to directories for better visual distinction
      const displayItems = items.map((item) => {
        const isDir = typeof current[item] === "object";
        return isDir ? `${item}/` : item;
      });

      return displayItems.join("  ");
    }

    return `ls: ${path}: Not a directory`;
  };

  const changeDirectory = (path: string): string => {
    if (path === ".." || path === "../") {
      const pathParts = currentPath.split("/").filter((p) => p);
      if (pathParts.length > 2) {
        // Don't go above /home/yousaf
        pathParts.pop();
        const newPath = "/" + pathParts.join("/");
        setCurrentPath(newPath);
        return "";
      }
      return "cd: permission denied";
    }

    if (path === "devops" || path === "devops/") {
      setCurrentPath("/home/yousaf/devops");
      return "";
    }

    if (path === "~" || path === "" || path === "/home/yousaf") {
      setCurrentPath("/home/yousaf");
      return "";
    }

    // Check if directory exists in file system
    if (fileSystem[path] && typeof fileSystem[path] === "object") {
      setCurrentPath(`/home/yousaf/${path}`);
      return "";
    }

    return `cd: ${path}: No such file or directory`;
  };

  const executeCommand = (cmd: string): string => {
    const trimmedCmd = cmd.trim();
    const parts = trimmedCmd.split(" ");
    const [command, ...args] = parts;

    switch (command) {
      case "help":
        return `Available commands:
  whoami        - Display current user
  pwd           - Show current directory
  ls [options]  - List directory contents
    -l          - Long format
    -a          - Show all files (including hidden)
    -la         - Long format with all files
  cat <file>    - Display file contents
  cd <dir>      - Change directory (.., ~, devops)
  clear         - Clear terminal
  help          - Show this help message
  status        - Show system status dashboard
  github        - Show GitHub statistics
  resume        - Download resume with QR code
  uptime        - Show system uptime
  ps            - Show running processes
  top           - Show process monitor
  echo <text>   - Display text
  date          - Show current date and time

Files available: profile, skills, projects, certs, contact
Directory: devops/ (contains kubernetes, terraform, monitoring)
Hidden files: .secret (use ls -a to see hidden files)

Examples:
  cat profile     - View profile information
  ls -la          - List all files with details
  cd devops       - Enter devops directory
  cd ..           - Go back to parent directory
  cat .secret     - View hidden easter egg
  status          - System monitoring dashboard
  github          - GitHub contribution stats
  resume          - Download resume with QR code

Tips:
  • Use Tab for auto-completion
  • Use ↑/↓ arrow keys for command history
  • Try 'ls -a' in devops folder for hidden files!`;

      case "whoami":
        return "yousaf";

      case "pwd":
        return currentPath;

      case "ls":
        // Parse ls flags
        const flags: string[] = [];
        const pathArgs: string[] = [];

        args.forEach((arg) => {
          if (arg.startsWith("-")) {
            // Handle combined flags like -la
            const flagStr = arg.slice(1);
            flags.push(...flagStr.split(""));
          } else {
            pathArgs.push(arg);
          }
        });

        if (currentPath === "/home/yousaf/devops") {
          return listDirectory("", flags);
        }
        return listDirectory(pathArgs[0], flags);

      case "cat":
        if (!args[0]) return "cat: missing file operand";
        if (currentPath === "/home/yousaf/devops") {
          return getFileContent(`devops/${args[0]}`);
        }
        return getFileContent(args[0]);

      case "cd":
        return changeDirectory(args[0] || "");

      case "clear":
        setInteractiveOutput("");
        setUserInput("");
        // Force scroll to top after clearing
        setTimeout(() => {
          if (terminalRef.current) {
            terminalRef.current.scrollTop = 0;
          }
        }, 10);
        return "";

      case "":
        return "";

      case "exit":
      case "logout":
        return "Use Ctrl+C to exit or just close the tab! 😄";

      case "date":
        return new Date().toLocaleString();

      case "echo":
        return args.join(" ");

      case "status":
        return getFileContent("status");

      case "github":
        return getFileContent("github");

      case "resume":
        return getFileContent("resume");

      case "uptime":
        const uptime = Date.now() - sessionStart;
        const seconds = Math.floor(uptime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        return `System uptime: ${hours}h ${minutes % 60}m ${seconds % 60}s
Load average: 0.15, 0.10, 0.05
Users: 1 (yousaf)
Last login: ${new Date().toLocaleDateString()}`;

      case "ps":
        return `  PID TTY          TIME CMD
    1 pts/0    00:00:01 portfolio
  234 pts/0    00:00:00 react-app
  456 pts/0    00:00:00 vite-dev
  789 pts/0    00:00:00 bash`;

      case "top":
        return `Tasks:   4 total,   1 running,   3 sleeping
%Cpu(s):  5.2 us,  2.1 sy,  0.0 ni, 92.7 id
Memory: 8192MB total, 2048MB used, 6144MB free

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+
    1 yousaf    20   0  856432  89532  45128 S   3.2  1.1   0:05.23 portfolio
  234 yousaf    20   0  1245632 156284  89412 S   1.8  1.9   0:02.15 react-app
  456 yousaf    20   0  2156824 234156 145728 S   0.5  2.9   0:01.45 vite-dev`;

      default:
        return `bash: ${command}: command not found
Did you mean one of these?
  help   - Show available commands
  ls     - List files
  pwd    - Show current directory
  status - System status dashboard
  github - GitHub statistics
  resume - Download resume with QR code`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = userInput.trim();
      const prompt =
        currentPath === "/home/yousaf/devops"
          ? "devops@yousaf:~/devops$"
          : "devops@yousaf:~$";

      // Special handling for clear command
      if (command === "clear") {
        setInteractiveOutput("");
        setUserInput("");
        if (userInput.trim()) {
          setCommandHistory((prev) => [...prev, userInput]);
          setHistoryIndex(-1);
        }
        return;
      }

      const output = executeCommand(userInput);
      const newOutput = `${interactiveOutput}${prompt} ${userInput}\n${
        output ? output + "\n" : ""
      }`;
      setInteractiveOutput(newOutput);

      if (userInput.trim()) {
        setCommandHistory((prev) => [...prev, userInput]);
        setHistoryIndex(-1);
      }
      setUserInput("");

      // Scroll to bottom after command execution
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 10);
    } else if (e.key === "Tab") {
      e.preventDefault();

      // Get available files and folders based on current context
      const getAvailableItems = () => {
        const commands = ["help", "whoami", "pwd", "ls", "cat", "cd", "clear"];
        let files: string[] = [];
        let folders: string[] = [];

        if (currentPath === "/home/yousaf/devops") {
          // In devops directory
          const devopsItems = Object.keys(fileSystem.devops as FileSystem);
          files = devopsItems.filter(
            (item) => typeof (fileSystem.devops as any)[item] === "string"
          );
          folders = devopsItems.filter(
            (item) => typeof (fileSystem.devops as any)[item] === "object"
          );
        } else {
          // In root directory (/home/yousaf)
          const rootItems = Object.keys(fileSystem);
          files = rootItems.filter(
            (item) => typeof fileSystem[item] === "string"
          );
          folders = rootItems.filter(
            (item) => typeof fileSystem[item] === "object"
          );
        }

        return { commands, files, folders };
      };

      const { commands, files, folders } = getAvailableItems();

      // Parse current input to determine what we're completing
      const words = userInput.split(" ");
      const currentWord = words[words.length - 1];

      if (words.length === 1) {
        // Completing command
        const matches = commands.filter((cmd) => cmd.startsWith(currentWord));
        if (matches.length === 1) {
          setUserInput(matches[0] + " ");
        } else if (matches.length > 1) {
          // Show available options in output
          const newOutput = `${interactiveOutput}${getPrompt()} ${userInput}\n${matches.join(
            "  "
          )}\n`;
          setInteractiveOutput(newOutput);
        }
      } else if (words[0] === "cat") {
        // Completing file names for cat command
        const allItems = [...files];
        const matches = allItems.filter((item) => item.startsWith(currentWord));
        if (matches.length === 1) {
          words[words.length - 1] = matches[0];
          setUserInput(words.join(" "));
        } else if (matches.length > 1) {
          // Show available options
          const newOutput = `${interactiveOutput}${getPrompt()} ${userInput}\n${matches.join(
            "  "
          )}\n`;
          setInteractiveOutput(newOutput);
        }
      } else if (words[0] === "cd") {
        // Completing folder names for cd command
        let allItems = [...folders];
        if (currentPath !== "/home/yousaf") {
          allItems.push(".."); // Add parent directory option
        }
        allItems.push("~"); // Add home directory option

        const matches = allItems.filter((item) => item.startsWith(currentWord));
        if (matches.length === 1) {
          words[words.length - 1] = matches[0];
          setUserInput(words.join(" "));
        } else if (matches.length > 1) {
          // Show available options
          const newOutput = `${interactiveOutput}${getPrompt()} ${userInput}\n${matches.join(
            "  "
          )}\n`;
          setInteractiveOutput(newOutput);
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setUserInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setUserInput("");
        } else {
          setHistoryIndex(newIndex);
          setUserInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleTerminalClick = () => {
    if (interactive && inputRef.current) {
      inputRef.current.focus();
    }
  };

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

  // Trigger typing for each command (only for non-interactive mode)
  useEffect(() => {
    if (!interactive && isTyping && currentCommandIndex < commands.length) {
      typeCommandAndOutput();
      setIsTyping(false);
    }
  }, [
    isTyping,
    currentCommandIndex,
    commands.length,
    typeCommandAndOutput,
    interactive,
  ]);

  // Focus input when interactive mode is enabled
  useEffect(() => {
    if (interactive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [interactive]);

  // Determine background and text color based on theme
  const bgColor = theme === "dark" ? "bg-black" : "bg-gray-900";
  const textColor = "text-green-400";

  const getPrompt = () => {
    if (!interactive) return title;
    return currentPath === "/home/yousaf/devops"
      ? "devops@yousaf:~/devops$"
      : "devops@yousaf:~$";
  };

  return (
    <div className="terminal-container rounded-lg overflow-hidden border border-foreground/10 shadow-lg w-full">
      <div className="terminal-header flex items-center p-3 bg-gray-800 text-white">
        <div className="terminal-buttons flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="terminal-title text-sm font-mono">
          {interactive ? `${getPrompt()} - Interactive Mode` : title}
        </div>
      </div>
      <div
        ref={terminalRef}
        className={`terminal-content p-4 font-mono text-sm overflow-y-auto ${bgColor} ${textColor} cursor-text`}
        style={{
          height: height,
          maxHeight: height,
        }}
        onClick={handleTerminalClick}
      >
        {interactive ? (
          <div className="whitespace-pre-wrap">
            {interactiveOutput && <div>{interactiveOutput}</div>}
            <div className="flex items-start">
              <span className="mr-2 flex-shrink-0">{getPrompt()}</span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent outline-none border-none text-green-400 font-mono w-full"
                  style={{ caretColor: "transparent" }}
                  autoComplete="off"
                  spellCheck="false"
                />
                <span
                  className={`absolute top-0 bg-green-400 inline-block w-2 h-5 ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    left: `${userInput.length * 0.6}em`,
                  }}
                ></span>
              </div>
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">
            {displayedContent}
            <span
              className={`inline-block w-2 h-5 bg-green-400 ml-1 ${
                cursorVisible ? "opacity-100" : "opacity-0"
              }`}
            ></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
