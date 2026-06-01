import { motion } from "framer-motion";
import type { Project } from "../types";

type Props = Project;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function ProjectItem({
  title,
  tech,
  context,
  challenge,
  solution,
  outcome,
}: Props) {
  return (
    <motion.article variants={itemVariants} className="project-card">
      <h3 className="project-title">{title}</h3>

      <div className="project-meta">
        <span className="project-label">Context</span>
        <p className="project-value">{context}</p>

        <span className="project-label">Challenge</span>
        <p className="project-value">{challenge}</p>

        <span className="project-label">Solution</span>
        <p className="project-value">{solution}</p>

        <span className="project-label">Outcome</span>
        <p className="project-value outcome">{outcome}</p>
      </div>

      {tech && tech.length > 0 && (
        <div className="project-tech">
          {tech.map((t) => (
            <span key={t} className="project-tech-tag">
              {t}
            </span>
          ))}
        </div>
      )}
    </motion.article>
  );
}
