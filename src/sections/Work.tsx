import { motion } from "framer-motion";
import EnterpriseCaseCard from "../components/EnterpriseCaseCard";
import CommercialEngagementCard from "../components/CommercialEngagementCard";
import { workSections } from "../data/portfolio";
import type { WorkItem } from "../types";

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

function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  if (item.kind === "enterprise") {
    return <EnterpriseCaseCard index={index} {...item} />;
  }
  return <CommercialEngagementCard index={index} {...item} />;
}

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
          Systems &amp; Products
        </motion.h2>
        <motion.p variants={fadeUp} className="section-description">
          I build software products and engineering systems — from internal
          enterprise AI tooling to commercial platforms delivered end-to-end.
          Each item below is a product engineering story, not a code showcase.
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
                {section.items.map((item) => (
                  <WorkCard
                    key={item.name}
                    item={item}
                    index={runningIndex++}
                  />
                ))}
              </div>
            </motion.section>
          ));
        })()}
      </motion.div>
    </section>
  );
}