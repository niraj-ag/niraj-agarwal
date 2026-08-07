import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectShowcaseCard from "../components/ProjectShowcaseCard";
import ProjectModal from "../components/ProjectModal";
import { workSections } from "../data/portfolio";
import type { Project } from "../types";

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
  const [selected, setSelected] = useState<Project | null>(null);

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
          Built Products
        </motion.h2>
        <motion.p variants={fadeUp} className="section-description">
          Proof of work, not paragraphs. Six products — enterprise AI tooling
          and commercial platforms — each one built end-to-end.
        </motion.p>

        {(() => {
          let runningIndex = 0;
          return workSections.map((section) => (
            <motion.section
              key={section.id}
              variants={fadeUp}
              className="work-group"
            >
              <header className="work-group-header">
                <div>
                  <h3 className="work-group-label">{section.label}</h3>
                  <p className="work-group-tagline">{section.tagline}</p>
                </div>
                <span className="work-group-count">
                  {String(section.count).padStart(2, "0")}
                </span>
              </header>

              <div className="work-list">
                {section.items.map((project) => (
                  <ProjectShowcaseCard
                    key={project.id}
                    project={project}
                    index={runningIndex++}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            </motion.section>
          ));
        })()}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <ProjectModal
            key={selected.id}
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}