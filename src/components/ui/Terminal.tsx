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
    output: "yousafkhamza",
    delay: 800,
  },
  {
    command: "cat /etc/profile",
    output: `# DevOps Engineer Profile
export FULL_NAME="Yousaf K H"
export ROLE="DevOps Engineer & DevSecOps Specialist"
export LOCATION="India"
export SKILLS=("AWS" "Terraform" "Kubernetes" "CI/CD" "Monitoring" "DevSecOps" "Automation")
export CERTIFICATIONS=("AWS Solutions Architect Associate" "Certified Kubernetes Administrator" "Terraform Associate Certification")`,
    delay: 1500,
  },
  {
    command: "ls -la ~/projects/",
    output: `total 64
drwxr-xr-x  11 yousaf staff   352 Jun 10 09:45 .
drwxr-xr-x   5 yousaf staff   160 Jun 10 09:45 ..
drwxr-xr-x  14 yousaf staff   448 Jun 10 09:45 observatory-cli
drwxr-xr-x  12 yousaf staff   384 Jun 10 09:45 tofu-switch
drwxr-xr-x  10 yousaf staff   320 Jun 10 09:45 domain-monitor
drwxr-xr-x  13 yousaf staff   416 Jun 10 09:45 kube-score-enhancer`,
    delay: 1200,
  },
  {
    command: "echo 'Certificates:' && ls ~/certifications/",
    output: `AWS_Solutions_Architect_Associate.pdf
Certified_Kubernetes_Administrator.pdf
Terraform_Associate_Certification.pdf
Fundamentals_of_Ethical_Hacking.pdf`,
    delay: 1000,
  },
  {
    command: "kubectl version --client",
    output: `Client Version: v1.28.4
Kustomize Version: v5.0.4`,
    delay: 1000,
  },
];

const Terminal = ({
  children,
  title = "yousaf@devops:~$",
  commands = defaultCommands,
}: {
  children?: React.ReactNode;
  title?: string;
  commands?: Command[];
}) => {
  const { theme } = useTheme();
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [isTypingCommand, setIsTypingCommand] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const typeCommand = useCallback(() => {
    if (currentCommandIndex >= commands.length) return;
    const currentCommand = commands[currentCommandIndex];
    let commandPosition = 0;
    setIsTypingCommand(true);
    const typingInterval = setInterval(() => {
      if (commandPosition < currentCommand.command.length) {
        setDisplayedContent(
          (prev) =>
            prev +
            (commandPosition === 0 ? "\n" + title + " " : "") +
            currentCommand.command.charAt(commandPosition)
        );
        commandPosition++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setDisplayedContent((prev) => prev + "\n" + currentCommand.output);
          setTimeout(() => {
            setCurrentCommandIndex((prev) => prev + 1);
            setIsTypingCommand(true);
          }, currentCommand.delay || 1000);
        }, 500);
      }
    }, 80);
    return () => clearInterval(typingInterval);
  }, [currentCommandIndex, commands, title]);

  useEffect(() => {
    if (!isTypingCommand || currentCommandIndex >= commands.length) return;
    const typingTimeout = setTimeout(() => {
      typeCommand();
    }, 500);
    return () => clearTimeout(typingTimeout);
  }, [currentCommandIndex, isTypingCommand, typeCommand]);

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
        className={`terminal-content p-4 font-mono text-sm overflow-auto ${
          theme === "dark"
            ? "bg-black text-green-400"
            : "bg-gray-900 text-green-400"
        }`}
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
        `}
      </style>
    </div>
  );
};

export default Terminal;
