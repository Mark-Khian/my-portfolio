"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Send, Bot, RotateCcw, AlertCircle } from "lucide-react";
import type { ChatMessage } from "@/app/api/chat/route";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { useIsMounted } from "@/hooks/use-is-mounted";

// ── Suggested starter questions ───────────────────────────────────────────────
const SUGGESTIONS = [
  "What projects has Khian built?",
  "What's his networking background?",
  "What tech stack does he use?",
  "Is he open to internships?",
  "How can I contact Khian?",
];

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm Khian's portfolio assistant. I can answer questions about his background, skills, projects, networking knowledge, and how to get in touch.\n\nWhat would you like to know?",
};

// ── Action parser — extracts JSON action block from assistant response ─────────
interface ChatAction {
  action: "scroll" | "open_github" | "open_email";
  target?: string;
}

function parseAction(content: string): {
  text: string;
  action: ChatAction | null;
} {
  const match = content.match(/(\{[^}]*"action"[^}]*\})\s*$/);
  if (!match) return { text: content, action: null };

  try {
    const action = JSON.parse(match[1]) as ChatAction;
    const text = content.slice(0, match.index).trim();
    return { text, action };
  } catch {
    return { text: content, action: null };
  }
}

function executeAction(action: ChatAction) {
  if (action.action === "scroll" && action.target) {
    const el = document.getElementById(action.target);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (action.action === "open_github") {
    window.open("https://github.com/Mark-Khian", "_blank", "noopener,noreferrer");
  } else if (action.action === "open_email") {
    window.open(siteConfig.links.mailto, "_blank", "noopener,noreferrer");
  }
}

// ── Message bubble ─────────────────────────────────────────────────────────────
function MessageBubble({
  message,
}: {
  message: ChatMessage;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <span
          aria-hidden="true"
          className="mr-2 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400"
        >
          <Bot className="size-3.5" />
        </span>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm bg-blue-500/20 text-foreground"
            : "rounded-tl-sm border border-white/8 bg-white/[0.04] text-foreground",
        )}
      >
        {message.content.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < message.content.split("\n").length - 1 && <br />}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Typing indicator ───────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400"
      >
        <Bot className="size-3.5" />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-white/8 bg-white/[0.04] px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block size-1.5 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function ChatAssistant() {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useIsMounted();
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock + data attribute for CSS dimming
  useEffect(() => {
    if (!isOpen) return;

    document.body.dataset.chatOpen = "true";
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      delete document.body.dataset.chatOpen;
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  }, [messages, isLoading, isOpen, prefersReducedMotion]);

  // Focus input on open, restore trigger on close
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Keyboard: Escape closes, Tab traps focus
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'button, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: ChatMessage = { role: "user", content: trimmed };
      const nextMessages = [...messages, userMessage];

      setMessages(nextMessages);
      setInput("");
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.filter((m) => m.role !== "assistant" || m !== GREETING),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.code === "AI_UNAVAILABLE") {
            setIsMaintenance(true);
            setError(null);
          } else {
            setError(data.error ?? "Something went wrong.");
          }
          return;
        }

        const { text: cleanText, action } = parseAction(data.content as string);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: cleanText },
        ]);

        if (action) {
          setTimeout(() => executeAction(action), 400);
        }
      } catch {
        setError("Network error. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([GREETING]);
    setError(null);
    setIsMaintenance(false);
    setInput("");
  };

  const showSuggestions = messages.length === 1 && !isLoading;

  const ease = [0.22, 1, 0.36, 1] as const;
  const reducedEase = [0, 0, 1, 1] as const;
  const activeEase = prefersReducedMotion ? reducedEase : ease;

  const overlayAndPanel = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Immersive backdrop ── */}
          <motion.div
            aria-hidden="true"
            data-chat-backdrop
            data-lenis-prevent
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: activeEase }}
            className="fixed inset-0 z-40"
            style={{
              background: "radial-gradient(ellipse at 70% 60%, rgba(30,58,138,0.18) 0%, rgba(0,0,0,0) 70%), rgba(0,0,0,0.35)",
            }}
          />

          {/* ── Chat panel ── */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Portfolio AI assistant"
            data-lenis-prevent
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96, y: prefersReducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.97, y: prefersReducedMotion ? 0 : 6 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: activeEase }}
            className={cn(
              "fixed bottom-20 right-6 z-50 flex w-[min(380px,calc(100vw-3rem))] flex-col",
              "rounded-2xl border border-white/[0.12] bg-[#0c0c0f]/95 backdrop-blur-2xl [@media(pointer:coarse)]:bg-[#0c0c0f]/98 [@media(pointer:coarse)]:backdrop-blur-none",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),inset_0_0_0_1px_rgba(255,255,255,0.04),0_24px_64px_rgba(0,0,0,0.7),0_0_0_1px_rgba(0,0,0,0.5)]",
            )}
            style={{ height: "min(520px, calc(100svh - 6rem))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400">
                  <Bot className="size-3.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-none text-foreground">
                    Portfolio Assistant
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Knows everything about Khian
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset conversation"
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                >
                  <RotateCcw className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close assistant"
                  className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div
              className="flex-1 min-h-0 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
              aria-live="polite"
              aria-atomic="false"
              data-lenis-prevent
            >
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  message={msg}
                />
              ))}

              {/* Suggested questions */}
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {SUGGESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      className={cn(
                        "rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-left text-xs text-muted-foreground",
                        "transition-all duration-200 hover:border-blue-500/30 hover:bg-blue-500/8 hover:text-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}

              {isLoading && <TypingIndicator />}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-3 py-2.5 text-xs text-red-400"
                >
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Maintenance State */}
              {isMaintenance && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3.5 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Bot className="size-4 text-blue-400" />
                    Portfolio Assistant is temporarily unavailable.
                  </div>
                  <p className="text-xs leading-relaxed">
                    The AI assistant is currently under maintenance. Please try again later or use the contact options below to reach me directly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      window.dispatchEvent(new Event("open-contact"));
                    }}
                    className="mt-1 flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                  >
                    Contact Me
                  </button>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/8 p-3">
              <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 focus-within:border-blue-500/40 transition-colors duration-200">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isMaintenance ? "Assistant temporarily unavailable" : "Ask about Khian&apos;s skills, projects…"}
                  rows={1}
                  aria-label="Message input"
                  disabled={isLoading || isMaintenance}
                  className={cn(
                    "flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60",
                    "focus:outline-none disabled:opacity-50",
                    "max-h-24 leading-relaxed",
                  )}
                  style={{ scrollbarWidth: "none" }}
                />
                <button
                  type="button"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading || isMaintenance}
                  aria-label="Send message"
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                    input.trim() && !isLoading
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-white/5 text-muted-foreground",
                  )}
                >
                  <Send className="size-3.5" />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
                Ask about Khian&apos;s portfolio &middot; Press Enter to send
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-lg",
          "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
          "border-white/15 bg-[#09090B]/92 text-foreground backdrop-blur-xl [@media(pointer:coarse)]:bg-[#09090B]/95 [@media(pointer:coarse)]:backdrop-blur-none",
          "hover:border-blue-500/40 hover:shadow-[0_0_24px_rgba(59,130,246,0.15)]",
          isOpen && "border-blue-500/40 shadow-[0_0_24px_rgba(59,130,246,0.15)]",
        )}
        style={{ zIndex: 60 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      >
        <Bot className="size-4 text-blue-400" aria-hidden="true" />
        Ask AI
      </motion.button>

      {mounted && createPortal(overlayAndPanel, document.body)}
    </>
  );
}
