export const siteConfig = {
  name: "Mark Khian Pangilinan",
  role: "General VA · Web Development · Tech Support",
  tagline: "Helping businesses work smarter, online and behind the scenes.",
  description:
    "I support businesses with administrative tasks, websites, digital tools, and technical work—so they can focus on running and growing their business.",
  availability:
    "Available for freelance & remote work opportunities",
  links: {
    github: "https://github.com/Mark-Khian",
    email: "markkhian.pangilinan07@gmail.com",
    whatsapp: "https://web.whatsapp.com/send?phone=639386255282&text=Hi%20Mark%20Khian%2C%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20potential%20work%20opportunity.",
    mailto: "https://mail.google.com/mail/?view=cm&fs=1&to=markkhian.pangilinan07@gmail.com&su=Work%20Opportunity%20-%20Portfolio&body=Hi%20Mark%20Khian%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20potential%20work%20opportunity.",
  },
  sections: {
    about: "about",
    skills: "skills",
    services: "services",
    contact: "contact",
  },
  services: [
    {
      title: "General Virtual Assistant",
      shortDescription: "Reliable day-to-day administrative and digital support to help keep tasks, files, communication, and workflows organized.",
      items: [
        "Email management",
        "Data entry",
        "Research",
        "Google Workspace / Microsoft Office",
        "File organization",
        "Scheduling",
        "Basic automation"
      ]
    },
    {
      title: "Full-Stack Development",
      shortDescription: "Building and maintaining responsive web applications across the frontend, backend, and database layer.",
      items: [
        "Frontend development",
        "Responsive website development",
        "Website maintenance and updates",
        "Modern framework-based development",
        "Backend development",
        "Database integration and management",
        "API integration"
      ]
    },
    {
      title: "Technical Support",
      shortDescription: "Practical technical support for software, systems, digital tools, and common day-to-day technology issues.",
      items: [
        "Basic troubleshooting",
        "Software setup and configuration",
        "System and application support",
        "Digital workspace support",
        "Basic networking support"
      ]
    }
  ],
} as const;

export const siteMetadata = {
  title: "Mark Khian Pangilinan — IT Support & Web Developer",
  description: siteConfig.description,
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
