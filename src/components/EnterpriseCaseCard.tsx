import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { EnterpriseProject } from "../types";
import { useCubeContext } from "./CubeController";

type Props = EnterpriseProject & {
  index: number;
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function EnterpriseCaseCard({
  name,
  badge,
  confidential,
  confidentialTitle,
  confidentialNote,
  overview,
  problem,
  challenge,
  architecture,
  engineeringDecisions,
  solution,
  solutionPoints,
  outcome,
  metrics,
  tech,
  highlights,
  role,
  date,
  index,
}: Props) {
  const { setHoveredProjectIndex } = useCubeContext();
  const [expanded, setExpanded] = useState(false);
  const expandId = useId();

  return (
    <motion.article
      variants={itemVariants}
      className={`work-card ${expanded ? "work-card--expanded" : ""}`}
      onMouseEnter={() => setHoveredProjectIndex(index)}
      onMouseLeave={() => setHoveredProjectIndex(null)}
    >
      <header className="work-card-header">
        <div className="work-card-heading">
          <div className="work-card-badges">
            <span className="work-card-badge">{badge}</span>
            <span className="work-card-status">
              <span className="work-card-status-dot work-card-status-dot--internal" />
              Internal
            </span>
          </div>
          <h3 className="work-card-title">{name}</h3>
          <p className="work-card-meta-row">
            <span>{role}</span>
            <span className="work-card-meta-divider">/</span>
            <span>{date}</span>
          </p>
        </div>

        {confidential && (
          <span className="work-card-confidential-chip" title="Confidential">
            🔒
          </span>
        )}
      </header>

      <p className="work-card-summary">{overview}</p>

      {confidential && (
        <div className="work-card-confidential" role="note">
          <span className="work-card-confidential-lock">🔒</span>
          <div>
            <p className="work-card-confidential-title">{confidentialTitle}</p>
            <p className="work-card-confidential-text">{confidentialNote}</p>
          </div>
        </div>
      )}

      <div className="work-card-actions">
        <button
          type="button"
          className="work-card-expand-toggle"
          aria-expanded={expanded}
          aria-controls={expandId}
          onClick={() => setExpanded((v) => !v)}
        >
          <span>{expanded ? "Close Case Study" : "View Case Study"}</span>
          <span
            className={`work-card-expand-chevron ${expanded ? "work-card-expand-chevron--open" : ""}`}
            aria-hidden="true"
          >
            ↓
          </span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={expandId}
            className="work-card-case-study"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="work-card-case-study-inner">
              <dl className="work-card-meta">
                <dt className="work-card-label">Overview</dt>
                <dd className="work-card-value">{overview}</dd>

                <dt className="work-card-label">Problem</dt>
                <dd className="work-card-value">{problem}</dd>

                <dt className="work-card-label">Challenge</dt>
                <dd className="work-card-value">{challenge}</dd>
              </dl>

              <h4 className="work-card-subheading">Architecture</h4>
              <div className="work-card-architecture" aria-label="Architecture flow">
                {architecture.map((node, i) => (
                  <div key={node} className="work-card-architecture-item">
                    {i > 0 && (
                      <span className="work-card-architecture-arrow" aria-hidden="true">
                        ↓
                      </span>
                    )}
                    <span className="work-card-architecture-node">{node}</span>
                  </div>
                ))}
              </div>

              <h4 className="work-card-subheading">Engineering Decisions</h4>
              <ol className="work-card-decisions">
                {engineeringDecisions.map((decision, i) => (
                  <li key={decision} className="work-card-decision">
                    <span className="work-card-decision-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="work-card-decision-text">{decision}</p>
                  </li>
                ))}
              </ol>

              <h4 className="work-card-subheading">Solution</h4>
              <div className="work-card-value">
                <p>{solution}</p>
                <ul className="work-card-solution-list">
                  {solutionPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              {metrics.length > 0 && (
                <div className="work-card-metrics">
                  {metrics.map((m) => (
                    <div key={m.label} className="work-card-metric">
                      <span className="work-card-metric-value">{m.value}</span>
                      <span className="work-card-metric-label">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <h4 className="work-card-subheading">Outcome</h4>
              <p className="work-card-value work-card-value--outcome">{outcome}</p>

              <h4 className="work-card-subheading">Stack</h4>
              <div className="work-card-tech">
                {tech.map((t) => (
                  <span key={t} className="work-card-tech-tag">
                    {t}
                  </span>
                ))}
              </div>

              <h4 className="work-card-subheading">Engineering Highlights</h4>
              <div className="work-card-highlights">
                {highlights.map((h) => (
                  <span key={h} className="work-card-highlight-tag">
                    {h}
                  </span>
                ))}
              </div>

              <footer className="work-card-footer">
                <span>Role — {role}</span>
                <span className="work-card-footer-divider">·</span>
                <span>Timeline — {date}</span>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
