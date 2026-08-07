import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Project, ProjectVideo, Visual } from "../types";
import ProjectGallery from "./ProjectGallery";
import { BrowserFrame } from "./ProjectVisual";
import ProjectVisual from "./ProjectVisual";
import { BrandedTile } from "./ProjectVisual";
import TechPill, { CompanyBadge } from "./Brands";

type Props = {
  project: Project;
  onClose: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function isVideo(v: Visual | ProjectVideo): v is ProjectVideo {
  return v.type === "video";
}

export default function ProjectModal({ project, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [fullIndex, setFullIndex] = useState<number | null>(null);
  const fullCount = project.gallery ? project.gallery.length : 0;

  // Remember the trigger element, scroll-lock the body for the modal's lifetime
  useEffect(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      restoreFocusRef.current?.focus?.();
    };
  }, []);

  // Focus the panel on open
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const fullStep = useCallback(
    (dir: number) => {
      if (fullIndex === null) return;
      setFullIndex((fullIndex + dir + fullCount) % fullCount);
    },
    [fullIndex, fullCount]
  );

  // Focus trap for the dialog
  const trapDialog = useCallback(
    (e: KeyboardEvent) => {
      if (fullIndex !== null || !panelRef.current) return;
      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [fullIndex]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (fullIndex !== null) {
          setFullIndex(null);
        } else {
          onClose();
        }
        return;
      }
      if (fullIndex !== null && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
        fullStep(e.key === "ArrowLeft" ? -1 : 1);
        return;
      }
      trapDialog(e);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullIndex, onClose, trapDialog, fullStep]);

  // Keep lightbox focusable
  useEffect(() => {
    if (fullIndex !== null) {
      lightboxRef.current?.focus();
    }
  }, [fullIndex]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const primaryIsLink =
    project.actionPrimary.type === "link" && project.actionPrimary.href;

  const renderFull = (item: Visual | ProjectVideo, index: number) => {
    if (isVideo(item)) {
      return (
        <video
          src={item.src}
          poster={item.poster}
          muted
          loop
          playsInline
          autoPlay
          controls
          aria-label={`${project.name} gallery video ${index + 1}`}
        />
      );
    }
    if (item.type === "branded") {
      return <BrandedTile name={project.name} className="project-lightbox-branded" />;
    }
    return (
      <img
        src={item.src}
        alt={`${project.name} gallery item ${index + 1}`}
      />
    );
  };

  return (
    <motion.div
      className="project-modal-overlay"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={handleBackdrop}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} showcase`}
        className="project-modal"
        tabIndex={-1}
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.99 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="project-modal-bar">
          <span className="project-modal-brand">{project.name}</span>
          <button
            type="button"
            className="project-modal-close"
            onClick={onClose}
            aria-label="Close showcase"
          >
            <span className="project-modal-close-x" aria-hidden="true">
              ×
            </span>
          </button>
        </header>

        <div className="project-modal-scroll">
          {/* Hero */}
          <div className="project-modal-hero">
            <BrowserFrame url={project.name}>
              <ProjectVisual visual={project.preview} name={project.name} />
            </BrowserFrame>
          </div>

          <div className="project-modal-body">
            <div className="project-modal-meta">
              <span className="showcase-badge">{project.badge}</span>
              <span className="showcase-status">
                <span
                  className={`showcase-status-dot ${
                    project.statusLabel === "Live"
                      ? "showcase-status-dot--live"
                      : "showcase-status-dot--internal"
                  }`}
                />
                {project.statusLabel}
              </span>
            </div>

            <h2 className="project-modal-title">{project.name}</h2>
            <p className="project-modal-sub">
              <CompanyBadge name={project.client} />
              {project.client} · {project.role} · {project.date}
            </p>
            <p className="project-modal-overview">{project.overview}</p>

            {/* Stats */}
            {project.stats.length > 0 && (
              <div className="project-modal-stats">
                {project.stats.map((s) => (
                  <div key={s.label} className="project-modal-stat">
                    <span className="project-modal-stat-value">{s.value}</span>
                    <span className="project-modal-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="project-modal-section">
                <h3 className="project-modal-heading">Gallery</h3>
                <ProjectGallery
                  items={project.gallery}
                  name={project.name}
                  onPreview={(i) => setFullIndex(i)}
                />
              </div>
            )}

            {/* Key Features */}
            {project.features.length > 0 && (
              <div className="project-modal-section">
                <h3 className="project-modal-heading">Key Features</h3>
                <div className="project-modal-features">
                  {project.features.map((f) => (
                    <div key={f.title} className="project-feature">
                      <h4 className="project-feature-title">{f.title}</h4>
                      <p className="project-feature-text">{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            <div className="project-modal-section">
              <h3 className="project-modal-heading">Stack</h3>
              <div className="showcase-tech">
                {project.tech.map((t) => (
                  <TechPill key={t} name={t} />
                ))}
              </div>
            </div>

            {/* Architecture */}
            {project.architecture && project.architecture.length > 0 && (
              <div className="project-modal-section">
                <h3 className="project-modal-heading">Architecture</h3>
                <div className="project-architecture-grid" aria-label="Architecture flow">
                  {project.architecture.map((node, i) => (
                    <div key={node} className="project-architecture-cell">
                      {i > 0 && (
                        <span className="project-architecture-connector" aria-hidden="true">
                          →
                        </span>
                      )}
                      <span className="project-architecture-chip">{node}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="project-modal-actions">
              {primaryIsLink ? (
                <a
                  href={project.actionPrimary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="showcase-cta showcase-cta--primary"
                >
                  <span>{project.actionPrimary.label}</span>
                  <span className="showcase-cta-arrow">↗</span>
                </a>
              ) : (
                <button
                  type="button"
                  className="showcase-cta showcase-cta--primary"
                  onClick={onClose}
                >
                  <span>Preview complete</span>
                  <span className="showcase-cta-arrow">→</span>
                </button>
              )}

              {project.actionSecondary && project.actionSecondary.href && (
                <a
                  href={project.actionSecondary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="showcase-cta showcase-cta--ghost"
                >
                  {project.actionSecondary.label}
                  <span className="showcase-cta-arrow">↗</span>
                </a>
              )}

              {project.note && <p className="project-modal-note">{project.note}</p>}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fullscreen preview */}
      {fullIndex !== null && project.gallery && (
        <div className="project-lightbox" ref={lightboxRef} tabIndex={-1} role="dialog" aria-label="Fullscreen preview">
          <button
            type="button"
            className="project-lightbox-close"
            onClick={() => setFullIndex(null)}
            aria-label="Close preview"
          >
            ×
          </button>
          <button
            type="button"
            className="project-lightbox-nav project-lightbox-nav--prev"
            onClick={() => fullStep(-1)}
            aria-label="Previous"
          >
            ←
          </button>

          <div
            className="project-lightbox-stage"
            onClick={() => setFullIndex(null)}
            aria-hidden="false"
          >
            <div className="project-lightbox-frame">
              {project.gallery[fullIndex] &&
                renderFull(project.gallery[fullIndex], fullIndex)}
            </div>
          </div>

          <button
            type="button"
            className="project-lightbox-nav project-lightbox-nav--next"
            onClick={() => fullStep(1)}
            aria-label="Next"
          >
            →
          </button>
        </div>
      )}
    </motion.div>
  );
}