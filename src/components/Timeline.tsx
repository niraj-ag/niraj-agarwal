import { motion } from "framer-motion";
import { timeline } from "../data/timeline";

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

export default function Timeline() {
  const current = timeline[0];

  return (
    <section id="chapter" className="section">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={container}
      >
        <motion.span variants={fadeUp} className="section-label">
          Where I Am Now
        </motion.span>
        <motion.h2 variants={fadeUp} className="section-title">
          Current Chapter
        </motion.h2>

        <div className="chapter-content">
          <motion.div variants={fadeUp}>
            <span className="chapter-label">{current.year}</span>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h3 className="chapter-role">{current.role}</h3>
            <p className="chapter-company">{current.company}</p>
            <p className="chapter-text">{current.description}</p>

            <ul className="chapter-focus-list">
              <li className="chapter-focus-item">
                Building scalable frontend systems for enterprise clients
              </li>
              <li className="chapter-focus-item">
                Designing modular API architectures across distributed teams
              </li>
              <li className="chapter-focus-item">
                Learning what deliberate engineering looks like at scale
              </li>
              <li className="chapter-focus-item">
                Growing from individual contributor to systems thinker
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}