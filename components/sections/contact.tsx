"use client";

import { ArrowUp } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

export function Contact() {
  const handleGetInTouch = () => {
    // Scroll to the hero section
    const hero = document.getElementById("hero");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth" });

      // Dispatch an event to highlight the Contact Me button in the hero
      // Slight delay so the user sees it highlight when they arrive
      setTimeout(() => {
        window.dispatchEvent(new Event("highlight-contact"));
      }, 600);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border/60 px-6 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <FadeIn>
          <h2
            id="contact-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Ready to work together?
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Have a project, workflow, or task in mind? Let’s talk about how it can be organized, built, or improved.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleGetInTouch}
              className="group flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-8 text-sm font-medium text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_8px_24px_rgba(0,0,0,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            >
              Get in Touch
              <ArrowUp className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-foreground" />
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
