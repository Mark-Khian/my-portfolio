"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { QuickContact } from "@/components/sections/quick-contact";
import { siteConfig } from "@/lib/site-config";

export default function Home() {
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  return (
    <>
      <main>
        <Hero onConnectClick={() => setIsConnectOpen(true)} />
        <About />
        <Skills />
        {/* Placeholder anchors for Hero CTAs — replaced as sections are built */}
        <div
          id={siteConfig.sections.projects}
          className="sr-only"
          aria-hidden="true"
        />
        <div
          id={siteConfig.sections.contact}
          className="sr-only"
          aria-hidden="true"
        />
      </main>

      <AnimatePresence>
        {isConnectOpen && (
          <QuickContact
            isOpen={isConnectOpen}
            onClose={() => setIsConnectOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
