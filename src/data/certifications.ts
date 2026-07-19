export interface Certification {
  id: string;
  title: string;
  organization: string;
  logo: string;
  date: string;
  description: string;
  logoClassName?: string;
}

export const certifications: Certification[] = [
  {
    id: "cka",
    title: "Certified Kubernetes Administrator",
    organization: "The Linux Foundation",
    logo: "/cka.png",
    date: "2024",
    description:
      "Expertise in managing and securing Kubernetes clusters in production environments.",
  },
  {
    id: "aws-saa",
    title: "AWS Certified Solutions Architect Associate",
    organization: "Amazon Web Services",
    logo: "/aws.png",
    date: "2023",
    description:
      "In-depth knowledge of AWS architectural best practices, cloud security, and cost optimization.",
  },
  {
    id: "gitops",
    title: "LFS169: GitOps",
    organization: "The Linux Foundation",
    logo: "https://www.svgrepo.com/show/341998/linux-foundation.svg",
    date: "2024",
    description:
      "Expertise in managing and securing Kubernetes clusters in production environments.",
  },
  {
    id: "terraform-associate",
    title: "Terraform Associate Certification",
    organization: "KodeKloud",
    logo: "/kk.png",
    date: "2022",
    description:
      "Proficiency in Infrastructure as Code using Terraform for cloud automation.",
  },
  {
    id: "GenAI Foundations",
    title: "GenAI Foundations",
    organization: "upGrad",
    logo: "/upgrad.png",
    date: "2025",
    description:
      "Strong foundation in Generative AI concepts, Prompt Engineering, and DevOps practices for building intelligent and automated solutions.",
  },
  {
    id: "ethical-hacking",
    title: "Fundamentals of Ethical Hacking",
    organization: "Offense Hackers Academy",
    logo: "/oa.png",
    date: "2023",
    description:
      "Foundational knowledge of penetration testing, security vulnerabilities, and ethical hacking techniques.",
  },
  {
    id: "oracle-cloud",
    title: "Oracle Cloud Infrastructure Foundations Certified Associate",
    organization: "Oracle",
    logo: "https://www.svgrepo.com/show/354152/oracle.svg",
    date: "2022",
    description:
      "Comprehensive understanding of cloud computing fundamentals, service offerings, and core infrastructure components within Oracle Cloud.",
  },
  {
    id: "wes",
    title: "Verified International Academic Qualifications",
    organization: "World Education Services",
    logo: "/wes.png",
    date: "2022",
    description:
      "Certification and validation of academic credentials from recognized international educational institutions and accreditation bodies.",
  },
  {
    id: "python-hackerrank",
    title: "Basic Python Skills Certification",
    organization: "HackerRank",
    logo: "https://www.svgrepo.com/show/330599/hackerrank.svg",
    date: "2021",
    description:
      "Certification and validation of academic credentials from recognized international educational institutions and accreditation bodies.",
  },
];
