"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExternalLink, FileText } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { CertificateModal } from "@/components/ui/certificate-modal";
import {
  certifications,
  type Certification,
} from "@/lib/certifications-content";
import { useFineHover } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

function CertificationCard({
  cert,
  canHover,
  onSelectCertificate,
}: {
  cert: Certification;
  canHover: boolean;
  onSelectCertificate: (cert: Certification) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLogoFocused, setIsLogoFocused] = useState(false);

  const isPreviewActive = canHover && (isLogoHovered || isLogoFocused);

  const contentBlurStyle: React.CSSProperties = {
    filter: isPreviewActive ? "blur(5px)" : "none",
    opacity: isPreviewActive ? 0.45 : 1,
    transition: prefersReducedMotion
      ? "none"
      : "filter 250ms ease-out, opacity 250ms ease-out",
    WebkitFilter: isPreviewActive ? "blur(5px)" : "none",
  };

  return (
    <GlassCard
      as="article"
      className={cn(
        "relative h-full overflow-visible p-6 sm:p-8",
        isPreviewActive && "z-20"
      )}
      style={{
        borderColor:
          canHover && isCardHovered
            ? `color-mix(in srgb, ${cert.accentColor} 35%, transparent)`
            : undefined,
        boxShadow:
          canHover && isCardHovered
            ? `0 0 32px color-mix(in srgb, ${cert.accentColor} 12%, transparent), 0 8px 32px rgba(0, 0, 0, 0.12)`
            : undefined,
      }}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => {
        setIsCardHovered(false);
        setIsLogoHovered(false);
      }}
    >
      <div className="flex h-full flex-col justify-between">
        {/* Header row: logo on the LEFT, title + issuer on the right */}
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Logo layout box (72x72) */}
          <div
            tabIndex={0}
            role="img"
            aria-label={`${cert.title} logo (enlarged preview)`}
            className={cn(
              "relative flex size-[72px] shrink-0 items-center justify-center rounded-full outline-none transition-shadow",
              "focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              canHover && "cursor-zoom-in"
            )}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => {
              setIsLogoHovered(false);
              setIsLogoFocused(false);
            }}
            onFocus={(e) => {
              if (e.currentTarget.matches(":focus-visible")) {
                setIsLogoFocused(true);
              }
            }}
            onBlur={() => setIsLogoFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsLogoHovered(false);
                setIsLogoFocused(false);
              }
            }}
          >
            <Image
              src={cert.logo}
              alt={`${cert.title} logo`}
              width={cert.logoSize}
              height={cert.logoSize}
              className={cn(
                "rounded-full object-contain select-none",
                cert.logoSize === 78 && "-m-[3px]"
              )}
            />

            {/* Enlarged 200x200 preview copy (desktop only) */}
            <AnimatePresence>
              {isPreviewActive && (
                <motion.div
                  initial={
                    prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.85 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
                  }
                  style={{ transformOrigin: "left center" }}
                  className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 z-40 filter drop-shadow-2xl"
                >
                  <Image
                    src={cert.logo}
                    alt=""
                    aria-hidden="true"
                    width={200}
                    height={200}
                    className="size-[200px] max-w-none rounded-full object-contain filter drop-shadow-xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title + Issuer (blurred when preview is active) */}
          <div className="min-w-0 flex-1 pt-1" style={contentBlurStyle}>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {cert.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {cert.issuer}
            </p>
          </div>
        </div>

        {/* Description & Buttons (blurred when preview is active) */}
        <div
          className="flex flex-1 flex-col justify-between"
          style={contentBlurStyle}
        >
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {cert.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 pt-2">
            <a
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-9 gap-1.5 rounded-lg border-border/80 dark:border-white/10 hover:border-foreground/30 dark:hover:border-white/25 transition-colors cursor-pointer"
              )}
            >
              <span>Verify</span>
              <ExternalLink className="size-3.5 opacity-70" aria-hidden="true" />
            </a>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSelectCertificate(cert)}
              className="h-9 gap-1.5 rounded-lg border-border/80 dark:border-white/10 hover:border-foreground/30 dark:hover:border-white/25 transition-colors cursor-pointer"
            >
              <FileText className="size-3.5 opacity-70" aria-hidden="true" />
              <span>View certificate</span>
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export function Certifications() {
  const canHover = useFineHover();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectCertificate = (cert: Certification) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section
      id="certifications"
      aria-labelledby="certifications-heading"
      className="border-t border-border/60 px-6 py-24 sm:px-10 sm:py-32 lg:px-16 relative overflow-hidden"
    >
      {/* Background glow ambient effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/4 size-96 rounded-full bg-blue-500/5 blur-[120px] [@media(pointer:coarse)]:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 bottom-1/4 size-96 rounded-full bg-cyan-500/5 blur-[120px] [@media(pointer:coarse)]:hidden"
      />

      <div className="mx-auto w-full max-w-5xl relative z-10">
        <FadeIn>
          <SectionHeader
            label="CREDENTIALS"
            title="Certifications"
            description="Industry-recognized certifications, each verifiable with the issuer in one click."
            headingId="certifications-heading"
          />
        </FadeIn>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {certifications.map((cert, index) => (
            <FadeIn key={cert.id} delay={0.1 + index * 0.1} className="h-full">
              <CertificationCard
                cert={cert}
                canHover={canHover}
                onSelectCertificate={handleSelectCertificate}
              />
            </FadeIn>
          ))}
        </div>
      </div>

      <CertificateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        certificate={selectedCert}
      />
    </section>
  );
}

