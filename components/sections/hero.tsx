"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import Link from "next/link";

import { GitHubIcon } from "@/components/icons/github";

import { HeroBackground } from "@/components/hero-background";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function getStaggerTransition(reducedMotion: boolean | null) {
  return reducedMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: EASE };
}

export function Hero({ onConnectClick }: { onConnectClick?: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const itemTransition = getStaggerTransition(prefersReducedMotion);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { staggerChildren: 0.09, delayChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: itemTransition,
    },
  };

  const { github, email } = siteConfig.links;
  const hasSocialLinks = Boolean(github || email);

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col justify-center px-6 pb-16 pt-24 sm:px-10 lg:px-16"
    >
      <HeroBackground />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <span
              className="mr-2 inline-block size-1.5 rounded-full bg-blue-500"
              aria-hidden="true"
            />
            {siteConfig.availability}
          </span>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 space-y-4">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            {siteConfig.name}
          </h1>

          <p className="font-mono text-sm text-blue-400 sm:text-base">
            {siteConfig.role}
          </p>

          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {siteConfig.tagline}
          </p>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {siteConfig.description}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Button
            nativeButton={false}
            render={
              <Link href={`#${siteConfig.sections.projects}`}>
                Discover More
              </Link>
            }
            className="h-11 rounded-full bg-blue-500 px-6 text-sm font-medium text-white hover:bg-blue-600"
          />
          <Button
            onClick={onConnectClick}
            variant="outline"
            className="h-11 rounded-full px-6 text-sm font-medium cursor-pointer"
          >
            Let's Connect
          </Button>
        </motion.div>

        {hasSocialLinks ? (
          <motion.div
            variants={itemVariants}
            className="mt-8 flex items-center gap-2"
          >
            {github ? (
              <Button
                nativeButton={false}
                variant="ghost"
                size="icon-lg"
                render={
                  <Link
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                  >
                    <GitHubIcon className="size-5" />
                  </Link>
                }
                className="rounded-full text-muted-foreground hover:text-foreground"
              />
            ) : null}
            {email ? (
              <Button
                nativeButton={false}
                variant="ghost"
                size="icon-lg"
                render={
                  <Link href={`mailto:${email}`} aria-label="Send email">
                    <Mail />
                  </Link>
                }
                className="rounded-full text-muted-foreground hover:text-foreground"
              />
            ) : null}
          </motion.div>
        ) : null}
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto mt-auto flex w-full max-w-5xl justify-center pt-16 sm:justify-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { delay: 0.9, duration: 0.5, ease: EASE }
        }
      >
        <Link
          href="#about"
          className={cn(
            "group inline-flex flex-col items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:items-start",
            prefersReducedMotion ? "" : "motion-safe:animate-none",
          )}
        >
          <span>Scroll</span>
          <ArrowDown
            className={cn(
              "size-4 transition-transform group-hover:translate-y-0.5",
              !prefersReducedMotion &&
                "motion-safe:animate-[bounce-gentle_2s_ease-in-out_infinite]",
            )}
            aria-hidden="true"
          />
        </Link>
      </motion.div>
    </section>
  );
}
