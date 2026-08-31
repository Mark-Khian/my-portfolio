export const siteConfig = {
  name: "Mark Khian Pangilinan",
  role: "General VA · Web Development · AI Automation",
  tagline: "From routine tasks to better workflows.",
  description:
    "Organized tasks, modern websites, and smarter workflows—all built to make your day easier.",
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
      shortDescription: "Reliable support for daily tasks, communication, schedules, files, and other administrative work that keeps things organized.",
      items: [
        "Email & inbox organization",
        "Calendar & schedule management",
        "Data entry & record keeping",
        "Online research",
        "File & document management",
        "Google Workspace & Microsoft 365"
      ]
    },
    {
      title: "Full-Stack Development",
      shortDescription: "Building modern, secure web systems across the frontend, backend, database, and API layer.",
      items: [
        "System architecture",
        "Modern frameworks",
        "Node.js & Express",
        "Database integration",
        "API integration",
        "Security implementation"
      ]
    },
    {
      title: "AI Automation",
      shortDescription: "Creating smarter workflows that reduce repetitive work, connect digital processes, and make everyday tasks more efficient.",
      items: [
        "Workflow Analysis & Process Mapping",
        "Trigger, Action & Conditional Logic",
        "Data Mapping & Transformation",
        "API & System Integration",
        "AI-Assisted Decision Steps",
        "Error Handling & Workflow Optimization"
      ]
    }
  ],
} as const;

export const siteMetadata = {
  title: "Mark Khian Pangilinan | Website Portfolio",
  description: siteConfig.description,
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
