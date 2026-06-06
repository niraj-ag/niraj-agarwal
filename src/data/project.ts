import type { Project } from "../types";

export const projects: Project[] = [
  {
    title: "FreshEra Studio Website",

    description:
      "A premium digital showcase built to transform a growing creative agency into a scalable, client-facing brand experience.",

    tech: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],

    link: "https://freshera.vercel.app",

    context:
      "As FreshEra expanded across content production, esports, design, and web development, the agency required a unified platform capable of presenting its work and supporting future growth.",

    challenge:
      "Balancing portfolio presentation, storytelling, credibility, and lead generation without relying on conventional agency website patterns.",

    solution:
      "Created a custom-built studio website featuring cinematic presentation, curated client showcases, dynamic case study experiences, integrated project onboarding flows, and conversion-focused user journeys.",

    outcome:
      "Delivered a scalable digital foundation that showcases agency capabilities, streamlines client acquisition, and serves as a central hub for FreshEra's brand and operations."
  },
  {
    title: "Hospitality Website & Booking Funnel",
    description:
      "A conversion-focused hotel website with WhatsApp booking automation and mobile-first user experience.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Vite", "Google Maps"],

    link: "https://ivy-hotel-xi.vercel.app/",

    context:
      "A hotel required a modern website to establish credibility online and reduce friction in guest booking inquiries.",
    challenge:
      "Creating a professional hospitality experience despite limited client assets, while ensuring the primary booking channel remained WhatsApp.",
    solution:
      "Built a responsive booking funnel with branded UI, room showcases, automated WhatsApp inquiry generation, location integration, SEO optimization, and performance-focused image handling.",
    outcome:
      "Successfully launched a production-ready website that modernized the hotel's digital presence and enabled guests to submit structured booking requests directly through WhatsApp.",
  },

];