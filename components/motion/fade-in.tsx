"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getRevealTransition } from "@/lib/motion";
import { useCoarsePointer } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useCoarsePointer();
  const revealY = prefersReducedMotion ? 0 : isCoarsePointer ? 12 : 20;

  return (
    <motion.div
      className={cn(className)}
      initial={{
        opacity: 0,
        y: revealY,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: isCoarsePointer ? "-64px 0px" : "-32px",
        amount: isCoarsePointer ? 0.12 : 0.2,
      }}
      transition={getRevealTransition(
        prefersReducedMotion,
        delay,
        isCoarsePointer,
      )}
    >
      {children}
    </motion.div>
  );
}
