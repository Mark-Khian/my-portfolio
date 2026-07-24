"use client";

import { motion, useReducedMotion } from "framer-motion";

import { getRevealTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={{
        opacity: 0,
        y: prefersReducedMotion ? 0 : 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true, margin: "-64px" }}
      transition={getRevealTransition(prefersReducedMotion, delay)}
    >
      {children}
    </motion.div>
  );
}
