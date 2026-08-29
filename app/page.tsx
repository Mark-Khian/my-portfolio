
import { HomeHero } from "@/components/home-hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Services } from "@/components/sections/services";
import { Contact } from "@/components/sections/contact";

import { HomeChatWrapper } from "@/components/home-chat-wrapper";

export default async function Home() {
  return (
    <>
      <main>
        <HomeHero />
        <Services />
        <About />
        <Skills />
        <Contact />
      </main>

      <HomeChatWrapper />
    </>
  );
}
