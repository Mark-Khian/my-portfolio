export interface Certification {
  id: string;
  title: string;
  issuer: string;
  description: string;
  logo: string;
  logoSize: number;
  verifyUrl: string;
  image: string;
  pdf: string;
  accentColor: string;
}

export const certifications: Certification[] = [
  {
    id: "it-specialist-networking",
    title: "IT Specialist – Networking",
    issuer: "Certiport, a Pearson VUE business",
    description:
      "Foundational networking knowledge and skills, including TCP/IP, networking services, network topologies, and troubleshooting in wired and wireless environments.",
    logo: "/certificates/it-specialist-networking.webp",
    logoSize: 78,
    verifyUrl:
      "https://www.credly.com/badges/26f975f7-ddce-451a-b92c-e5a0dbd264be",
    image: "/certificates/certiport-networking-certificate.webp",
    pdf: "/certificates/certiport-networking-certificate.pdf",
    accentColor: "#22A6C7",
  },
  {
    id: "wadhwani-jobready-ai",
    title: "Employability Skills: JobReady (With AI)",
    issuer: "Wadhwani Foundation",
    description:
      "Employer-valued soft skills, workplace knowledge, and professional attitudes, plus foundational AI skills for today's workplace.",
    logo: "/certificates/wadhwani-logo.webp",
    logoSize: 72,
    verifyUrl:
      "https://web.certificate.wfglobal.org/en/certificate?certificateId=6ae8c6a4f631fff89c7124ae",
    image: "/certificates/wadhwani-jobready-certificate.webp",
    pdf: "/certificates/wadhwani-jobready-certificate.pdf",
    accentColor: "#F26B2A",
  },
];

