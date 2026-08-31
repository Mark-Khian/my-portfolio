"use client";

import { useEffect, useState, useRef, useCallback, type SVGProps } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowUpRight, Mail, Copy, Check } from "lucide-react";

import { BrandIcon } from "@/components/icons/brand-icons";
import { FaWhatsapp } from "react-icons/fa";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

import { siteConfig } from "@/lib/site-config";

const EMAIL = siteConfig.links.email;

interface ContactOption {
  slug: string;
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
  link: string;
  color: string;
  target: string;
  copyable?: boolean;
}

interface QuickContactProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Reusable contact card ────────────────────────────────────────────────────

interface CardProps {
  option: ContactOption;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  copyState: "idle" | "copied";
  onCopy: () => void;
  prefersReducedMotion: boolean | null;
  size?: "md" | "sm";
}

function ContactCard({
  option,
  hovered,
  onEnter,
  onLeave,
  onFocus,
  onBlur,
  copyState,
  onCopy,
  prefersReducedMotion,
  size = "md",
}: CardProps) {
  const iconSize = size === "md" ? "size-11" : "size-10";
  const svgSize = size === "md" ? "size-5" : "size-5";

  const cardContent = (
    <>
      {/* Ambient left glow — desktop hover only */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 -z-10 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: `radial-gradient(circle at 10% 50%, ${option.color} 0%, transparent 65%)`,
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 min-w-0">
        {/* Platform icon */}
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300",
            iconSize,
          )}
          style={{
            borderColor: hovered ? `${option.color}35` : undefined,
            backgroundColor: hovered ? `${option.color}08` : undefined,
            color: hovered ? option.color : "currentColor",
          }}
        >
          <option.icon
            className={cn("transition-transform duration-300", svgSize, hovered && "scale-105")}
          />
        </span>

        <div className="text-left min-w-0">
          <span className="text-[10px] font-mono font-semibold tracking-wider text-muted-foreground uppercase block leading-none">
            {option.label}
          </span>
          <span className="mt-1 text-sm font-semibold text-foreground group-hover:text-white transition-colors block leading-tight truncate">
            {option.value}
          </span>
          <span className="mt-0.5 text-xs text-muted-foreground block leading-snug">
            {option.description}
          </span>
        </div>
      </div>
    </>
  );

  // ── Email card — split into mailto link + copy button ────────────────────
  if (option.copyable) {
    return (
      <motion.div
        className="relative flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.01] p-4 outline-none transition-all duration-300 group hover:bg-white/[0.03]"
        style={{
          borderColor: hovered ? `${option.color}25` : undefined,
          boxShadow: hovered ? `0 0 20px ${option.color}08` : undefined,
        }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {/* Clickable mailto area */}
        <a
          href={option.link}
          target={option.target}
          rel="noopener noreferrer"
          className="flex-1 flex items-center gap-0 outline-none min-w-0 pr-2"
          onFocus={onFocus}
          onBlur={onBlur}
          aria-label={option.slug === "gmail" ? "Email Mark Khian Pangilinan" : `Send email to ${option.value}`}
          title={option.slug === "gmail" ? "Email Mark Khian Pangilinan" : undefined}
        >
          {cardContent}
        </a>

        {/* Right side: arrow + copy button */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {/* Copy email button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
            aria-label={copyState === "copied" ? "Email copied!" : "Copy email address"}
            className={cn(
              "relative flex size-8 items-center justify-center rounded-lg border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
              copyState === "copied"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground",
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copyState === "copied" ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check className="size-3.5" />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                >
                  <Copy className="size-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Mailto arrow */}
          <a
            href={option.link}
            target={option.target}
            rel="noopener noreferrer"
            tabIndex={-1}
            aria-hidden="true"
            className="text-muted-foreground group-hover:text-white transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </motion.div>
    );
  }

  // ── Standard link card ────────────────────────────────────────────────────
  return (
    <motion.a
      href={option.link}
      target={option.target}
      rel="noopener noreferrer"
      className="relative flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.01] p-4 outline-none transition-all duration-300 group hover:bg-white/[0.03]"
      aria-label={option.slug === "whatsapp" ? "Message Mark Khian on WhatsApp" : `Open ${option.label}`}
      title={option.slug === "whatsapp" ? "Message Mark Khian on WhatsApp" : undefined}
      style={{
        borderColor: hovered ? `${option.color}25` : undefined,
        boxShadow: hovered ? `0 0 20px ${option.color}08` : undefined,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
    >
      {cardContent}

      <span className="text-muted-foreground group-hover:text-white transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 ml-2">
        <ArrowUpRight className="size-4" />
      </span>
    </motion.a>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function QuickContact({ isOpen, onClose }: QuickContactProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [showToast, setShowToast] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const contactOptions: ContactOption[] = [
    {
      slug: "gmail",
      label: "Email",
      value: "Send me an email",
      description: "For work inquiries and collaborations",
      icon: Mail,
      link: siteConfig.links.mailto,
      color: "#EA4335",
      target: "_blank",
      copyable: true,
    },
    {
      slug: "whatsapp",
      label: "WhatsApp",
      value: "Message me on WhatsApp",
      description: "Message me directly for work inquiries",
      icon: FaWhatsapp as React.ElementType,
      link: siteConfig.links.whatsapp,
      color: "#25D366",
      target: "_blank",
    },
    {
      slug: "instagram",
      label: "Instagram",
      value: "Follow me on Instagram",
      description: "See updates and personal posts",
      icon: (props: SVGProps<SVGSVGElement>) => <BrandIcon {...props} name="instagram" />,
      link: "https://www.instagram.com/mkhlucasp/?hl=en",
      color: "#E4405F",
      target: "_blank",
    },
  ];

  // ── Copy to clipboard ────────────────────────────────────────────────────
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyState("copied");
      setShowToast(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => {
        setCopyState("idle");
        setShowToast(false);
      }, 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = EMAIL;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopyState("copied");
      setShowToast(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => {
        setCopyState("idle");
        setShowToast(false);
      }, 2000);
    }
  }, []);

  // ── Keyboard / scroll lock / focus trap ─────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    const triggeringElement = document.activeElement as HTMLElement | null;

    const timer = setTimeout(() => {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable && focusable.length > 0) focusable[0].focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab") {
        if (!modalRef.current) return;
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { last.focus(); e.preventDefault(); }
        } else {
          if (document.activeElement === last) { first.focus(); e.preventDefault(); }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
      if (triggeringElement) triggeringElement.focus();
    };
  }, [isOpen, onClose]);

  // Cleanup copy timer on unmount
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);

  if (!isOpen) return null;

  // ── Animation variants ───────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.06,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 25 } },
  };

  const desktopTransition = { type: "spring", stiffness: 400, damping: 30 } as const;
  const mobileTransition  = { type: "spring", stiffness: 350, damping: 28 } as const;

  // ── Shared card list ─────────────────────────────────────────────────────
  const cardList = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mt-6 flex flex-col gap-3"
    >
      {contactOptions.map((option) => (
        <motion.div key={option.slug} variants={cardVariants}>
          <ContactCard
            option={option}
            hovered={hoveredCard === option.slug}
            onEnter={() => setHoveredCard(option.slug)}
            onLeave={() => setHoveredCard(null)}
            onFocus={() => setHoveredCard(option.slug)}
            onBlur={() => setHoveredCard(null)}
            copyState={copyState}
            onCopy={handleCopy}
            prefersReducedMotion={prefersReducedMotion}
            size="md"
          />
        </motion.div>
      ))}
    </motion.div>
  );

  // ── Toast ────────────────────────────────────────────────────────────────
  const toast = (
    <AnimatePresence>
      {showToast && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-emerald-500/25 bg-zinc-900/90 px-4 py-2 shadow-xl backdrop-blur-sm text-xs font-medium text-emerald-400 whitespace-nowrap pointer-events-none z-10"
        >
          <Check className="size-3.5 shrink-0" />
          Email copied to clipboard!
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      {/* Backdrop — no blur on mobile (full-viewport blur is expensive on mobile GPU) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/65 sm:backdrop-blur-md"
        aria-hidden="true"
      />

      {isDesktop ? (
        /* ── Desktop Modal ──────────────────────────────────────────────── */
        <div className="relative m-auto w-full max-w-md p-4" ref={modalRef}>
          <motion.div
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
            transition={desktopTransition}
            className="relative overflow-visible rounded-3xl border border-white/10 bg-[#09090B]/85 p-8 shadow-2xl backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            aria-describedby="contact-description"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all duration-300 hover:rotate-90 hover:border-white/20 hover:text-foreground focus-visible:ring-2 focus-visible:ring-blue-500/50"
              aria-label="Close contact hub"
            >
              <X className="size-4" />
            </button>

            {/* Header */}
            <div className="text-center">
              <h2 id="contact-title" className="text-2xl font-bold tracking-tight text-foreground">
                Let&apos;s Connect
              </h2>
              <p id="contact-description" className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Open to full-time opportunities, freelance projects, and professional collaborations. Feel free to reach out and let’s discuss how I can contribute to your team or business.
              </p>
            </div>

            {/* Cards */}
            <div className="mt-8 flex flex-col gap-3">
              {contactOptions.map((option) => (
                <ContactCard
                  key={option.slug}
                  option={option}
                  hovered={hoveredCard === option.slug}
                  onEnter={() => setHoveredCard(option.slug)}
                  onLeave={() => setHoveredCard(null)}
                  onFocus={() => setHoveredCard(option.slug)}
                  onBlur={() => setHoveredCard(null)}
                  copyState={copyState}
                  onCopy={handleCopy}
                  prefersReducedMotion={prefersReducedMotion}
                  size="md"
                />
              ))}
            </div>

            {/* Toast */}
            {toast}
          </motion.div>
        </div>
      ) : (
        /* ── Mobile Bottom Sheet ────────────────────────────────────────── */
        <div className="relative mt-auto w-full max-h-[85vh] overflow-y-auto" ref={modalRef}>
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={mobileTransition}
            className="relative rounded-t-3xl border-t border-x border-white/10 bg-[#09090B] p-6 pb-12 shadow-2xl backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title-mobile"
            aria-describedby="contact-description-mobile"
          >
            {/* Drag indicator */}
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/20" aria-hidden="true" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted-foreground focus-visible:ring-2 focus-visible:ring-blue-500/50"
              aria-label="Close contact hub"
            >
              <X className="size-4" />
            </button>

            {/* Header */}
            <div className="text-left pr-8">
              <h2 id="contact-title-mobile" className="text-xl font-bold tracking-tight text-foreground">
                Let&apos;s Connect
              </h2>
              <p id="contact-description-mobile" className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Open to full-time opportunities, freelance projects, and professional collaborations. Feel free to reach out and let’s discuss how I can contribute to your team or business.
              </p>
            </div>

            {/* Cards */}
            {cardList}

            {/* Toast (pinned inside sheet) */}
            <AnimatePresence>
              {showToast && (
                <motion.div
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="mt-5 flex items-center justify-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5 text-xs font-medium text-emerald-400 pointer-events-none"
                >
                  <Check className="size-3.5 shrink-0" />
                  Email copied to clipboard!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
}
