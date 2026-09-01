"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  const isDark = theme === "dark";

  // Hydration safety: before mount, render a placeholder with identical dimensions
  if (!mounted) {
    return (
      <div
        className={cn(
          "fixed top-6 right-6 z-50 flex size-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl",
          "border-border dark:border-white/15 bg-background/90 dark:bg-[#09090B]/90",
          "[@media(pointer:coarse)]:bg-background/95 dark:[@media(pointer:coarse)]:bg-[#09090B]/95 [@media(pointer:coarse)]:backdrop-blur-none"
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "fixed top-6 right-6 z-50 flex size-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl",
        "transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
        "border-border dark:border-white/15 bg-background/90 dark:bg-[#09090B]/90 text-foreground",
        "hover:scale-105 hover:border-foreground/20 dark:hover:border-white/30",
        "[@media(pointer:coarse)]:bg-background/95 dark:[@media(pointer:coarse)]:bg-[#09090B]/95 [@media(pointer:coarse)]:backdrop-blur-none"
      )}
    >
      {isDark ? (
        <Sun className="size-[1.125rem]" aria-hidden="true" />
      ) : (
        <Moon className="size-[1.125rem]" aria-hidden="true" />
      )}
    </button>
  );
}
