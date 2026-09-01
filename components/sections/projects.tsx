"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ExternalLink, Globe, FileText } from "lucide-react";
import Link from "next/link";
import { GitHubIcon } from "@/components/icons/github";

import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import type { Project } from "@/lib/projects-content";
import { useFineHover } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  live: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "in-progress": "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
} as const;

const STATUS_LABELS = {
  live: "Live",
  completed: "Completed",
  "in-progress": "In Progress",
} as const;

const CATEGORIES = [
  "All",
  "Web Development",
  "Networking",
  "Server & Systems",
  "Database",
  "Graphic Design",
  "Workspace / VA",
];

export function Projects({ projects }: { projects: Project[] }) {
  const prefersReducedMotion = useReducedMotion();
  const canHover = useFineHover();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-t border-border/60 px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto w-full max-w-5xl">
        <FadeIn>
          <SectionHeader
            label="Work"
            title="Projects & Builds"
            description="A selection of projects that demonstrate my skills across web development, networking, and IT — from academic work to personal builds."
            headingId="projects-heading"
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                  activeCategory === category
                    ? "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "border-border dark:border-white/10 bg-foreground/5 dark:bg-white/5 text-muted-foreground hover:bg-foreground/10 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </FadeIn>

        <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard
                as={motion.article}
                initial="rest"
                whileHover={canHover ? "hover" : undefined}
                animate="rest"
                className="flex h-full flex-col p-6 sm:p-8"
              >
                {/* Optional Thumbnail */}
                {project.thumbnailUrl && (
                  <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-foreground/5 dark:bg-white/5 border border-border dark:border-white/5 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={project.thumbnailUrl} 
                      alt={project.thumbnailAltText || `${project.title} thumbnail`} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    {/* Title + underline accent */}
                    <div className="relative inline-block">
                      <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-foreground dark:group-hover:text-white">
                        {project.title}
                      </h3>
                      <motion.span
                        aria-hidden="true"
                        className="absolute -bottom-1.5 left-0 h-px w-full origin-left"
                        style={{
                          background: `linear-gradient(to right, ${project.accentColor}cc, #a78bfa80, transparent)`,
                          filter: "blur(0.5px)",
                        }}
                        variants={{
                          rest: { scaleX: 0, opacity: 0 },
                          hover: {
                            scaleX: 1,
                            opacity: 1,
                            transition: {
                              duration: 0.35,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {/* Status badge */}
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase",
                      STATUS_STYLES[project.status],
                    )}
                  >
                    {STATUS_LABELS[project.status]}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border dark:border-white/8 bg-foreground/[0.03] dark:bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA & Links */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border dark:border-white/5 pt-5">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                  >
                    View Case Study
                  </Link>

                  <div className="flex items-center gap-3">
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "group/link inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
                          "transition-colors duration-200 hover:text-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded",
                          !prefersReducedMotion && "motion-safe:hover:-translate-y-px motion-safe:transition-transform",
                        )}
                      >
                        <Globe className="size-3.5" aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only sm:inline-block">Live Site</span>
                        <ExternalLink
                          className="size-3 opacity-0 transition-opacity group-hover/link:opacity-60"
                          aria-hidden="true"
                        />
                      </Link>
                    )}
                    {project.repositoryUrl && (
                      <Link
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "group/link inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
                          "transition-colors duration-200 hover:text-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded",
                          !prefersReducedMotion && "motion-safe:hover:-translate-y-px motion-safe:transition-transform",
                        )}
                      >
                        <GitHubIcon className="size-3.5" aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only sm:inline-block">GitHub</span>
                        <ExternalLink
                          className="size-3 opacity-0 transition-opacity group-hover/link:opacity-60"
                          aria-hidden="true"
                        />
                      </Link>
                    )}
                    {project.documentationUrl && (
                      <Link
                        href={project.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "group/link inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
                          "transition-colors duration-200 hover:text-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded",
                          !prefersReducedMotion && "motion-safe:hover:-translate-y-px motion-safe:transition-transform",
                        )}
                      >
                        <FileText className="size-3.5" aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only sm:inline-block">Docs</span>
                        <ExternalLink
                          className="size-3 opacity-0 transition-opacity group-hover/link:opacity-60"
                          aria-hidden="true"
                        />
                      </Link>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

        {/* Footer CTA */}
        <FadeIn delay={0.2}>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            More projects on{" "}
            <Link
              href="https://github.com/Mark-Khian"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded"
            >
              GitHub
            </Link>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
