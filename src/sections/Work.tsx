import { motion } from "framer-motion";
import ProjectItem from "../components/ProjectItem";
import { projects } from "../data/project";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Work() {
  return (
    <section id="work" className="section">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.05 }}
        variants={listVariants}
      >
        <motion.span variants={fadeUp} className="section-label">
          Selected Work
        </motion.span>
        <motion.h2 variants={fadeUp} className="section-title">
          Products & Experiments
        </motion.h2>
        <motion.p variants={fadeUp} className="section-description">
          Projects presented as products — with context, challenges, and
          outcomes. Not code showcases. Not GitHub repositories.
        </motion.p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "3rem" }}>
          {projects.map((project, index) => (
            <ProjectItem key={index} index={index} {...project} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}