import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Layers,
  CheckCircle,
  MessageSquare,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type AboutTrait = {
  icon: LucideIcon;
  text: string;
};

export const aboutContent = {
  label: "About",
  title: "Turning technical skills into practical solutions.",
  intro:
    "I'm a Bachelor of Science in Information Technology student specializing in Networking System Technology — focused on turning curiosity into practical skills through projects, practice, and persistence.",
  academic: {
    title: "Academic Background",
    icon: GraduationCap,
    paragraphs: [
      "Fourth-year Bachelor of Science in Information Technology student specializing in Networking System Technology, with hands-on experience in networking, systems, web development, and technical projects.",
    ],
  },
  journey: {
    title: "My Journey",
    icon: Lightbulb,
    paragraphs: [
      "Adaptable across different workflows and technology tools, with a practical approach to understanding systems, solving problems, and getting work done efficiently.",
    ],
  },
  howIWork: {
    title: "How I Work",
    icon: Sparkles,
    traits: [
      { icon: BookOpen, text: "Quick to understand new tools and systems" },
      { icon: Layers, text: "Adaptable to different workflows" },
      { icon: CheckCircle, text: "Organized and detail-oriented" },
      {
        icon: Lightbulb,
        text: "Practical approach to problem-solving",
      },
      {
        icon: MessageSquare,
        text: "Clear and straightforward communication",
      },
      {
        icon: ShieldCheck,
        text: "Reliable and consistent with assigned tasks",
      },
    ] satisfies AboutTrait[],
  },
  careerGoals: {
    title: "Career Goals",
    icon: Briefcase,
    paragraphs: [
      "I aim to contribute reliable, practical work that improves workflows and makes day-to-day operations easier, while continuously strengthening my professional and technical experience.",
    ],
  },
  virtualAssistant: {
    label: "Additional capability",
    title: "General Virtual Assistant",
    description:
      "I provide reliable remote support for organization, research, documentation, scheduling, communication, and day-to-day administrative tasks using modern productivity tools.",
  },
} as const;
