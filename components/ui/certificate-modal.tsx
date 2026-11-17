"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMounted } from "@/hooks/use-is-mounted";
import type { Certification } from "@/lib/certifications-content";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certification | null;
}

export function CertificateModal({
  isOpen,
  onClose,
  certificate,
}: CertificateModalProps) {
  const mounted = useIsMounted();
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const [panBounds, setPanBounds] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const updateBounds = useCallback(() => {
    if (!containerRef.current || !imgRef.current) return;
    const container = containerRef.current.getBoundingClientRect();

    const imgW = imgRef.current.offsetWidth;
    const imgH = imgRef.current.offsetHeight;

    const scaledW = imgW * scale;
    const scaledH = imgH * scale;

    const overflowX = Math.max(0, (scaledW - container.width) / 2);
    const overflowY = Math.max(0, (scaledH - container.height) / 2);

    setPanBounds({
      left: -overflowX,
      right: overflowX,
      top: -overflowY,
      bottom: overflowY,
    });

    // Clamp current pan
    if (panX.get() > overflowX) panX.set(overflowX);
    if (panX.get() < -overflowX) panX.set(-overflowX);
    if (panY.get() > overflowY) panY.set(overflowY);
    if (panY.get() < -overflowY) panY.set(-overflowY);
  }, [scale, panX, panY]);

  // Update bounds on scale change and window resize
  useEffect(() => {
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, [updateBounds]);

  // Reset scale and pan when closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setScale(1);
        panX.set(0);
        panY.set(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, panX, panY]);

  // Reset pan when scale returns to 1
  useEffect(() => {
    if (scale === 1) {
      panX.set(0);
      panY.set(0);
    }
  }, [scale, panX, panY]);

  // Handle wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isOpen) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      let zoomDelta = 0;
      if (e.deltaMode === 1 || e.deltaMode === 2) {
        zoomDelta = e.deltaY > 0 ? -0.15 : 0.15;
      } else {
        if (Math.abs(e.deltaY) < 50) {
          zoomDelta = (e.deltaY > 0 ? -1 : 1) * 0.02;
        } else {
          zoomDelta = e.deltaY > 0 ? -0.15 : 0.15;
        }
      }

      setScale((prevScale) => {
        const newScale = prevScale + zoomDelta;
        return Math.min(2.5, Math.max(1, newScale));
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen]);

  if (!mounted || !certificate) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            data-lenis-prevent
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-modal-title"
            data-lenis-prevent
            className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border dark:border-white/10 bg-background dark:bg-[#0c0c0f] shadow-2xl"
            style={{ height: "min(85vh, 900px)" }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border dark:border-white/10 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border dark:border-white/10 bg-foreground/5 dark:bg-white/5">
                  <Image
                    src={certificate.logo}
                    alt={`${certificate.title} badge`}
                    width={32}
                    height={32}
                    className="size-full object-contain p-0.5"
                  />
                </div>
                <div className="min-w-0">
                  <h2
                    id="certificate-modal-title"
                    className="truncate text-sm font-semibold text-foreground sm:text-base"
                  >
                    {certificate.title}
                  </h2>
                  <p className="truncate text-xs text-muted-foreground">
                    {certificate.issuer}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/5 dark:hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                >
                  <X className="size-4 sm:size-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div
              ref={containerRef}
              className="flex flex-1 flex-col items-center justify-center bg-muted/50 dark:bg-black/20 p-6 text-center overflow-hidden relative"
            >
              <div className="flex h-full w-full items-center justify-center rounded-lg relative">
                <motion.img
                  ref={imgRef}
                  drag={scale > 1}
                  dragConstraints={panBounds}
                  dragElastic={0}
                  dragMomentum={false}
                  animate={{ scale }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  src={certificate.image}
                  alt={`${certificate.title} Certificate`}
                  draggable={false}
                  className={cn(
                    "max-h-full max-w-full rounded-lg object-contain select-none shadow-md",
                    scale > 1 ? "cursor-grab active:cursor-grabbing" : ""
                  )}
                  style={{
                    x: panX,
                    y: panY,
                    z: 0,
                    imageRendering: "auto",
                    WebkitFontSmoothing: "antialiased",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    willChange: "transform",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
