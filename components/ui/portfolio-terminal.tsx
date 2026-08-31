"use client";

import React, { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

type CommandHistory = {
  command: string;
  output: React.ReactNode;
};

const DEMO_COMMANDS = ["whoami", "skills", "help"];

const getCommandOutput = (cmd: string): React.ReactNode => {
  const normalizedCmd = cmd.trim().toLowerCase();
  switch (normalizedCmd) {
    case "whoami":
      return (
        <div className="flex flex-col gap-1 whitespace-pre-wrap">
          <div>Mark Khian Pangilinan</div>
          <div className="text-muted-foreground">General VA · Web Development · AI Automation</div>
          <br />
          <div className="text-xs italic text-muted-foreground/50">Type &quot;help&quot; to explore.</div>
        </div>
      );
    case "help":
      return (
        <div className="flex flex-col gap-1 whitespace-pre-wrap">
          <div>Available commands:</div>
          <div className="mt-1 grid grid-cols-[80px_1fr] gap-x-2 gap-y-1">
            <span className="text-blue-400">about</span><span>Short introduction</span>
            <span className="text-blue-400">skills</span><span>View core capabilities</span>
            <span className="text-blue-400">services</span><span>View offered services</span>
            <span className="text-blue-400">contact</span><span>Get in touch</span>
            <span className="text-blue-400">clear</span><span>Clear terminal</span>
          </div>
        </div>
      );
    case "about":
      return (
        <div className="flex flex-col gap-1 whitespace-pre-wrap">
          <div>I’m Khian — working across General Virtual Assistance,</div>
          <div>Web Development, and AI Automation.</div>
          <br />
          <div>I help simplify daily work through organized support,</div>
          <div>modern websites, and smarter workflows.</div>
        </div>
      );
    case "skills":
      return (
        <div className="flex flex-col gap-1 whitespace-pre-wrap">
          <div className="font-semibold text-blue-400">General VA</div>
          <div className="text-muted-foreground">→ Email & Calendar Management</div>
          <div className="text-muted-foreground">→ Data Entry & File Organization</div>
          <div className="text-muted-foreground">→ Online Research</div>
          <div className="text-muted-foreground">→ Google Workspace & Microsoft 365</div>
          <br />
          <div className="font-semibold text-blue-400">Web Development</div>
          <div className="text-muted-foreground">→ System Architecture</div>
          <div className="text-muted-foreground">→ Modern Frameworks</div>
          <div className="text-muted-foreground">→ Node.js & Express</div>
          <div className="text-muted-foreground">→ Database Integration</div>
          <div className="text-muted-foreground">→ API Integration</div>
          <br />
          <div className="font-semibold text-blue-400">AI Automation</div>
          <div className="text-muted-foreground">→ Workflow Design</div>
          <div className="text-muted-foreground">→ Process Automation</div>
          <div className="text-muted-foreground">→ AI-Assisted Workflows</div>
          <div className="text-muted-foreground">→ Intelligent Task Automation</div>
        </div>
      );
    case "services":
      return <div>Opening services...</div>;
    case "contact":
      return <div>Opening contact options...</div>;
    default:
      return (
        <div>
          Command not found: {normalizedCmd}<br />
          Type <span className="text-blue-400">help</span> to see available commands.
        </div>
      );
  }
};

export function PortfolioTerminal({ onConnectClick }: { onConnectClick?: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const [input, setInput] = useState("");
  // By default we start in demo mode, unless they prefer reduced motion
  const [demoMode, setDemoMode] = useState(() => !prefersReducedMotion);
  const [history, setHistory] = useState<CommandHistory[]>(() =>
    prefersReducedMotion ? [{ command: "whoami", output: getCommandOutput("whoami") }] : []
  );
  const [demoPhase, setDemoPhase] = useState<"idle" | "typing" | "output">("idle");
  const [demoCommandIndex, setDemoCommandIndex] = useState(0);
  const [demoTyped, setDemoTyped] = useState("");

  const [prevPrefersReduced, setPrevPrefersReduced] = useState(prefersReducedMotion);

  if (prefersReducedMotion !== prevPrefersReduced) {
    setPrevPrefersReduced(prefersReducedMotion);
    if (prefersReducedMotion && demoMode) {
      setDemoMode(false);
      setHistory([{ command: "whoami", output: getCommandOutput("whoami") }]);
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const isScrolledUp = useRef(false);

  // Scroll to bottom on history change unless user manually scrolled up
  useEffect(() => {
    if (terminalRef.current && !isScrolledUp.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, demoPhase, demoTyped]);

  // Track manual scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // 10px threshold for being at the bottom
    const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight <= 10;
    isScrolledUp.current = !isAtBottom;
  };

  // Demo sequence
  useEffect(() => {
    if (!demoMode) return;

    let timeoutId: NodeJS.Timeout;

    if (demoPhase === "idle") {
      timeoutId = setTimeout(() => {
        setDemoPhase("typing");
        setDemoTyped("");
      }, 500); // Wait 500ms with an empty prompt before starting to type
    } else if (demoPhase === "typing") {
      const currentCommand = DEMO_COMMANDS[demoCommandIndex];
      if (demoTyped.length < currentCommand.length) {
        const delay = Math.random() > 0.8 ? Math.random() * 40 + 80 : Math.random() * 30 + 65; // 65-120ms
        timeoutId = setTimeout(() => {
          setDemoTyped(currentCommand.substring(0, demoTyped.length + 1));
        }, delay);
      } else {
        timeoutId = setTimeout(() => {
          setDemoPhase("output");
        }, 300); // Wait 300ms before showing output
      }
    } else if (demoPhase === "output") {
      timeoutId = setTimeout(() => {
        const nextIndex = (demoCommandIndex + 1) % DEMO_COMMANDS.length;
        setDemoCommandIndex(nextIndex);
        setDemoPhase("idle");
        setDemoTyped("");
      }, 3000); // 3 seconds before clearing and moving to the next command
    }

    return () => clearTimeout(timeoutId);
  }, [demoMode, demoPhase, demoTyped, demoCommandIndex]);

  const stopDemo = () => {
    if (demoMode) {
      setDemoMode(false);
    }
  };

  const handleCommand = (cmd: string) => {
    const normalizedCmd = cmd.trim().toLowerCase();
    if (!normalizedCmd) return;

    isScrolledUp.current = false; // Reset on new command

    if (normalizedCmd === "clear") {
      setHistory([]);
      return;
    }

    const output = getCommandOutput(cmd);
    setHistory((prev) => [...prev, { command: cmd, output }]);

    if (normalizedCmd === "services") {
      setTimeout(() => {
        const el = document.getElementById(siteConfig.sections.services);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 400);
    } else if (normalizedCmd === "contact") {
      setTimeout(() => {
        if (onConnectClick) onConnectClick();
      }, 400);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoMode) return;
    const cmd = input;
    setInput("");
    handleCommand(cmd);
  };

  const handleTerminalClick = () => {
    stopDemo();
    if (window.getSelection()?.toString()) return;
    
    // Slight timeout ensures state applies and input mounts
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const activeHistory = demoMode 
    ? (demoPhase === "output" ? [{ command: DEMO_COMMANDS[demoCommandIndex], output: getCommandOutput(DEMO_COMMANDS[demoCommandIndex]) }] : []) 
    : history;

  return (
    <div
      className="mx-auto flex h-[340px] xl:h-[380px] min-h-0 w-full max-w-lg flex-col overflow-hidden rounded-xl border border-white/10 bg-black/40 font-mono text-sm shadow-2xl backdrop-blur-md focus-within:border-white/20 transition-colors"
      onClick={handleTerminalClick}
      onKeyDown={stopDemo}
    >
      {/* Header */}
      <div className="flex items-center border-b border-white/5 bg-white/5 px-4 py-3 relative">
        <div className="flex gap-2 z-10">
          <div className="size-3 rounded-full bg-[#ff5f56]" />
          <div className="size-3 rounded-full bg-[#ffbd2e]" />
          <div className="size-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-muted-foreground/80">
          khian@portfolio &mdash; zsh
        </div>
      </div>

      {/* Body */}
      <div
        ref={terminalRef}
        onScroll={handleScroll}
        data-lenis-prevent="true"
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 text-foreground/80 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 space-y-4"
      >
        {/* History */}
        {activeHistory.map((item, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="shrink-0 flex gap-1.5">
                <span className="text-blue-400 font-medium">khian@portfolio</span>
                <span className="text-muted-foreground">~</span>
                <span className="text-white/70">%</span>
              </div>
              <span className="break-all text-foreground/90">{item.command}</span>
            </div>
            <div className="text-muted-foreground">
              {item.output}
            </div>
          </div>
        ))}

        {/* Demo Prompt */}
        {demoMode && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="shrink-0 flex gap-1.5">
                <span className="text-blue-400 font-medium">khian@portfolio</span>
                <span className="text-muted-foreground">~</span>
                <span className="text-white/70">%</span>
              </div>
              <span className="text-foreground/90">
                {demoPhase === "typing" ? demoTyped : ""}
                <span className="animate-pulse">_</span>
              </span>
            </div>
          </div>
        )}

        {/* Interactive Prompt */}
        {!demoMode && (
          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <div className="shrink-0 flex gap-1.5">
              <span className="text-blue-400 font-medium">khian@portfolio</span>
              <span className="text-muted-foreground">~</span>
              <span className="text-white/70">%</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={stopDemo}
              className="min-w-0 flex-1 bg-transparent p-0 border-none outline-none focus:ring-0 text-foreground/90 caret-blue-400"
              spellCheck={false}
              autoComplete="off"
              aria-label="Portfolio terminal command input"
            />
          </form>
        )}
      </div>
    </div>
  );
}
