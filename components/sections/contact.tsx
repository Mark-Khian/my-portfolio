"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Copy, Check, ArrowUpRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { SVGProps } from "react";

import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { FaWhatsapp } from "react-icons/fa";
import { BrandIcon } from "@/components/icons/brand-icons";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const EMAIL = siteConfig.links.email;

interface ContactOption {
  slug: string;
  label: string;
  value: string;
  description: string;
  icon: LucideIcon | React.ComponentType<SVGProps<SVGSVGElement>>;
  href: string;
  color: string;
  external: boolean;
  copyable?: boolean;
}

const contactOptions: ContactOption[] = [
  {
    slug: "email",
    label: "Email",
    value: EMAIL,
    description: "Send a message directly to my inbox",
    icon: Mail,
    href: siteConfig.links.mailto,
    color: "#EA4335",
    external: false,
    copyable: true,
  },
  {
    slug: "whatsapp",
    label: "WhatsApp",
    value: "WhatsApp",
    description: "Message me directly for work inquiries.",
    icon: FaWhatsapp as unknown as React.ComponentType<SVGProps<SVGSVGElement>>,
    href: siteConfig.links.whatsapp,
    color: "#25D366",
    external: true,
  },
  {
    slug: "instagram",
    label: "Instagram",
    value: "instagram.com/mkhlucasp",
    description: "Connect or follow my personal updates",
    icon: (props: SVGProps<SVGSVGElement>) => (
      <BrandIcon {...props} name="instagram" />
    ),
    href: "https://www.instagram.com/mkhlucasp/",
    color: "#E4405F",
    external: true,
  },
];

export function Contact() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const el = document.createElement("textarea");
      el.value = EMAIL;
      Object.assign(el.style, { position: "fixed", opacity: "0" });
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopyState("copied");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopyState("idle"), 2000);
  }, []);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border/60 px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto w-full max-w-5xl">
        <FadeIn>
          <SectionHeader
            label="Contact"
            title="Let's work together"
            description="I’m open to full-time roles, freelance projects, and professional collaborations. Let’s connect and discuss how I can contribute to your team or business."
            headingId="contact-heading"
          />
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {contactOptions.map((option, index) => {
            const isHovered = hovered === option.slug;

            const cardContent = (
              <>
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        background: `radial-gradient(circle at top right, ${option.color}15 0%, transparent 60%)`,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon */}
                <span
                  className="mb-4 flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300"
                  style={{
                    borderColor: isHovered ? `${option.color}35` : undefined,
                    backgroundColor: isHovered
                      ? `${option.color}10`
                      : undefined,
                    color: isHovered ? option.color : "currentColor",
                  }}
                >
                  <option.icon className="size-5 transition-transform duration-300" />
                </span>

                <p className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {option.label}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-foreground" title={option.value}>
                  <span className="hidden sm:inline">{option.value}</span>
                  <span className="sm:hidden">
                    {option.slug === "email" ? "markkhian.pan…@gmail.com" : option.value}
                  </span>
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  {option.description}
                </p>
              </>
            );

            return (
              <FadeIn key={option.slug} delay={0.05 + index * 0.07}>
                {option.copyable ? (
                  <GlassCard
                    className="relative flex flex-col p-5"
                    style={{
                      borderColor: isHovered ? `${option.color}50` : undefined,
                      boxShadow: isHovered ? `0 8px 32px -8px ${option.color}25` : undefined,
                    }}
                    onMouseEnter={() => setHovered(option.slug)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {cardContent}
                    <div className="mt-4 flex items-center gap-2">
                      <Link
                        href={option.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded"
                        aria-label={option.slug === "email" ? "Email Mark Khian Pangilinan" : option.slug === "whatsapp" ? "Message Mark Khian on WhatsApp" : `Open ${option.value}`}
                        title={option.slug === "email" ? "Email Mark Khian Pangilinan" : option.slug === "whatsapp" ? "Message Mark Khian on WhatsApp" : undefined}
                      >
                        Open <ArrowUpRight className="size-3" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={handleCopy}
                        aria-label={
                          copyState === "copied"
                            ? "Email copied!"
                            : "Copy email address"
                        }
                        className={cn(
                          "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs transition-all duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                          copyState === "copied"
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {copyState === "copied" ? (
                            <motion.span
                              key="check"
                              className="flex items-center gap-1"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.12 }}
                            >
                              <Check className="size-3" />
                              Copied
                            </motion.span>
                          ) : (
                            <motion.span
                              key="copy"
                              className="flex items-center gap-1"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.12 }}
                            >
                              <Copy className="size-3" />
                              Copy
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </GlassCard>
                ) : (
                  <GlassCard
                    as={Link}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex flex-col p-5 focus-visible:outline-none"
                    style={{
                      borderColor: isHovered ? `${option.color}50` : undefined,
                      boxShadow: isHovered ? `0 8px 32px -8px ${option.color}25` : undefined,
                    }}
                    onMouseEnter={() => setHovered(option.slug)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(option.slug)}
                    onBlur={() => setHovered(null)}
                  >
                    {cardContent}
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                        Visit <ArrowUpRight className="size-3" aria-hidden="true" />
                      </span>
                    </div>
                  </GlassCard>
                )}
              </FadeIn>
            );
          })}
        </div>

        {/* Availability note */}
        <FadeIn delay={0.25}>
          <GlassCard className="mt-6 p-5 sm:p-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="mr-2 inline-block size-1.5 rounded-full bg-emerald-500 align-middle" aria-hidden="true" />
              <span className="font-medium text-foreground">Currently available</span>
              {" — "}
              {siteConfig.availability}
            </p>
          </GlassCard>
        </FadeIn>
      </div>
    </section>
  );
}
