export const siteConfig = {
  name: "Mark Khian Pangilinan",
  role: "Web Development · Basic Network Troubleshooting",
  tagline: "Learning through development and problem-solving.",
  description:
    "Gaining hands-on experience in web development and basic network troubleshooting, one project at a time.",
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
      title: "Web Development",
      shortDescription:
        "Building modern, secure web systems across the frontend, backend, database, and API layer.",
      items: [
        "System design",
        "Modern frameworks",
        "Node.js & Express",
        "Database integration",
        "API integration",
        "Web security fundamentals",
      ],
    },
    {
      title: "Network Troubleshooting",
      shortDescription:
        "Diagnosing and fixing common connectivity issues, from cabling and Wi-Fi to IP and DNS problems.",
      items: [
        "Connectivity diagnosis (no internet, limited, or intermittent connection)",
        "Wired & wireless troubleshooting",
        "IP configuration issues (DHCP & static IP)",
        "DNS resolution problems",
        "Cable & physical connection checks",
        "Command-line diagnostic tools (ping, ipconfig, tracert, nslookup)",
      ],
    },
  ],
} as const;

export const siteMetadata = {
  title: "Mark Khian Pangilinan | Website Portfolio",
  description: siteConfig.description,
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
