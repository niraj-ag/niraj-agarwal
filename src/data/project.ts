import type { Project } from "../types";

export const projects: Project[] = [
  {
    title: "Enterprise Inventory Orchestration",
    description:
      "A distributed inventory platform that improved fulfillment accuracy across 50+ warehouses.",
    tech: ["React", "Node.js", "PostgreSQL", "Redis"],
    context:
      "A logistics company managing 50+ regional warehouses struggled with real-time inventory visibility. Fulfillment teams were making decisions on stale data, leading to over-allocation and stockouts.",
    challenge:
      "Synchronizing inventory state across distributed locations with sub-second consistency while handling thousands of concurrent transactions without race conditions.",
    solution:
      "Designed an event-driven distribution layer with optimistic locking and isolated PostgreSQL transaction states. Built a React dashboard with real-time WebSocket feeds for operations teams.",
    outcome:
      "Achieved 99.98% inventory tracking consistency with sub-second cross-warehouse reconciliation. Reduced fulfillment errors by 40% in the first quarter.",
  },
  {
    title: "Performance Analytics Dashboard",
    description:
      "A lightweight dashboard for tracking operational KPIs, reducing report load time by over 70%.",
    tech: ["TypeScript", "GraphQL", "React", "Tailwind CSS"],
    context:
      "Operations teams relied on legacy reporting tools that took 15+ seconds to render dashboards. Decision-making was delayed, and teams defaulted to spreadsheets.",
    challenge:
      "Reducing data payload sizes and render times without losing analytical depth or requiring infrastructure changes.",
    solution:
      "Engineered a normalized schema cache with batched GraphQL queries and lightweight, dynamic UI updates. Implemented virtual scrolling and progressive data loading for large datasets.",
    outcome:
      "Slashed dashboard load times by 70%+, reducing client memory footprint to under 15MB. Teams stopped using spreadsheet workarounds within two weeks of launch.",
  },
  {
    title: "Real-Time Collaboration Service",
    description:
      "A resilient service for multi-user synchronization with event-driven updates.",
    tech: ["Node.js", "Redis", "Docker", "WebSockets"],
    context:
      "A product team needed real-time collaboration features for their planning tool, but their existing polling architecture couldn't scale beyond a few hundred concurrent users.",
    challenge:
      "Maintaining consistent state across 10,000+ concurrent connections with minimal latency while handling network interruptions gracefully.",
    solution:
      "Built a synchronization service using Redis Pub/Sub channels and WebSockets with automatic exponential backoff reconnection. Containerized with Docker for horizontal scaling.",
    outcome:
      "Maintained consistent state under 10k+ concurrent connections with latency capped under 50ms. Zero data loss during connection interruptions.",
  },
];