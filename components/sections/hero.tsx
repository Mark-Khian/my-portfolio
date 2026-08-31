"use client";

import { useState, useEffect, useRef } from "react";

import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, Mail, FileText } from "lucide-react";

import { HeroBackground } from "@/components/hero-background";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PortfolioTerminal } from "@/components/ui/portfolio-terminal";
import { CvModal } from "@/components/ui/cv-modal";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function getStaggerTransition(reducedMotion: boolean | null) {
  return reducedMotion ? { duration: 0 } : { duration: 0.55, ease: EASE };
}

export function Hero({ onConnectClick }: { onConnectClick?: () => void }) {
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [highlightContact, setHighlightContact] = useState(false);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const itemTransition = getStaggerTransition(prefersReducedMotion);

  useEffect(() => {
    const handleHighlight = () => {
      setHighlightContact(true);
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightContact(false);
      }, 2000);
    };

    window.addEventListener("highlight-contact", handleHighlight);
    return () => window.removeEventListener("highlight-contact", handleHighlight);
  }, []);

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
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 18,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: itemTransition,
    },
  };



  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col justify-center px-6 pb-16 pt-24 sm:px-10 lg:px-16"
    >
      <HeroBackground />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1400px] xl:grid xl:grid-cols-12 xl:items-stretch xl:gap-8 2xl:gap-12"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <div className="xl:col-span-8 flex flex-col">
          <GlassCard className="h-full w-full px-6 py-5 sm:px-8 sm:py-6 lg:px-12 lg:py-8">
            <div className="flex h-full flex-col gap-3 sm:gap-4 justify-center">
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-medium text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:bg-white/5 [@media(hover:hover)_and_(pointer:fine)]:backdrop-blur-sm">
                  <span
                    className="mr-2 inline-block size-1.5 shrink-0 rounded-full bg-emerald-500"
                    aria-hidden="true"
                  />
                  <span className="line-clamp-2 sm:line-clamp-1">{siteConfig.availability}</span>
                </span>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:leading-[1.05] xl:whitespace-nowrap">
                  {siteConfig.name}
                </h1>

                <p className="font-mono text-sm text-blue-400 sm:text-base">
                  {siteConfig.role}
                </p>

                <p className="max-w-2xl text-2xl font-medium text-foreground/90 sm:text-3xl text-balance">
                  {siteConfig.tagline}
                </p>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                {siteConfig.description}
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-1 grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:items-center"
              >
                <motion.div 
                  className="col-span-2 sm:col-span-1"
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                >
                  <a
                    href={`#${siteConfig.sections.services}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(siteConfig.sections.services)?.scrollIntoView({ behavior: 'smooth' });
                      window.history.pushState(null, '', `#${siteConfig.sections.services}`);
                    }}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-6 text-sm font-medium text-white outline-none transition-all hover:bg-blue-600 focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <Briefcase className="size-4" />
                    <span>Services</span>
                  </a>
                </motion.div>
                
                <motion.div 
                  className="col-span-1"
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    onClick={onConnectClick}
                    variant="outline"
                    className={cn(
                      "h-11 w-full flex items-center justify-center gap-1.5 cursor-pointer rounded-full px-2 sm:px-6 text-xs sm:text-sm font-medium border transition-all duration-300",
                      highlightContact
                        ? "border-blue-500 bg-blue-500/20 text-blue-400 shadow-[0_0_24px_rgba(59,130,246,0.3)]"
                        : "border-white/10 !bg-transparent hover:!bg-white/10"
                    )}
                  >
                    <Mail className="size-4" />
                    <span>Contact Me</span>
                  </Button>
                </motion.div>
                
                <motion.div 
                  className="col-span-1 sm:w-auto sm:ml-auto"
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    onClick={() => setIsCvModalOpen(true)}
                    variant="outline"
                    className="h-11 w-full flex items-center justify-center gap-1.5 cursor-pointer rounded-full px-2 sm:px-6 text-xs sm:text-sm font-medium border border-white/10 !bg-transparent hover:!bg-white/10 transition-colors"
                  >
                    <FileText className="size-4" />
                    <span>View CV</span>
                  </Button>
                </motion.div>
              </motion.div>

            </div>
          </GlassCard>
        </div>

        <motion.div 
          className="xl:col-span-4 mt-8 xl:mt-0 w-full flex justify-end"
          variants={itemVariants}
        >
          <PortfolioTerminal onConnectClick={onConnectClick} />
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center justify-center md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { delay: 0.9, duration: 0.5, ease: EASE }
        }
      >
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            window.history.pushState(null, '', '#about');
          }}
          aria-label="Scroll to about section"
          className="pointer-events-auto group flex cursor-pointer flex-col items-center gap-4"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/50 transition-colors group-hover:text-white/90">
            Scroll to Explore
          </span>
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/20 p-1 transition-colors group-hover:border-white/40">
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
              className="h-1.5 w-1 rounded-full bg-blue-500"
              aria-hidden="true"
            />
          </div>
        </a>
      </motion.div>
      <CvModal isOpen={isCvModalOpen} onClose={() => setIsCvModalOpen(false)} />
    </section>
  );
}
