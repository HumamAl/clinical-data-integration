import type { Profile, PortfolioProject } from "@/lib/types";

export const profile: Profile = {
  name: "Humam",
  tagline:
    "Full-stack developer with healthcare SaaS experience — patient management, scheduling, and clinical workflows.",
  bio: "I build MVPs and production apps that solve real operational problems. This demo was built specifically to show what an EMR integration MVP could look like — real HL7 message flows, HIPAA-aware data handling, and a clinical team interface that doesn't require a training manual.",
  approach: [
    {
      title: "Map the Integration Landscape",
      description:
        "Audit existing EMR systems, identify HL7 message types in play, and map the data flow before writing code. The one question that clarifies everything else is usually: what breaks when messages fail?",
    },
    {
      title: "Build the Data Pipeline First",
      description:
        "Get real clinical data flowing through Mirth Connect channels before touching the UI — the foundation determines everything. No dark periods: progress is visible from day one.",
    },
    {
      title: "Ship a HIPAA-Ready MVP",
      description:
        "Production-grade compliance from day one — encryption, audit logging, and access controls baked in, not bolted on after the fact. Clean TypeScript, documented structure.",
    },
    {
      title: "Iterate with Your Clinical Team",
      description:
        "Short feedback cycles with your healthcare team — they know the workflows, I translate that into working software. No 2-week waits for a small change.",
    },
  ],
  skillCategories: [
    {
      name: "Frontend",
      skills: [
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
        "shadcn/ui",
        "Recharts",
      ],
    },
    {
      name: "Backend & Integration",
      skills: [
        "Node.js",
        "REST APIs",
        "HL7/FHIR",
        "API Integration",
        "Python",
      ],
    },
    {
      name: "Healthcare & Compliance",
      skills: [
        "HIPAA",
        "Clinical Workflows",
        "EMR Systems",
        "Data Mapping",
      ],
    },
    {
      name: "DevOps",
      skills: ["Vercel", "GitHub Actions", "CI/CD"],
    },
  ],
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "southfield-healthcare",
    title: "Southfield Healthcare",
    description:
      "Healthcare operations platform with patient management, appointment scheduling, provider dashboards, and clinical analytics.",
    outcome:
      "Consolidated patient scheduling and management into a single interface, replacing disconnected spreadsheet workflows.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts"],
    liveUrl: "https://southfield-healthcare.vercel.app",
    relevance:
      "Direct domain match — built the same type of clinical operations interface your team needs.",
  },
  {
    id: "tinnitus-therapy",
    title: "Tinnitus Therapy SaaS",
    description:
      "Multi-clinic tinnitus therapy management platform with patient intake, treatment protocols, progress tracking, and clinic analytics.",
    outcome:
      "Multi-clinic SaaS covering the full patient journey — intake, protocol assignment, session tracking, and outcome dashboards.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts"],
    liveUrl: "https://tinnitus-therapy.vercel.app",
    relevance:
      "Multi-location clinical SaaS — same architecture pattern your EMR integration will need.",
  },
  {
    id: "medrecord-ai",
    title: "MedRecord AI",
    description:
      "AI-powered medical record summarization tool that extracts key clinical data, diagnoses, medications, and treatment timelines from patient records.",
    outcome:
      "Document processing pipeline that extracts structured clinical data and generates a readable timeline summary.",
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "AI extraction pipeline",
    ],
    liveUrl: "https://medrecord-ai-delta.vercel.app",
    relevance:
      "Clinical data extraction and structuring — closely aligned with the HL7 parsing work your integration requires.",
  },
  {
    id: "data-intelligence-platform",
    title: "Data Intelligence Platform",
    description:
      "Data analytics and intelligence dashboard with multi-source data aggregation, visualization, and insight generation.",
    outcome:
      "Unified analytics dashboard pulling data from multiple sources with interactive charts and filterable insights.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts"],
    liveUrl: "https://data-intelligence-platform-sandy.vercel.app",
    relevance:
      "Multi-source data aggregation pattern — same challenge as pulling from multiple EMR feeds into one dashboard.",
  },
];
