import type { WorkSection } from "../types";

const confidentialNotice = {
  confidentialTitle: "Internal Enterprise Product",
  confidentialNote: "Built for Capgemini Design Practice. Live demo unavailable.",
};

export const workSections: WorkSection[] = [
  {
    id: "enterprise-ai",
    label: "Enterprise AI",
    count: 2,
    tagline:
      "Confidential internal software engineered within Capgemini's design practice. Full engineering case studies — no demos, no source, no screenshots.",
    items: [
      {
        kind: "enterprise",
        name: "RDV AI",
        badge: "Enterprise AI",
        status: "internal",
        confidential: true,
        ...confidentialNotice,
        overview:
          "An AI-powered UX workflow accelerator that transforms client requirements into complete design deliverables.",
        problem:
          "UX designers spend significant time manually performing research, persona creation, journey mapping, wireframing and prototyping.",
        challenge:
          "Reduce repetitive design work while maintaining consistency throughout the UX lifecycle.",
        architecture: [
          "Prompt",
          "LLM Pipeline",
          "Research",
          "Personas",
          "User Journeys",
          "Wireframes",
          "Prototype",
          "HTML Export",
          "Figma JSON",
        ],
        engineeringDecisions: [
          "Split LLM responsibilities — Claude drives multi-step content reasoning and pipeline planning, while OpenAI produces bounded structured output for export reliability.",
          "Modeled every stage as a typed JSON artifact shared between Node and React, keeping prototype rendering, HTML export and Figma export in sync from one source of truth.",
          "Designed the workflow as restartable pipeline stages so a revised prompt re-runs a single phase without regenerating the entire deliverable suite.",
          "Exposed every capability through a REST API; the React client treats generation as an async state machine rather than imperative control flow.",
        ],
        solution:
          "Built an end-to-end prompt-driven AI pipeline capable of automatically generating the complete UX workflow from a single prompt:",
        solutionPoints: [
          "Research",
          "Personas",
          "User Journeys",
          "Wireframes",
          "Interactive Prototype",
          "HTML Export",
          "Figma JSON Export",
        ],
        outcome:
          "Allows designers to generate complete UX workflows from a single prompt — dramatically reducing manual effort.",
        metrics: [
          { value: "1", label: "Prompt → full workflow" },
          { value: "7", label: "Deliverable types" },
        ],
        tech: ["React", "TypeScript", "Node.js", "Express", "Claude API", "OpenAI API"],
        highlights: [
          "LLM Orchestration",
          "Prompt Engineering",
          "Interactive Prototype Rendering",
          "Workflow Pipelines",
          "REST APIs",
          "TypeScript",
        ],
        role: "Team of 3",
        date: "2025",
      },
      {
        kind: "enterprise",
        name: "Xsight",
        badge: "Enterprise AI",
        status: "internal",
        confidential: true,
        ...confidentialNotice,
        overview:
          "AI-powered accessibility and usability auditing platform for websites and Figma designs.",
        problem:
          "Accessibility and heuristic evaluations are often repetitive and time-consuming.",
        challenge:
          "Deliver AI-assisted reviews within seconds.",
        architecture: ["Website", "Playwright", "Claude", "WCAG", "Nielsen", "Recommendations"],
        engineeringDecisions: [
          "Captured a normalized DOM snapshot (tree, viewport and computed styles) once with Playwright — the single evaluation input for every audit.",
          "Pre-contracted WCAG and Nielsen heuristics into Claude's structured JSON schema, making findings deterministic, versioned and machine-readable.",
          "Routed website and Figma inputs through one evaluation engine (normalizer → LLM → findings) instead of separate ad-hoc analysis paths.",
          "Runs independent page captures in parallel and aggregates results, sustaining approximately 20-second wall-clock audits.",
        ],
        solution:
          "An automated analysis engine integrating Playwright browser automation with Claude AI. Supports:",
        solutionPoints: [
          "Website Analysis",
          "Figma Analysis",
          "WCAG",
          "Nielsen Heuristics",
        ],
        outcome:
          "Generates structured accessibility recommendations in approximately 20 seconds.",
        metrics: [{ value: "~20s", label: "Time to audit" }],
        tech: ["React", "Node", "Express", "Playwright", "Claude"],
        highlights: [
          "Playwright",
          "Browser Automation",
          "Claude",
          "Accessibility",
          "AI Analysis",
          "REST APIs",
        ],
        role: "Individual Contributor",
        date: "2025",
      },
    ],
  },
  {
    id: "commercial-products",
    label: "Commercial Products",
    count: 2,
    tagline:
      "Production software delivered end-to-end for real businesses — each engagement built around a business problem, not a design brief.",
    items: [
      {
        kind: "commercial",
        name: "FreshEra",
        badge: "Commercial Product",
        status: "live",
        headline: "A growing creative agency needed to modernize client acquisition and centralize internal operations.",
        overview:
          "FreshEra was scaling across content production, esports and design work but ran the business on disconnected tools. The engagement spanned two connected products: a public-facing digital presence to win clients, and an internal operating platform to run them.",
        role: "Lead Engineer",
        date: "2024–2026",
        highlights: [
          "Full-stack Product Engineering",
          "Marketing & Operations Platform Pairing",
          "Lead-to-Client Lifecycle",
          "Automation-first Workflows",
          "Role Based Access",
          "PostgreSQL / Supabase",
        ],
        deliverables: [
          {
            id: "marketing-site",
            name: "Marketing Website",
            description:
              "Premium marketing website and digital brand platform.",
            purpose: ["Showcase services", "Portfolio", "Client work", "Lead generation", "Credibility"],
            overview: "A modern, cinematic website designed to present the studio's body of work and convert visitors into qualified client inquiries.",
            problem: "The public site carried the weight of first impressions, but dated presentation was failing to attract and convert prospects.",
            solution: "Built a responsive marketing site with curated portfolios, conversion-focused service pages, a streamlined client onboarding flow and performance-first rendering.",
            outcome:
              "Delivered a high-performance responsive website supporting brand growth and client acquisition.",
            tech: ["React", "TypeScript", "Tailwind", "Framer Motion", "Vite", "Vercel"],
            highlights: ["Cinematic Presentation", "Conversion Journeys", "Performance", "SEO"],
            abstract: { tag: "PUBLIC SITE", title: "FreshEra Studio" },
            linkLabel: "Visit Website",
            linkHref: "https://freshera.vercel.app",
          },
          {
            id: "ops-platform",
            name: "Agency Operations Platform",
            description:
              "A modular internal operating system built to centralize agency operations.",
            purpose: [
              "CRM",
              "Client Portal",
              "Project Management",
              "Document Generation",
              "Invoices",
              "Scheduling",
              "Analytics",
              "Communication",
              "Asset Management",
            ],
            overview: "An internal platform that replaces the agency's scattered tools with one operating system spanning the full client lifecycle.",
            problem: "The agency operated across WhatsApp, forms, spreadsheets, drives and email — creating fragmented, manual work and room for error.",
            solution: "Architected a modular full-stack platform with Supabase row-level security, role-aware access, invoicing and document engines, scheduling, analytics and a client collaboration portal.",
            outcome:
              "Unified operational workflows into a scalable internal software platform while creating a foundation for future AI-powered automation.",
            tech: ["React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind", "Cal.com", "Zapier"],
            highlights: ["Modular Architecture", "Supabase RLS", "Doc & Invoice Engines", "Client Portal"],
            abstract: { tag: "INTERNAL PLATFORM", title: "Agency OS" },
            authorizedNote: "Internal Operational Platform",
            authorizedHref: "https://freshera-console-five.vercel.app/#/login",
          },
        ],
      },
      {
        kind: "commercial",
        name: "Ivy Hotel",
        badge: "Commercial Product",
        status: "live",
        headline: "A boutique hotel needed modern credibility without abandoning its booking channel.",
        overview:
          "The hotel lacked a modern online presence and routed guest inquiries through WhatsApp. The engagement was to give it credibility online while preserving — and automating — its existing booking channel.",
        role: "Individual",
        date: "2024",
        highlights: [
          "Booking Workflow Automation",
          "Structured Leads",
          "Location Integration",
          "Mobile First",
          "Performance Optimization",
        ],
        deliverables: [
          {
            id: "booking-experience",
            name: "Booking Experience",
            description:
              "Production hospitality website with an integrated WhatsApp booking workflow.",
            purpose: ["Room showcases", "Trust & credibility", "Booking inquiries", "WhatsApp handoff"],
            overview: "A production website acting as the hotel's digital front door, engineered so every inquiry is structured and actionable.",
            problem: "Manual guest inquiries on WhatsApp made requests chaotic, disconnected and hard to convert.",
            solution: "Built a responsive site with room showcases, optimized imagery and map integration. Booking steps generate structured WhatsApp inquiries so each request arrives pre-organized.",
            outcome: "Improved online credibility and streamlined guest inquiries into structured, bankable bookings.",
            tech: ["React", "TypeScript", "Tailwind", "Vite", "Google Maps"],
            abstract: { tag: "LIVE PRODUCT", title: "Ivy Hotel" },
            linkLabel: "Visit Website",
            linkHref: "https://ivy-hotel-xi.vercel.app/",
          },
        ],
      },
    ],
  },
];