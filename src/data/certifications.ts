export interface Certification {
  id: string;
  title: string;
  short: string;
  organization: string;
  logo: string;
  date: string;
  /** the ones a recruiter filters on */
  core?: boolean;
  /** a degree recognition rather than a certification: shown next to education */
  kind?: "recognition";
}

export const certifications: Certification[] = [
  {
    id: "cka",
    title: "Certified Kubernetes Administrator",
    short: "CKA",
    organization: "The Linux Foundation",
    logo: "/cka.png",
    date: "2024",
    core: true,
  },
  {
    id: "aws-saa",
    title: "AWS Certified Solutions Architect – Associate",
    short: "AWS SAA",
    organization: "Amazon Web Services",
    logo: "/aws.png",
    date: "2023",
    core: true,
  },
  {
    id: "terraform-associate",
    title: "HashiCorp Certified: Terraform Associate",
    short: "Terraform Associate",
    organization: "HashiCorp",
    logo: "/kk.png",
    date: "2022",
    core: true,
  },
  {
    id: "genai",
    title: "Generative AI Foundations (with Microsoft)",
    short: "GenAI Foundations",
    organization: "upGrad",
    logo: "/upgrad.png",
    date: "2025",
    core: true,
  },
  {
    id: "gitops",
    title: "LFS169: Introduction to GitOps",
    short: "GitOps",
    organization: "The Linux Foundation",
    logo: "/logos/linuxfoundation.svg",
    date: "2024",
  },
  {
    id: "ethical-hacking",
    title: "Fundamentals of Ethical Hacking",
    short: "Ethical Hacking",
    organization: "Offense Hackers Academy",
    logo: "/oa.png",
    date: "2023",
  },
  {
    id: "oracle-cloud",
    title: "OCI Foundations Associate",
    short: "OCI Foundations",
    organization: "Oracle",
    logo: "/logos/oracle.svg",
    date: "2022",
  },
  {
    id: "python-hackerrank",
    title: "Python (Basic) Skills Certificate",
    short: "Python (Basic)",
    organization: "HackerRank",
    logo: "/logos/hackerrank.svg",
    date: "2021",
  },
  {
    id: "wes",
    title: "Verified International Academic Qualifications",
    short: "WES verified degrees",
    organization: "World Education Services",
    logo: "/wes.png",
    date: "2022",
    kind: "recognition",
  },
  {
    id: "mohesr",
    title: "Academic Qualification Recognition (UAE)",
    short: "MOHESR recognition",
    organization: "UAE Ministry of Higher Education and Scientific Research",
    logo: "/mohesr.png",
    date: "2026",
    kind: "recognition",
  },
];
