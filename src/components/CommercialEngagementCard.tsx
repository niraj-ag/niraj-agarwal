import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CommercialEngagement, Deliverable } from "../types";
import { useCubeContext } from "./CubeController";

type Props = CommercialEngagement & {
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

const STATUS_LABEL: Record<CommercialEngagement["status"], string> = {
  live: "Live",
  internal: "Internal",
  "in-progress": "In Progress",
};

const STATUS_DOT: Record<CommercialEngagement["status"], string> = {
  live: "work-card-status-dot--live",
  internal: "work-card-status-dot--internal",
  "in-progress": "work-card-status-dot--progress",
};

function DeliverableBlock({ deliverable, number }: { deliverable: Deliverable; number: string }) {
  const {
    name,
    description,
    purpose,
    overview,
    problem,
    solution,
    outcome,
    tech,
    highlights,
    abstract,
    linkLabel,
    linkHref,
    authorizedNote,
    authorizedHref,
  } = deliverable;

  return (
    <article className="work-card-deliverable">
      <header className="work-card-deliverable-header">
        <span className="work-card-deliverable-number">{number}</span>
        <div>
          <h5 className="work-card-deliverable-name">{name}</h5>
          <p className="work-card-deliverable-description">{description}</p>
        </div>
      </header>

      {/* Abstract product surface — CSS only, never a screenshot */}
      <div className="work-card-deliverable-media" aria-hidden="true">
        <span className="work-card-deliverable-media-tag">{abstract.tag}</span>
        <span className="work-card-deliverable-media-title">{abstract.title}</span>
      </div>

      <div className="work-card-deliverable-grid">
        {overview && (
          <div className="work-card-deliverable-item">
            <span className="work-card-label">Overview</span>
            <p className="work-card-value">{overview}</p>
          </div>
        )}
        {problem && (
          <div className="work-card-deliverable-item">
            <span className="work-card-label">Problem</span>
            <p className="work-card-value">{problem}</p>
          </div>
        )}
        {solution && (
          <div className="work-card-deliverable-item">
            <span className="work-card-label">Solution</span>
            <p className="work-card-value">{solution}</p>
          </div>
        )}
        <div className="work-card-deliverable-item">
          <span className="work-card-label">Outcome</span>
          <p className="work-card-value work-card-value--outcome">{outcome}</p>
        </div>
      </div>

      <div className="work-card-deliverable-item">
        <span className="work-card-label">Purpose</span>
        <ul className="work-card-purpose-list">
          {purpose.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <div className="work-card-tech">
        {tech.map((t) => (
          <span key={t} className="work-card-tech-tag">
            {t}
          </span>
        ))}
      </div>

      {highlights && highlights.length > 0 && (
        <div className="work-card-highlights">
          {highlights.map((h) => (
            <span key={h} className="work-card-highlight-tag">
              {h}
            </span>
          ))}
        </div>
      )}

      <div className="work-card-deliverable-actions">
        {linkLabel && linkHref && (
          <a
            href={linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="work-card-link"
          >
            <span>{linkLabel}</span>
            <span className="work-card-link-arrow">↗</span>
          </a>
        )}

        {authorizedNote && (
          <div className="work-card-authorized" role="note">
            <span className="work-card-authorized-lock">🔒</span>
            <div>
              <p className="work-card-authorized-title">{authorizedNote}</p>
              <p className="work-card-authorized-text">
                Available only to authorized users.
                {authorizedHref && (
                  <>
                    {" "}
                    <a
                      href={authorizedHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-card-authorized-link"
                    >
                      Authorized access ↗
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function CommercialEngagementCard({
  name,
  badge,
  status,
  headline,
  overview,
  role,
  date,
  highlights,
  deliverables,
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
              <span className={`work-card-status-dot ${STATUS_DOT[status]}`} />
              {STATUS_LABEL[status]}
            </span>
            <span className="work-card-status">
              {deliverables.length}{" "}
              {deliverables.length === 1 ? "deliverable" : "deliverables"}
            </span>
          </div>
          <h3 className="work-card-title">{name}</h3>
          <p className="work-card-headline">{headline}</p>
          <p className="work-card-meta-row">
            <span>{role}</span>
            <span className="work-card-meta-divider">/</span>
            <span>{date}</span>
          </p>
        </div>
      </header>

      <p className="work-card-summary">{overview}</p>

      <div className="work-card-highlights work-card-highlights--summary">
        {highlights.map((h) => (
          <span key={h} className="work-card-highlight-tag">
            {h}
          </span>
        ))}
      </div>

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
              <div className="work-card-meta work-card-meta--single">
                <span className="work-card-label">Engagement</span>
                <p className="work-card-value">{overview}</p>
              </div>

              <div className="work-card-deliverables">
                {deliverables.map((deliverable, i) => (
                  <DeliverableBlock
                    key={deliverable.id}
                    deliverable={deliverable}
                    number={String(i + 1).padStart(2, "0")}
                  />
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
