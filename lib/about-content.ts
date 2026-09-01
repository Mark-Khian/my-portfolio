import {
  GraduationCap,
  CheckCircle,
  Route,
  ListChecks,
  FileText,
  RefreshCw,
  BrainCircuit,
  CalendarCheck2,
  Target,
  type LucideIcon,
} from "lucide-react";

export type AboutTrait = {
  icon: LucideIcon;
  text: string;
};

export const aboutContent = {
  label: "About",
  title: "Building digital solutions beyond the interface.",
  intro:
    "I’m a Bachelor of Science in Information Technology student specializing in Networking System Technology, building web systems, digital workflows, and AI-powered automation.",
  academic: {
    title: "Academic Background",
    icon: GraduationCap,
    paragraphs: [
      "Fourth-year Bachelor of Science in Information Technology student specializing in Networking System Technology, with a foundation across networking systems, full-stack development, databases, and digital technologies.",
    ],
  },
  journey: {
    title: "My Journey",
    icon: Route,
    paragraphs: [
      "What started with network configuration and web development has expanded into building digital systems, improving workflows, and developing AI-assisted workflows to simplify repetitive work.",
    ],
  },
  howIWork: {
    title: "How I Work",
    icon: ListChecks,
    traits: [
      { icon: ListChecks, text: "Structured approach to tasks and workflows" },
      { icon: CheckCircle, text: "Organized and detail-oriented" },
      { icon: FileText, text: "Clear task updates and documentation" },
      { icon: RefreshCw, text: "Adaptable to different workflows" },
      { icon: BrainCircuit, text: "Analytical approach to problem-solving" },
      { icon: CalendarCheck2, text: "Consistent with deadlines and deliverables" },
    ] satisfies AboutTrait[],
  },
  careerGoals: {
    title: "What I’m Building Toward",
    icon: Target,
    paragraphs: [
      "Building toward creating organized operations, secure web systems, and smarter automation that improve how work gets done.",
    ],
  },
  virtualAssistant: {
    label: "Additional capability",
    title: "General Virtual Assistant",
    description:
      "Reliable support for daily operations through organization, research, scheduling, documentation, and digital workspace management using modern productivity tools.",
  },
} as const;
