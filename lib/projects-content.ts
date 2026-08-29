export type ProjectCategory =
  | "Web Development"
  | "Networking"
  | "Server & Systems"
  | "Database"
  | "Graphic Design"
  | "Workspace / VA";

export interface ProjectMedia {
  url: string;
  type: "image";
  alt: string;
  caption?: string;
  displayOrder: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  
  // Case Study fields (optional)
  overview?: string;
  problem?: string;
  goal?: string;
  solution?: string;
  myRole?: string;
  keyFeatures?: string[];
  result?: string;
  lessonsLearned?: string;

  // Technical Information (optional)
  techStack?: string[];
  architecture?: string;

  // Media Support (optional)
  thumbnailUrl?: string;
  thumbnailAltText?: string;
  gallery?: ProjectMedia[];

  // External Links (optional)
  liveUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;

  tags: string[];
  accentColor: string;
  featured?: boolean;
  status: "live" | "in-progress" | "completed";
}

export const projects: Project[] = [
  {
    id: "portfolio",
    slug: "ai-powered-portfolio",
    title: "AI-Powered Portfolio",
    category: "Web Development",
    description:
      "This portfolio — built with Next.js, Tailwind CSS, Framer Motion, and an integrated AI assistant powered by OpenAI. Features a particle network background, glassmorphism UI, and smooth scroll.",
    overview:
      "A premium portfolio site showcasing frontend craftsmanship and AI integration. Built with Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion for animations, Lenis for smooth scroll, and a canvas-based interactive particle background. The AI assistant uses a Vercel serverless function to keep the API key server-side.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "OpenAI"],
    accentColor: "#3B82F6",
    status: "live",
    featured: true,
    liveUrl: "https://github.com/Mark-Khian",
    repositoryUrl: "https://github.com/Mark-Khian",
  },
  {
    id: "network-topology",
    slug: "network-topology-design",
    title: "Network Topology Design",
    category: "Networking",
    description:
      "Designed and simulated a multi-floor enterprise network topology using Cisco Packet Tracer — covering VLANs, subnetting, inter-VLAN routing, and DHCP configuration.",
    overview:
      "An academic networking project demonstrating practical knowledge of enterprise network design. Configured routers, switches, and end devices across multiple VLANs with proper subnetting. Implemented inter-VLAN routing via a Layer 3 switch and centralized DHCP. Documented the full topology with IP addressing tables.",
    tags: ["Cisco Packet Tracer", "VLANs", "Subnetting", "DHCP", "Networking"],
    accentColor: "#06B6D4",
    status: "completed",
    featured: true,
    repositoryUrl: "https://github.com/Mark-Khian",
  },
  {
    id: "it-support-toolkit",
    slug: "it-support-automation-scripts",
    title: "IT Support Automation Scripts",
    category: "Server & Systems",
    description:
      "A collection of PowerShell and Bash scripts for common IT support tasks — system diagnostics, user account management, log parsing, and automated reporting.",
    overview:
      "Practical scripts built to streamline repetitive IT support workflows. Includes a system health check script, Active Directory user provisioning automation, log file parser for identifying common errors, and a scheduled report generator. Designed for use in Windows Server and Linux environments.",
    tags: ["PowerShell", "Bash", "Active Directory", "Windows Server", "Linux"],
    accentColor: "#8B5CF6",
    status: "completed",
    repositoryUrl: "https://github.com/Mark-Khian",
  },
  {
    id: "capstone",
    slug: "rice-crop-record-management-system",
    title: "Rice Crop Record Management System",
    category: "Networking",
    description:
      "Final-year project integrating networking and web technologies — details to be announced as development progresses.",
    overview:
      "My final-year capstone project for the Bachelor of Science in Information Technology Networking System Technology program. The project will integrate core networking concepts with modern web development, demonstrating the full breadth of skills developed throughout the program. More details will be shared as the project progresses.",
    tags: ["Information Technology", "Networking", "Web Development", "Capstone"],
    accentColor: "#F97316",
    status: "in-progress",
    featured: true,
    repositoryUrl: "https://github.com/Mark-Khian",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export async function getPublishedProjects(): Promise<Project[]> {
  return projects;
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  return projects.find((p) => p.slug === slug) || null;
}
