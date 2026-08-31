"use client";

import { motion } from "framer-motion";
import { ClipboardList, Layers, Workflow } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { siteConfig } from "@/lib/site-config";
import { useFineHover } from "@/lib/use-media-query";

// Map services to specific icons
const SERVICE_ICONS = {
  "General Virtual Assistant": ClipboardList,
  "Full-Stack Development": Layers,
  "AI Automation": Workflow,
} as const;

const SERVICE_COLORS = {
  "General Virtual Assistant": "#10B981", // Emerald
  "Full-Stack Development": "#8B5CF6",    // Violet
  "AI Automation": "#06B6D4",         // Cyan
} as const;

export function Services() {
  const canHover = useFineHover();

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="border-t border-border/60 px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <FadeIn>
          <SectionHeader
            label="Services"
            title="What I Can Help With"
            description="Helping you stay organized, build better, and work smarter."
            headingId="services-heading"
          />
        </FadeIn>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {siteConfig.services.map((service, index) => {
            const Icon = SERVICE_ICONS[service.title as keyof typeof SERVICE_ICONS] || Layers;
            const accentColor = SERVICE_COLORS[service.title as keyof typeof SERVICE_COLORS] || "#3B82F6";

            return (
              <FadeIn key={service.title} delay={0.1 + index * 0.1} className="h-full">
                <GlassCard
                  as={motion.article}
                  initial="rest"
                  whileHover={canHover ? "hover" : undefined}
                  animate="rest"
                  className="group h-full p-6 sm:p-8"
                >
                  <div className="flex h-full flex-col">
                    <div className="mb-6 flex items-center gap-4">
                      <span
                        className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors duration-300"
                        style={{
                          borderColor: `${accentColor}25`,
                          backgroundColor: `${accentColor}08`,
                          color: accentColor,
                        }}
                      >
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <h3 className="text-xl font-semibold tracking-tight text-foreground">
                        {service.title}
                      </h3>
                    </div>

                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                      {service.shortDescription}
                    </p>

                    <ul className="mb-8 flex flex-col gap-3 flex-1">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                          <span 
                            className="mt-1.5 size-1.5 shrink-0 rounded-full" 
                            style={{ backgroundColor: accentColor }}
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
