import { motion } from "framer-motion";

const toolGroups = [
  {
    name: "Build",
    tools: [
      { name: "React", desc: "Component architecture & interactive UIs" },
      { name: "TypeScript", desc: "Type-safe, maintainable codebases" },
      { name: "Node.js", desc: "Server-side logic & API services" },
      { name: "Next.js", desc: "Full-stack React with SSR/SSG" },
    ],
  },
  {
    name: "Design",
    tools: [
      { name: "Tailwind CSS", desc: "Rapid, consistent UI styling" },
      { name: "Framer Motion", desc: "Physics-based animation & interaction" },
      { name: "Figma", desc: "UI/UX design & prototyping" },
    ],
  },
  {
    name: "Ship",
    tools: [
      { name: "Git", desc: "Version control & collaboration" },
      { name: "Docker", desc: "Containerized, reproducible deployments" },
      { name: "CI/CD", desc: "Automated testing & delivery pipelines" },
      { name: "Vite", desc: "Fast build tooling & HMR" },
    ],
  },
  {
    name: "Operate",
    tools: [
      { name: "PostgreSQL", desc: "Relational data & complex queries" },
      { name: "MongoDB", desc: "Flexible document storage" },
      { name: "Redis", desc: "Caching & real-time pub/sub" },
      { name: "AWS", desc: "Cloud infrastructure & scaling" },
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function TechStack() {
  return (
    <section id="tools" className="section">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={container}
      >
        <motion.span variants={fadeUp} className="section-label">
          The Stack
        </motion.span>
        <motion.h2 variants={fadeUp} className="section-title">
          Tools of Choice
        </motion.h2>
        <motion.p variants={fadeUp} className="section-description">
          Technologies I use to build products. Each chosen deliberately — not
          because they're trending, but because they solve real problems well.
        </motion.p>

        <div className="tools-grid">
          {toolGroups.map((group) => (
            <motion.div
              key={group.name}
              variants={fadeUp}
              className="tool-group"
            >
              <h3 className="tool-group-name">{group.name}</h3>
              <ul className="tool-list">
                {group.tools.map((tool) => (
                  <li key={tool.name} className="tool-item">
                    <span className="tool-item-name">{tool.name}</span>
                    <span className="tool-item-desc">{tool.desc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}