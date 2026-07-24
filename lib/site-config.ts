export const siteConfig = {
  name: "Mark Khian Pangilinan",
  role: "Networking System Technology Student",
  tagline: "Aspiring IT Support & Web Developer",
  description:
    "I build reliable web applications and networking solutions while continuously improving my skills in IT support, system administration, and modern web technologies.",
  availability:
    "Open to internships, entry-level IT opportunities, and freelance web development projects.",
  links: {
    github: "https://github.com/Mark-Khian",
    email: "markkhianlucaspangilinan@gmail.com",
  },
  sections: {
    about: "about",
    skills: "skills",
    projects: "projects",
    contact: "contact",
  },
} as const;

export const siteMetadata = {
  title: "Mark Khian Pangilinan — IT Support & Web Developer",
  description: siteConfig.description,
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
