import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type AboutTrait = {
  icon: LucideIcon;
  text: string;
};

export const aboutContent = {
  label: "About",
  title: "Learning by building, improving by doing",
  intro:
    "I'm a BSIT student specializing in Networking System Technology — focused on turning curiosity into practical skills through projects, practice, and persistence.",
  academic: {
    title: "Academic Background",
    icon: GraduationCap,
    paragraphs: [
      "I'm pursuing a Bachelor of Science in Information Technology with a specialization in Networking System Technology. My interests span networking, system administration, IT support, web development, and database management.",
      "I stay sharp through academic projects, personal builds, and hands-on practice — applying what I learn in class to real problems I can solve on my own.",
    ],
  },
  journey: {
    title: "My Journey",
    icon: Lightbulb,
    paragraphs: [
      "I enjoy working through technical problems and building solutions that actually work. Reliable systems, smoother workflows, and modern tools all keep me motivated to learn more.",
      "I don't have years of industry experience yet — but I bring adaptability, a problem-solving mindset, and the drive to keep improving with every project I take on.",
    ],
  },
  howIWork: {
    title: "How I Work",
    icon: Sparkles,
    traits: [
      { icon: BookOpen, text: "Detail-oriented and organized" },
      { icon: Lightbulb, text: "Strong problem-solving mindset" },
      { icon: Sparkles, text: "Always eager to learn new technologies" },
      {
        icon: Briefcase,
        text: "Clear communicator who enjoys collaborating",
      },
      {
        icon: BookOpen,
        text: "Focused on clean, maintainable, and efficient solutions",
      },
    ] satisfies AboutTrait[],
  },
  careerGoals: {
    title: "Career Goals",
    icon: Briefcase,
    paragraphs: [
      "I'm looking for internship opportunities, entry-level IT roles, networking positions, IT support roles, and web development opportunities where I can grow with a team.",
      "I'm also open to freelance web development projects and technical assistance — anywhere I can contribute while continuing to build my skills professionally.",
    ],
  },
  virtualAssistant: {
    label: "Additional capability",
    title: "Virtual Assistant Support",
    description:
      "Beyond my technical focus, I can also help with organization, research, documentation, communication, scheduling, productivity tools, and administrative support — useful for teams that need reliable remote assistance alongside technical work.",
  },
} as const;
