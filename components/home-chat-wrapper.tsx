"use client";

import dynamic from "next/dynamic";

const ChatAssistant = dynamic(
  () =>
    import("@/components/ai/chat-assistant").then((mod) => ({
      default: mod.ChatAssistant,
    })),
  { ssr: false },
);

export function HomeChatWrapper() {
  return <ChatAssistant />;
}
