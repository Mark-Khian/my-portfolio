"use client";

import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Code2,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { BrandIcon, type IconName } from "@/components/icons/brand-icons";
import { useFineHover } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

// ── Viewport-aware tooltip ────────────────────────────────────────────────────
function ToolTooltip({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const margin = 8;
    if (rect.left < margin) {
      el.style.transform = `translateX(calc(-50% + ${margin - rect.left}px))`;
    } else if (rect.right > window.innerWidth - margin) {
      el.style.transform = `translateX(calc(-50% - ${rect.right - (window.innerWidth - margin)}px))`;
    }
  }, []);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      className="pointer-events-none absolute bottom-full left-1/2 z-[9999] mb-2 -translate-x-1/2 whitespace-nowrap rounded border border-border dark:border-white/10 bg-popover dark:bg-zinc-900 px-2 py-0.5 text-[10px] font-medium tracking-wide text-popover-foreground dark:text-foreground shadow-xl"
    >
      {name}
    </motion.span>
  );
}

interface Tool {
  name: string;
  slug: string;
  color: string;
  isBrand: boolean;
  lucideIcon?: LucideIcon;
}

interface Category {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accentColor: string;
  tools: Tool[];
}

// ── Isolated ToolButton — owns its own hover state so parent never re-renders ─
const ToolButton = memo(function ToolButton({
  tool,
  categoryTitle,
  size,
  focusRingColor,
}: {
  tool: Tool;
  categoryTitle: string;
  size: "lg" | "sm";
  focusRingColor: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const btnSize = size === "lg" ? "size-12 rounded-xl" : "size-10 rounded-lg";
  const iconSize = size === "lg" ? "size-6" : "size-5";
  const isThemeAware = tool.color === "#FFFFFF" || tool.color === "#000000";
  const lightColor = tool.color === "#FFFFFF" ? "#000000" : tool.color;
  const darkColor = tool.color === "#000000" ? "#FFFFFF" : tool.color;

  return (
    <button
      type="button"
      aria-label={`${tool.name} - ${categoryTitle}`}
      className={cn(
        "relative flex items-center justify-center border border-border dark:border-white/5 bg-foreground/[0.02] dark:bg-white/[0.02] outline-none transition-[border-color,box-shadow,transform] duration-300 focus-visible:ring-2 hover:-translate-y-0.5",
        "[--tool-active-color:var(--tool-color-light)] dark:[--tool-active-color:var(--tool-color)]",
        isThemeAware ? "text-foreground" : "text-[var(--tool-active-color)]",
        btnSize,
        focusRingColor,
      )}
      style={{
        "--tool-color": darkColor,
        "--tool-color-light": lightColor,
        borderColor: hovered ? `color-mix(in srgb, var(--tool-active-color) 25%, transparent)` : undefined,
        boxShadow: hovered ? `0 0 16px color-mix(in srgb, var(--tool-active-color) 12%, transparent)` : undefined,
      } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            className={cn("absolute inset-0 -z-10", size === "lg" ? "rounded-xl" : "rounded-lg")}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: size === "lg" ? 0.18 : 0.16, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              background: `radial-gradient(circle, var(--tool-active-color) 0%, transparent 75%)`,
            }}
          />
        )}
      </AnimatePresence>

      {tool.isBrand ? (
        <BrandIcon
          name={tool.slug as IconName}
          className={cn("transition-[color,transform] duration-300", iconSize)}
          style={{
            color: "var(--tool-active-color)",
            transform: hovered && !prefersReducedMotion ? "scale(1.1)" : "none",
          }}
        />
      ) : (
        tool.lucideIcon && (
          <tool.lucideIcon
            className={cn("transition-[color,transform] duration-300", iconSize)}
            style={{
              color: "var(--tool-active-color)",
              transform: hovered && !prefersReducedMotion ? "scale(1.1)" : "none",
            }}
          />
        )
      )}

      <AnimatePresence>
        {hovered && <ToolTooltip name={tool.name} />}
      </AnimatePresence>
    </button>
  );
});

// ── Skills data (stable — defined outside component to avoid re-creation) ─────
const coreCategories: Category[] = [
  {
    id: "web-development",
    title: "Web Development",
    description:
      "Core technologies used to build and connect modern web applications.",
    icon: Code2,
    accentColor: "#3B82F6",
    tools: [
      { name: "React", slug: "react", color: "#61DAFB", isBrand: true },
      { name: "Next.js", slug: "nextdotjs", color: "#FFFFFF", isBrand: true },
      { name: "TypeScript", slug: "typescript", color: "#3178C6", isBrand: true },
      { name: "JavaScript", slug: "javascript", color: "#F7DF1E", isBrand: true },
      { name: "Tailwind CSS", slug: "tailwindcss", color: "#06B6D4", isBrand: true },
      { name: "HTML5", slug: "html5", color: "#E34F26", isBrand: true },
      { name: "CSS3", slug: "css3", color: "#1572B6", isBrand: true },
      { name: "Node.js", slug: "nodedotjs", color: "#339933", isBrand: true },
      { name: "Express.js", slug: "express", color: "#FFFFFF", isBrand: true },
      { name: "PHP", slug: "php", color: "#777BB4", isBrand: true },
      { name: "Laravel", slug: "laravel", color: "#FF2D20", isBrand: true },
      { name: "Angular", slug: "angular", color: "#DD0031", isBrand: true },
      { name: "Vue.js", slug: "vuedotjs", color: "#4FC08D", isBrand: true },
      { name: "MySQL", slug: "mysql", color: "#4479A1", isBrand: true },
      { name: "MongoDB", slug: "mongodb", color: "#47A248", isBrand: true },
      { name: "PostgreSQL", slug: "postgresql", color: "#4169E1", isBrand: true },
      { name: "Postman", slug: "postman", color: "#FF6C37", isBrand: true },
    ],
  },
  {
    id: "development-systems",
    title: "Development & Systems",
    description:
      "Tools and platforms used for development, version control, operating systems, and network environments.",
    icon: Terminal,
    accentColor: "#06B6D4",
    tools: [
      { name: "Git", slug: "git", color: "#F05032", isBrand: true },
      { name: "GitHub", slug: "github", color: "#FFFFFF", isBrand: true },
      { name: "Vercel", slug: "vercel", color: "#FFFFFF", isBrand: true },
      { name: "VS Code", slug: "vscode", color: "#007ACC", isBrand: true },
      { name: "Docker", slug: "docker", color: "#2496ED", isBrand: true },
      { name: "VirtualBox", slug: "virtualbox", color: "#2F61B4", isBrand: true },
      { name: "Cisco Packet Tracer", slug: "cisco", color: "#1BA0D7", isBrand: true },
    ],
  },
];

export function Skills() {
  const canHover = useFineHover();

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-t border-border/60 px-6 py-24 sm:px-10 sm:py-32 lg:px-16 relative overflow-hidden"
    >
      {/* Background glow ambient effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/4 size-96 rounded-full bg-blue-500/5 blur-[120px] [@media(pointer:coarse)]:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 bottom-1/4 size-96 rounded-full bg-purple-500/5 blur-[120px] [@media(pointer:coarse)]:hidden"
      />

      <div className="mx-auto w-full max-w-5xl relative z-10">
        <FadeIn>
          <SectionHeader
            label="Capabilities"
            title="Tech Stack & Toolkit"
            description="Tools and technologies used for building web systems and supporting networks."
            headingId="skills-heading"
          />
        </FadeIn>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {coreCategories.map((category, index) => (
            <FadeIn key={category.id} delay={0.1 + index * 0.05}>
              <GlassCard
                as={motion.article}
                initial="rest"
                whileHover={canHover ? "hover" : undefined}
                animate="rest"
                className="relative h-full overflow-visible p-6 sm:p-8"
              >
                <div className="mb-5 flex items-start gap-4">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border dark:border-white/10 bg-foreground/5 dark:bg-white/5"
                    style={{
                      borderColor: `${category.accentColor}25`,
                      backgroundColor: `${category.accentColor}08`,
                      color: category.accentColor,
                    }}
                  >
                    <category.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="relative inline-block">
                      <h3 className="text-xl font-semibold tracking-tight text-foreground">
                        {category.title}
                      </h3>
                      <motion.span
                        aria-hidden="true"
                        className="absolute -bottom-2 left-0 h-px w-full origin-left"
                        style={{
                          background: `linear-gradient(to right, ${category.accentColor}cc, #a78bfa80, transparent)`,
                          filter: `blur(0.5px)`,
                        }}
                        variants={{
                          rest: { scaleX: 0, opacity: 0 },
                          hover: {
                            scaleX: 1,
                            opacity: 1,
                            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                          },
                        }}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>

                <ul className="mt-6 flex flex-wrap gap-3">
                  {category.tools.map((tool) => (
                    <li key={tool.slug}>
                      <ToolButton
                        tool={tool}
                        categoryTitle={category.title}
                        size="lg"
                        focusRingColor="focus-visible:ring-blue-500/50 focus-visible:border-blue-500/40"
                      />
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
