import type { WorkSection } from "../types";

// Optimized media in /public: WebM (VP9) recordings + WebP screenshots.
// Rough total payload ~9 MB vs ~204 MB of originals.

export const workSections: WorkSection[] = [
  {
    id: "enterprise-ai",
    label: "Enterprise AI",
    count: 2,
    tagline:
      "Enterprise internal products engineered inside Capgemini's design practice â€” showcased with concept visuals, architecture and features.",
    items: [
      {
        id: "rdv-ai",
        name: "RDV AI",
        client: "Capgemini Design Practice",
        category: "enterprise-ai",
        badge: "Enterprise AI",
        statusLabel: "Internal Product",
        description:
          "An AI copilot that turns client requirements into research, personas, journeys, wireframes and interactive prototypes.",
        overview:
          "Prompt-driven AI pipeline that transforms a single requirement statement into a complete UX deliverable suite â€” research, personas, journeys, wireframes and interactive prototype.",
        note: "Built for Capgemini Design Practice. Internal product showcase.",
        role: "Team of 3",
        date: "2025",
        tech: ["React", "TypeScript", "Node.js", "Express", "Claude API", "OpenAI API"],
        features: [
          { title: "Research & Personas", text: "Automated user research and persona generation from a single prompt." },
          { title: "Journey Mapping", text: "Structured user journeys generated consistently across projects." },
          { title: "Wireframes", text: "Schematic wireframes produced by the LLM pipeline." },
          { title: "Interactive Prototype", text: "Clickable prototype rendered directly from pipeline output." },
          { title: "HTML Export", text: "Production-ready HTML export of the prototype." },
          { title: "Figma JSON", text: "Structured output importable into Figma workflows." },
        ],
        stats: [
          { value: "1", label: "Prompt â†’ full workflow" },
          { value: "7", label: "Deliverable types" },
          { value: "2", label: "LLM providers" },
        ],
        architecture: [
          "Prompt",
          "LLM Pipeline",
          "Research",
          "Personas",
          "Journey Maps",
          "Wireframes",
          "Prototype",
        ],
        preview: { type: "video", src: "/RDV.webm" },
        gallery: [{ type: "video", src: "/RDV.webm" }],
        actionPrimary: { label: "View Showcase", type: "modal" },
      },
      {
        id: "xsight",
        name: "Xsight",
        client: "Capgemini Design Practice",
        category: "enterprise-ai",
        badge: "Enterprise AI",
        statusLabel: "Internal Product",
        description:
          "AI accessibility & usability auditing for websites and Figma designs â€” WCAG and Nielsen in ~20 seconds.",
        overview:
          "Automated evaluation engine that audits sites and Figma files against WCAG and Nielsen heuristics, returning structured recommendations in seconds.",
        note: "Built for Capgemini Design Practice. Internal product showcase.",
        role: "Individual Contributor",
        date: "2025",
        tech: ["React", "Node", "Express", "Playwright", "Claude"],
        features: [
          { title: "Website Analysis", text: "Live page capture and evaluation via Playwright." },
          { title: "Figma Analysis", text: "Design files audited against the same engine." },
          { title: "WCAG Coverage", text: "Accessibility checks aligned to WCAG guidance." },
          { title: "Nielsen Heuristics", text: "Usability review against Nielsen's ten heuristics." },
          { title: "Structured Report", text: "Deterministic, actionable recommendation output." },
        ],
        stats: [
          { value: "~20s", label: "Audit time" },
          { value: "2", label: "Audit frameworks" },
          { value: "2", label: "Input surfaces" },
        ],
        architecture: ["Website", "Playwright", "Claude", "WCAG", "Nielsen", "Report"],
        preview: { type: "branded" },
        gallery: [{ type: "branded" }],
        actionPrimary: { label: "View Showcase", type: "modal" },
      },
    ],
  },
  {
    id: "commercial-products",
    label: "Commercial Products",
    count: 3,
    tagline:
      "Production software shipped for real businesses â€” each deliverable engineered to solve a distinct problem.",
    items: [
      {
        id: "freshera-studio",
        name: "FreshEra Studio Website",
        client: "FreshEra",
        category: "commercial-products",
        badge: "Web Product",
        statusLabel: "Live",
        description:
          "Marketing site and lead engine for a creative technology studio.",
        overview:
          "Premium responsive website built to showcase the studio's work, services and process while converting visitors into clients.",
        role: "Lead Engineer",
        date: "2025",
        tech: ["React", "TypeScript", "Tailwind", "Framer Motion", "Vite", "Vercel"],
        features: [
          { title: "Work Showcase", text: "Curated portfolio and case study experience." },
          { title: "Service Pages", text: "Audience-mapped service landing pages." },
          { title: "Lead Onboarding", text: "Streamlined path from visitor to client inquiry." },
          { title: "Cinematic Motion", text: "Subtle, intent-driven motion throughout." },
        ],
        stats: [
          { value: "1", label: "Unified brand identity" },
          { value: "Live", label: "In production" },
        ],
        architecture: ["Visitor", "Showcase", "Services", "Onboarding", "Lead"],
        preview: { type: "video", src: "/freshera.webm", poster: "/freshera1.webp" },
        gallery: [
          { type: "media", src: "/freshera1.webp" },
          { type: "media", src: "/freshera2.webp" },
          { type: "media", src: "/freshera3.webp" },
          { type: "video", src: "/freshera.webm", poster: "/freshera1.webp" },
        ],
        actionPrimary: { label: "Visit Website", type: "link", href: "https://freshera.vercel.app" },
        actionSecondary: { label: "Learn more", type: "modal" },
      },
      {
        id: "freshera-console",
        name: "FreshEra Console",
        client: "FreshEra",
        category: "commercial-products",
        badge: "SaaS Platform",
        statusLabel: "Live Product",
        description:
          "The operating system running the studio â€” CRM, projects, invoices, analytics and client portal in one workspace.",
        overview:
          "Modular agency operating system that unifies CRM, project management, documents, invoices, scheduling and analytics for the full client lifecycle.",
        role: "Lead Engineer",
        date: "2026",
        tech: ["React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind", "Cal.com", "Zapier", "Vercel"],
        features: [
          { title: "Dashboard", text: "Operational overview of the full agency in one place." },
          { title: "CRM", text: "Contacts, pipelines and deal-stage visibility." },
          { title: "Project Management", text: "Tasks, milestones and delivery tracking." },
          { title: "Invoice Engine", text: "Generate, send and track invoices." },
          { title: "Analytics", text: "Performance metrics across the business." },
          { title: "Client Portal", text: "A self-service window for every client." },
          { title: "Document Engine", text: "Template-driven document generation." },
        ],
        stats: [
          { value: "12+", label: "Modules" },
          { value: "1", label: "Workspace" },
          { value: "Full", label: "Client lifecycle" },
        ],
        architecture: ["CRM", "Projects", "Invoices", "Client Portal", "Analytics"],
        preview: { type: "video", src: "/Console.webm", poster: "/console1.webp" },
        gallery: [
          { type: "media", src: "/console1.webp" },
          { type: "media", src: "/console2.webp" },
          { type: "video", src: "/Console.webm", poster: "/console1.webp" },
        ],
        actionPrimary: { label: "Preview Product", type: "modal" },
        actionSecondary: {
          label: "Open Console",
          type: "link",
          href: "https://freshera-console-five.vercel.app/#/login",
        },
      },
      {
        id: "ivy-hotel",
        name: "Ivy Hotel Website",
        client: "Ivy Hotels",
        category: "commercial-products",
        badge: "Web Product",
        statusLabel: "Live",
        description:
          "Production hospitality website with a structured WhatsApp booking workflow.",
        overview:
          "Responsive hospitality site that elevates the hotel's presence and turns guest inquiries into structured WhatsApp bookings.",
        role: "Lead Engineer",
        date: "2024",
        tech: ["React", "TypeScript", "Tailwind", "Vite", "Google Maps"],
        features: [
          { title: "Room Showcases", text: "Optimized imagery and room presentation." },
          { title: "Booking Flow", text: "Guided path from browse to inquiry." },
          { title: "WhatsApp Automation", text: "Structured, pre-organized booking requests." },
          { title: "Location Integration", text: "Maps and surroundings rendered for guests." },
        ],
        stats: [
          { value: "Structured", label: "Booking requests" },
          { value: "Live", label: "In production" },
        ],
        architecture: ["Visitor", "Rooms", "Booking", "WhatsApp", "Lead"],
        preview: { type: "video", src: "/Ivy.webm", poster: "/ivy1.webp" },
        gallery: [
          { type: "media", src: "/ivy1.webp" },
          { type: "media", src: "/ivy2.webp" },
          { type: "video", src: "/Ivy.webm", poster: "/ivy1.webp" },
        ],
        actionPrimary: { label: "Visit Website", type: "link", href: "https://ivy-hotel-xi.vercel.app/" },
        actionSecondary: { label: "Learn more", type: "modal" },
      },
    ],
  },
];