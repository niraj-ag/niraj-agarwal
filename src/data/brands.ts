// Open-source brand icons served from the Simple Icons CDN (CC0).
// Slugs map to https://simpleicons.org/ — colors are brand-hex; logos that are
// dark on dark get overridden to light tones. Missing slugs fall back to text.

export type Brand = {
  slug: string;
  color?: string;
};

export const TECH_BRANDS: Record<string, Brand> = {
  React: { slug: "react", color: "61DAFB" },
  TypeScript: { slug: "typescript", color: "3178C6" },
  Vite: { slug: "vite", color: "646CFF" },
  "Tailwind CSS": { slug: "tailwindcss", color: "06B6D4" },
  Tailwind: { slug: "tailwindcss", color: "06B6D4" },
  "Framer Motion": { slug: "framer", color: "0055FF" },
  Supabase: { slug: "supabase", color: "3FCF8E" },
  PostgreSQL: { slug: "postgresql", color: "4169E1" },
  "Cal.com": { slug: "caldotcom", color: "4F46E5" },
  Zapier: { slug: "zapier", color: "FF4F00" },
  Vercel: { slug: "vercel", color: "FFFFFF" },
  "Node.js": { slug: "nodedotjs", color: "5FA04E" },
  Express: { slug: "express", color: "FFFFFF" },
  "Claude API": { slug: "anthropic", color: "D97757" },
  "OpenAI API": { slug: "openai", color: "10A37F" },
  Playwright: { slug: "playwright", color: "2EAD33" },
  "Google Maps": { slug: "googlemaps", color: "4285F4" },
  Git: { slug: "git", color: "F05032" },
  Docker: { slug: "docker", color: "2496ED" },
  "Next.js": { slug: "nextdotjs", color: "FFFFFF" },
  Figma: { slug: "figma", color: "F24E1E" },
  MongoDB: { slug: "mongodb", color: "47A248" },
  Redis: { slug: "redis", color: "FF4438" },
  AWS: { slug: "amazonwebservices", color: "FF9900" },
};

export const COMPANY_BRANDS: Record<string, Brand> = {
  "Capgemini Design Practice": { slug: "capgemini" },
};
