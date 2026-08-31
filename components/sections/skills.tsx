"use client";

import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Code2,
  Terminal,
  Workflow,
  Settings,
  Network,
  Layers,
  FileText,
  MessageSquare,
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
      className="pointer-events-none absolute bottom-full left-1/2 z-[9999] mb-2 -translate-x-1/2 whitespace-nowrap rounded border border-white/10 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium tracking-wide text-foreground shadow-xl"
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

  return (
    <button
      type="button"
      aria-label={`${tool.name} - ${categoryTitle}`}
      className={cn(
        "relative flex items-center justify-center border border-white/5 bg-white/[0.02] text-muted-foreground outline-none transition-[border-color,box-shadow,transform] duration-300 hover:text-foreground focus-visible:ring-2 hover:-translate-y-0.5",
        btnSize,
        focusRingColor,
      )}
      style={{
        borderColor: hovered ? `${tool.color}35` : undefined,
        boxShadow: hovered ? `0 0 16px ${tool.color}15` : undefined,
      }}
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
              background: `radial-gradient(circle, ${tool.color} 0%, transparent 75%)`,
            }}
          />
        )}
      </AnimatePresence>

      {tool.isBrand ? (
        <BrandIcon
          name={tool.slug as IconName}
          className={cn("transition-[color,transform] duration-300", iconSize)}
          style={{
            color: hovered ? tool.color : "currentColor",
            transform: hovered && !prefersReducedMotion ? "scale(1.1)" : "none",
          }}
        />
      ) : (
        tool.lucideIcon && (
          <tool.lucideIcon
            className={cn("transition-[color,transform] duration-300", iconSize)}
            style={{
              color: hovered ? tool.color : "currentColor",
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
      { name: "Windows OS", slug: "windows", color: "#0078D4", isBrand: true },
      { name: "Linux OS", slug: "linux", color: "#FCC624", isBrand: true },
      { name: "Cisco Systems", slug: "cisco", color: "#1BA0D7", isBrand: true },
      { name: "Wireshark", slug: "wireshark", color: "#1679A7", isBrand: true },
    ],
  },
];

const operationalCategories: Category[] = [
  {
    id: "ai-automation",
    title: "AI Automation",
    description: "Tools and workflow capabilities used to connect processes, automate tasks, and add AI-assisted steps.",
    icon: Workflow,
    accentColor: "#8B5CF6",
    tools: [
      { name: "OpenAI", slug: "openai", color: "#10A37F", isBrand: true },
      { name: "Workflow Design", slug: "workflow-design", color: "#8B5CF6", isBrand: false, lucideIcon: Workflow },
      { name: "Process Automation", slug: "process-automation", color: "#8B5CF6", isBrand: false, lucideIcon: Settings },
      { name: "API Integration", slug: "api-integration", color: "#8B5CF6", isBrand: false, lucideIcon: Network },
      { name: "Data Mapping & Transformation", slug: "data-mapping", color: "#8B5CF6", isBrand: false, lucideIcon: Layers },
    ],
  },
  {
    id: "virtual-assistance",
    title: "Virtual Assistance",
    description: "Workspace and productivity tools for organizing information, schedules, records, and daily operations.",
    icon: FileText,
    accentColor: "#10B981",
    tools: [
      { name: "Google Docs", slug: "googledocs", color: "#4285F4", isBrand: true },
      { name: "Google Sheets", slug: "googlesheets", color: "#0F9D58", isBrand: true },
      { name: "Google Drive", slug: "googledrive", color: "#4285F4", isBrand: true },
      { name: "Google Calendar", slug: "googlecalendar", color: "#4285F4", isBrand: true },
      { name: "Google Forms", slug: "googleforms", color: "#7248B9", isBrand: true },
      { name: "Microsoft 365", slug: "microsoft", color: "#D83B01", isBrand: true },
      { name: "HubSpot", slug: "hubspot", color: "#FF7A59", isBrand: true },
      { name: "Airtable", slug: "airtable", color: "#18BFFF", isBrand: true },
    ],
  },
  {
    id: "collaboration-design",
    title: "Collaboration & Design",
    description: "Tools for communication, team coordination, project collaboration, and visual content.",
    icon: MessageSquare,
    accentColor: "#F43F5E",
    tools: [
      { name: "Gmail", slug: "gmail", color: "#EA4335", isBrand: true },
      { name: "Slack", slug: "slack", color: "#4A154B", isBrand: true },
      { name: "Zoom", slug: "zoom", color: "#2D8CFF", isBrand: true },
      { name: "Google Meet", slug: "googlemeet", color: "#00897B", isBrand: true },
      { name: "Canva", slug: "canva", color: "#00C4CC", isBrand: true },
      { name: "ClickUp", slug: "clickup", color: "#7B68EE", isBrand: true },
      { name: "Asana", slug: "asana", color: "#F06A6A", isBrand: true },
      { name: "Trello", slug: "trello", color: "#0079BF", isBrand: true },
      { name: "Notion", slug: "notion", color: "#FFFFFF", isBrand: true },
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
            description="A modern toolkit for building reliable systems and smoother workflows."
            headingId="skills-heading"
          />
        </FadeIn>

        {/* Section A: Core Engineering & Systems */}
        <div className="mt-16">
          <FadeIn delay={0.05}>
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-blue-500" />
              <h4 className="font-mono text-xs font-semibold tracking-wider text-blue-400 uppercase">
                Development & Systems
              </h4>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-2">
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
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5"
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

        {/* Section B: Operations & Digital Workflows */}
        <div className="mt-20">
          <FadeIn delay={0.05}>
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-purple-500" />
              <h4 className="font-mono text-xs font-semibold tracking-wider text-purple-400 uppercase">
                Automation & Productivity
              </h4>
            </div>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {operationalCategories.map((category, index) => (
              <FadeIn key={category.id} delay={0.1 + index * 0.05}>
                <GlassCard
                  as={motion.article}
                  initial="rest"
                  whileHover={canHover ? "hover" : undefined}
                  animate="rest"
                  className="relative h-full overflow-visible p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"
                      style={{
                        borderColor: `${category.accentColor}25`,
                        backgroundColor: `${category.accentColor}08`,
                        color: category.accentColor,
                      }}
                    >
                      <category.icon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="relative min-w-0">
                      <h3 className="text-base font-semibold tracking-tight text-foreground">
                        {category.title}
                      </h3>
                      <motion.span
                        aria-hidden="true"
                        className="absolute -bottom-1.5 left-0 h-px w-full origin-left"
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
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground min-h-[40px]">
                    {category.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {category.tools.map((tool) => (
                      <li key={tool.slug}>
                        <ToolButton
                          tool={tool}
                          categoryTitle={category.title}
                          size="sm"
                          focusRingColor="focus-visible:ring-purple-500/50 focus-visible:border-purple-500/40"
                        />
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
