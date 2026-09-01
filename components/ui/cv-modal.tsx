"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { X, Download, FileText, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { useIsMounted } from "@/hooks/use-is-mounted";

// When the real CV is available, set this to the PDF path (e.g. "/mark_khian_cv.pdf")
const cvFile: string | null = "/Mark_Khian_CV_v4.png";
const cvPdfFile: string | null = "/Mark_Khian_Pangilinan_CV_v3.pdf";

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CvModal({ isOpen, onClose }: CvModalProps) {
  const mounted = useIsMounted();
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const [panBounds, setPanBounds] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

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
      setTimeout(() => {
        setScale(1);
        panX.set(0);
        panY.set(0);
      }, 300);
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
      // Prevent default scrolling only when zooming the CV
      if (!cvFile || cvFile.toLowerCase().endsWith('.pdf')) return;
      e.preventDefault();

      let zoomDelta = 0;
      if (e.deltaMode === 1 || e.deltaMode === 2) {
        // Line or Page mode (often Firefox or specific mouse settings)
        zoomDelta = e.deltaY > 0 ? -0.15 : 0.15;
      } else {
        // Pixel mode
        // Trackpads fire many small events. Typical mouse wheel fires >= 100
        if (Math.abs(e.deltaY) < 50) {
          zoomDelta = (e.deltaY > 0 ? -1 : 1) * 0.02; // Small increment for trackpad smooth scrolling
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

  if (!mounted) return null;

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
            aria-labelledby="cv-modal-title"
            data-lenis-prevent
            className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border dark:border-white/10 bg-background dark:bg-[#0c0c0f] shadow-2xl"
            style={{ height: "min(85vh, 900px)" }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border dark:border-white/10 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <FileText className="size-4" />
                </div>
                <div>
                  <h2 id="cv-modal-title" className="text-sm font-semibold text-foreground sm:text-base">
                    Curriculum Vitae
                  </h2>
                  <p className="text-xs text-muted-foreground">{siteConfig.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                {cvFile && !cvFile.toLowerCase().endsWith('.pdf') && (
                  <div className="hidden sm:flex items-center gap-1 mr-2 rounded-lg bg-foreground/5 dark:bg-white/5 p-1 border border-border dark:border-white/5">
                    <span className="hidden md:inline-block px-2 text-[10px] text-muted-foreground/60 border-r border-border dark:border-white/10 mr-1 pr-3 select-none">
                      Scroll to zoom &middot; Drag to pan
                    </span>

                    <button
                      type="button"
                      onClick={() => setScale(s => Math.max(1, s - 0.25))}
                      disabled={scale <= 1}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 dark:hover:bg-white/10 hover:text-foreground disabled:opacity-50 disabled:hover:bg-transparent"
                      title="Zoom Out"
                    >
                      <ZoomOut className="size-4" />
                    </button>

                    <span className="w-12 text-center text-xs font-medium text-muted-foreground select-none">
                      {Math.round(scale * 100)}%
                    </span>

                    <button
                      type="button"
                      onClick={() => setScale(s => Math.min(2.5, s + 0.25))}
                      disabled={scale >= 2.5}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 dark:hover:bg-white/10 hover:text-foreground disabled:opacity-50 disabled:hover:bg-transparent"
                      title="Zoom In"
                    >
                      <ZoomIn className="size-4" />
                    </button>

                    <div className="mx-0.5 h-3 w-px bg-foreground/10 dark:bg-white/10" />

                    <button
                      type="button"
                      onClick={() => {
                        setScale(1);
                        panX.set(0);
                        panY.set(0);
                      }}
                      disabled={scale === 1}
                      className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 dark:hover:bg-white/10 hover:text-foreground disabled:opacity-50 disabled:hover:bg-transparent"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="size-3.5" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  disabled={!cvPdfFile}
                  onClick={() => {
                    if (cvPdfFile) {
                      const a = document.createElement("a");
                      a.href = cvPdfFile;
                      a.download = "Mark_Khian_Pangilinan_CV.pdf";
                      a.click();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                    cvPdfFile
                      ? "bg-blue-500 text-white hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                      : "cursor-not-allowed bg-foreground/5 dark:bg-white/5 text-muted-foreground"
                  )}
                >
                  <Download className="size-3.5 sm:size-4" />
                  <span className="hidden sm:inline">Download CV</span>
                  <span className="sm:hidden">Download</span>
                </button>
                <div className="mx-1 h-4 w-px bg-foreground/10 dark:bg-white/10" />
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
              {cvFile ? (
                <div className="flex h-full w-full items-center justify-center rounded-lg relative">
                  {cvFile.toLowerCase().endsWith('.pdf') ? (
                    <iframe
                      src={cvFile}
                      className="h-full w-full rounded-lg border-0 bg-white"
                      title="CV PDF Preview"
                    />
                  ) : (
                    <motion.img
                      ref={imgRef}
                      drag={scale > 1}
                      dragConstraints={panBounds}
                      dragElastic={0}
                      dragMomentum={false}
                      animate={{ scale }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      src={cvFile}
                      alt="CV Preview"
                      draggable={false}
                      className={cn(
                        "max-h-full max-w-full rounded-lg object-contain select-none",
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
                        willChange: "transform"
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="flex max-w-sm flex-col items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full border border-border dark:border-white/5 bg-foreground/[0.02] dark:bg-white/[0.02]">
                    <FileText className="size-8 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-foreground">CV coming soon</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      My updated curriculum vitae is currently being prepared and will be available here soon.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
