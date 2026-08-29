"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Hero } from "@/components/sections/hero";
import { QuickContact } from "@/components/sections/quick-contact";

export function HomeHero() {
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  useEffect(() => {
    const handleOpenContact = () => setIsConnectOpen(true);
    window.addEventListener("open-contact", handleOpenContact);
    return () => window.removeEventListener("open-contact", handleOpenContact);
  }, []);

  return (
    <>
      <Hero onConnectClick={() => setIsConnectOpen(true)} />
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
