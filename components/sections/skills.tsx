"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Code2,
  Network,
  Bot,
  Database,
  FolderKanban,
  FileText,
  Palette,
  MessageSquare,
  Server,
  Terminal,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/section-header";
import { BrandIcon, type IconName } from "@/components/icons/brand-icons";
import { cn } from "@/lib/utils";

// Define structures for our skills and categories
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
  accentColor: string; // Hex color for borders/glows
  tools: Tool[];
}

export function Skills() {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  // Grouped skills database
  const coreCategories: Category[] = [
    {
      id: "web-dev",
      title: "Web Development & Engineering",
      description: "Building responsive, modern, and high-performance web applications using clean code principles and robust state management.",
      icon: Code2,
      accentColor: "#3B82F6", // Blue
      tools: [
        { name: "React", slug: "react", color: "#61DAFB", isBrand: true },
        { name: "Next.js", slug: "nextdotjs", color: "#FFFFFF", isBrand: true },
        { name: "TypeScript", slug: "typescript", color: "#3178C6", isBrand: true },
        { name: "Tailwind CSS", slug: "tailwindcss", color: "#06B6D4", isBrand: true },
        { name: "HTML5", slug: "html5", color: "#E34F26", isBrand: true },
        { name: "CSS3", slug: "css3", color: "#1572B6", isBrand: true },
        { name: "JavaScript", slug: "javascript", color: "#F7DF1E", isBrand: true },
        { name: "Node.js", slug: "nodedotjs", color: "#339933", isBrand: true },
        { name: "Git", slug: "git", color: "#F05032", isBrand: true },
      ],
    },
    {
      id: "networking-it",
      title: "Networking & IT Support",
      description: "Designing reliable network topologies, executing system configuration, troubleshooting software/hardware, and managing administration roles.",
      icon: Network,
      accentColor: "#06B6D4", // Cyan
      tools: [
        { name: "Cisco Systems", slug: "cisco", color: "#1BA0D7", isBrand: true },
        { name: "Wireshark", slug: "wireshark", color: "#1679A7", isBrand: true },
        { name: "Windows OS", slug: "windows", color: "#0078D4", isBrand: true },
        { name: "Linux OS", slug: "linux", color: "#FCC624", isBrand: true },
        { name: "Active Directory", slug: "activedirectory", color: "#60A5FA", isBrand: false, lucideIcon: Server },
        { name: "CLI / Bash / PowerShell", slug: "cli", color: "#34D399", isBrand: false, lucideIcon: Terminal },
        { name: "Diagnostics & Support", slug: "diagnostics", color: "#FBBF24", isBrand: false, lucideIcon: Wrench },
      ],
    },
  ];

  const operationalCategories: Category[] = [
    {
      id: "ai-automation",
      title: "AI & Automation",
      description: "Optimizing productivity by building pipelines, automating workflows, and leveraging artificial intelligence.",
      icon: Bot,
      accentColor: "#8B5CF6", // Purple
      tools: [
        { name: "ChatGPT", slug: "openai", color: "#10A37F", isBrand: true },
        { name: "Zapier", slug: "zapier", color: "#FF4F00", isBrand: true },
        { name: "Make.com", slug: "make", color: "#FF007F", isBrand: true },
        { name: "n8n", slug: "n8n", color: "#FF6C37", isBrand: true },
      ],
    },
    {
      id: "crm-db",
      title: "CRM & Database",
      description: "Managing customer relationships and structuring data pipelines for clean organization.",
      icon: Database,
      accentColor: "#F97316", // Orange
      tools: [
        { name: "HubSpot CRM", slug: "hubspot", color: "#FF7A59", isBrand: true },
        { name: "Airtable", slug: "airtable", color: "#18BFFF", isBrand: true },
      ],
    },
    {
      id: "project-mgmt",
      title: "Project Management",
      description: "Organizing sprints, monitoring deliverables, and establishing documentation hierarchies.",
      icon: FolderKanban,
      accentColor: "#6366F1", // Indigo
      tools: [
        { name: "Trello", slug: "trello", color: "#0079BF", isBrand: true },
        { name: "Notion", slug: "notion", color: "#FFFFFF", isBrand: true },
        { name: "ClickUp", slug: "clickup", color: "#7B68EE", isBrand: true },
      ],
    },
    {
      id: "productivity-office",
      title: "Productivity & Office",
      description: "Designing workflows and documenting processes with modern office platforms.",
      icon: FileText,
      accentColor: "#10B981", // Green
      tools: [
        { name: "Google Docs", slug: "googledocs", color: "#4285F4", isBrand: true },
        { name: "Google Sheets", slug: "googlesheets", color: "#0F9D58", isBrand: true },
        { name: "Google Drive", slug: "googledrive", color: "#4285F4", isBrand: true },
        { name: "Google Calendar", slug: "googlecalendar", color: "#4285F4", isBrand: true },
        { name: "Google Forms", slug: "googleforms", color: "#7248B9", isBrand: true },
        { name: "Microsoft Office", slug: "microsoft", color: "#D83B01", isBrand: true },
      ],
    },
    {
      id: "creative-design",
      title: "Creative Design",
      description: "Crafting graphic layout collaterals and presentation templates.",
      icon: Palette,
      accentColor: "#EC4899", // Pink
      tools: [
        { name: "Canva", slug: "canva", color: "#00C4CC", isBrand: true },
      ],
    },
    {
      id: "communication",
      title: "Communication",
      description: "Managing asynchronous communications and coordinating virtual standups.",
      icon: MessageSquare,
      accentColor: "#F43F5E", // Rose
      tools: [
        { name: "Gmail", slug: "gmail", color: "#EA4335", isBrand: true },
        { name: "Slack", slug: "slack", color: "#4A154B", isBrand: true },
        { name: "Zoom", slug: "zoom", color: "#2D8CFF", isBrand: true },
        { name: "Google Meet", slug: "googlemeet", color: "#00897B", isBrand: true },
      ],
    },
  ];

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-t border-border/60 px-6 py-24 sm:px-10 sm:py-32 lg:px-16 relative overflow-hidden"
    >
      {/* Background glow ambient effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/4 size-96 rounded-full bg-blue-500/5 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 bottom-1/4 size-96 rounded-full bg-purple-500/5 blur-[120px]"
      />

      <div className="mx-auto w-full max-w-5xl relative z-10">
        <FadeIn>
          <SectionHeader
            label="Capabilities"
            title="Tech Stack & Toolkit"
            description="My complete professional toolkit. Highlighting core development and systems engineering skills, complemented by administrative workflows and automation processes."
            headingId="skills-heading"
          />
        </FadeIn>

        {/* Section A: Core Engineering & Systems */}
        <div className="mt-16">
          <FadeIn delay={0.05}>
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-blue-500" />
              <h4 className="font-mono text-xs font-semibold tracking-wider text-blue-400 uppercase">
                Core Tech Stack
              </h4>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-2">
            {coreCategories.map((category, index) => (
              <FadeIn key={category.id} delay={0.1 + index * 0.05}>
                <article
                  className="relative h-full overflow-visible rounded-2xl border border-white/10 bg-white/[0.01] p-6 sm:p-8 hover:bg-white/[0.03] hover:border-white/15 transition-all duration-300 group"
                >
                  {/* Subtle top-border glow on hover */}
                  <div
                    className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      backgroundImage: `linear-gradient(to right, transparent, ${category.accentColor}, transparent)`,
                    }}
                  />

                  {/* Header */}
                  <div className="mb-5 flex items-start gap-4">
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300"
                      style={{
                        borderColor: `${category.accentColor}25`,
                        backgroundColor: `${category.accentColor}08`,
                        color: category.accentColor,
                      }}
                    >
                      <category.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-white transition-colors duration-300">
                        {category.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Icon Grid */}
                  <ul className="mt-6 flex flex-wrap gap-3">
                    {category.tools.map((tool) => (
                      <li key={tool.slug}>
                        <button
                          type="button"
                          aria-label={`${tool.name} - ${category.title}`}
                          className="relative flex size-12 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] text-muted-foreground outline-none transition-all duration-300 hover:text-foreground focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/40"
                          style={{
                            borderColor: hoveredTool === tool.slug ? `${tool.color}35` : undefined,
                            boxShadow: hoveredTool === tool.slug ? `0 0 16px ${tool.color}15` : undefined,
                          }}
                          onMouseEnter={() => setHoveredTool(tool.slug)}
                          onMouseLeave={() => setHoveredTool(null)}
                          onFocus={() => setHoveredTool(tool.slug)}
                          onBlur={() => setHoveredTool(null)}
                        >
                          {/* Colored ambient glow */}
                          <AnimatePresence>
                            {hoveredTool === tool.slug && (
                              <motion.div
                                className="absolute inset-0 -z-10 rounded-xl"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.18, scale: 1 }}
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
                              className="size-6 transition-all duration-300"
                              style={{
                                color: hoveredTool === tool.slug ? tool.color : "currentColor",
                                transform: hoveredTool === tool.slug && !prefersReducedMotion ? "scale(1.1)" : "none",
                              }}
                            />
                          ) : (
                            tool.lucideIcon && (
                              <tool.lucideIcon
                                className="size-6 transition-all duration-300"
                                style={{
                                  color: hoveredTool === tool.slug ? tool.color : "currentColor",
                                  transform: hoveredTool === tool.slug && !prefersReducedMotion ? "scale(1.1)" : "none",
                                }}
                              />
                            )
                          )}

                          {/* Accessible Tooltip */}
                          <AnimatePresence>
                            {hoveredTool === tool.slug && (
                              <motion.span
                                initial={{ opacity: 0, y: 6, x: "-50%" }}
                                animate={{ opacity: 1, y: 0, x: "-50%" }}
                                exit={{ opacity: 0, y: 6, x: "-50%" }}
                                transition={{ duration: 0.12, ease: "easeOut" }}
                                className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-900 border border-white/10 shadow-2xl px-2.5 py-1 text-[11px] font-medium text-foreground tracking-wide"
                              >
                                {tool.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </li>
                    ))}
                  </ul>
                </article>
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
                Operations & Toolkit
              </h4>
            </div>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {operationalCategories.map((category, index) => (
              <FadeIn key={category.id} delay={0.1 + index * 0.05}>
                <article
                  className="relative h-full overflow-visible rounded-2xl border border-white/10 bg-white/[0.01] p-6 hover:bg-white/[0.03] hover:border-white/15 transition-all duration-300 group"
                >
                  {/* Subtle top-border glow on hover */}
                  <div
                    className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      backgroundImage: `linear-gradient(to right, transparent, ${category.accentColor}, transparent)`,
                    }}
                  />

                  {/* Header */}
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all duration-300"
                      style={{
                        borderColor: `${category.accentColor}25`,
                        backgroundColor: `${category.accentColor}08`,
                        color: category.accentColor,
                      }}
                    >
                      <category.icon className="size-4" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-white transition-colors duration-300">
                      {category.title}
                    </h3>
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground min-h-[40px]">
                    {category.description}
                  </p>

                  {/* Icon Grid */}
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {category.tools.map((tool) => (
                      <li key={tool.slug}>
                        <button
                          type="button"
                          aria-label={`${tool.name} - ${category.title}`}
                          className="relative flex size-10 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-muted-foreground outline-none transition-all duration-300 hover:text-foreground focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/40"
                          style={{
                            borderColor: hoveredTool === tool.slug ? `${tool.color}35` : undefined,
                            boxShadow: hoveredTool === tool.slug ? `0 0 14px ${tool.color}12` : undefined,
                          }}
                          onMouseEnter={() => setHoveredTool(tool.slug)}
                          onMouseLeave={() => setHoveredTool(null)}
                          onFocus={() => setHoveredTool(tool.slug)}
                          onBlur={() => setHoveredTool(null)}
                        >
                          {/* Colored ambient glow */}
                          <AnimatePresence>
                            {hoveredTool === tool.slug && (
                              <motion.div
                                className="absolute inset-0 -z-10 rounded-lg"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.16, scale: 1 }}
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
                              className="size-5 transition-all duration-300"
                              style={{
                                color: hoveredTool === tool.slug ? tool.color : "currentColor",
                                transform: hoveredTool === tool.slug && !prefersReducedMotion ? "scale(1.1)" : "none",
                              }}
                            />
                          ) : (
                            tool.lucideIcon && (
                              <tool.lucideIcon
                                className="size-5 transition-all duration-300"
                                style={{
                                  color: hoveredTool === tool.slug ? tool.color : "currentColor",
                                  transform: hoveredTool === tool.slug && !prefersReducedMotion ? "scale(1.1)" : "none",
                                }}
                              />
                            )
                          )}

                          {/* Accessible Tooltip */}
                          <AnimatePresence>
                            {hoveredTool === tool.slug && (
                              <motion.span
                                initial={{ opacity: 0, y: 5, x: "-50%" }}
                                animate={{ opacity: 1, y: 0, x: "-50%" }}
                                exit={{ opacity: 0, y: 5, x: "-50%" }}
                                transition={{ duration: 0.12, ease: "easeOut" }}
                                className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 border border-white/10 shadow-xl px-2 py-0.5 text-[10px] font-medium text-foreground tracking-wide"
                              >
                                {tool.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </li>
                    ))}
                  </ul>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
