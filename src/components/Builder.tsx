import { motion } from "framer-motion";

const principles = [
  {
    number: "01",
    title: "Product Thinking",
    text: "I approach every project from the user's perspective first. Technology serves the product, not the other way around. Before writing code, I ask — who is this for, and what problem does it actually solve?",
  },
  {
    number: "02",
    title: "Engineering Rigor",
    text: "Clean architecture, tested systems, documented decisions. I build software that other engineers want to work on. Code quality isn't a nice-to-have — it's how products survive and scale.",
  },
  {
    number: "03",
    title: "Relentless Execution",
    text: "Ideas without execution are just ideas. I ship. I iterate. I optimize. And I do it with attention to every detail — because the last 10% of polish is what separates good from memorable.",
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
      staggerChildren: 0.12,
    },
  },
};

export default function Builder() {
  return (
    <section id="builder" className="section">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={container}
      >
        <motion.span variants={fadeUp} className="section-label">
          Who I Am
        </motion.span>
        <motion.h2 variants={fadeUp} className="section-title">
          The Builder
        </motion.h2>
        <motion.p variants={fadeUp} className="section-description">
          I don't just write code — I build products. Every decision, from
          architecture to user experience, is made with intention. Here's how I
          think about the work.
        </motion.p>

        <div className="builder-grid">
          {principles.map((p) => (
            <motion.div key={p.number} variants={fadeUp} className="builder-card">
              <span className="builder-card-number">{p.number}</span>
              <h3 className="builder-card-title">{p.title}</h3>
              <p className="builder-card-text">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
