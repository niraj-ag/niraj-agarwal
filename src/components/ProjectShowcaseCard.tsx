import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { Project } from "../types";
import { BrowserFrame } from "./ProjectVisual";
import ProjectVisual from "./ProjectVisual";
import TechPill, { CompanyBadge } from "./Brands";
import { useCubeContext } from "./CubeController";

type Props = {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function useVideoOnView(
  frameRef: React.RefObject<HTMLButtonElement | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;

    video.muted = true;

    const play = () => video.play().catch(() => {});
    const pause = () => video.pause();

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) play();
        else pause();
      },
      { threshold: 0.4 }
    );
    io.observe(frame);

    return () => io.disconnect();
  }, [frameRef, videoRef]);
}

function useParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 18 });
  const sy = useSpring(y, { stiffness: 80, damping: 18 });
  const enabled = useRef(
    typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * -16);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * -12);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { sx, sy, onMouseMove, onMouseLeave };
}

export default function ProjectShowcaseCard({ project, index, onOpen }: Props) {
  const { setHoveredProjectIndex } = useCubeContext();
  const { sx, sy, onMouseMove, onMouseLeave } = useParallax();
  const previewRef = useRef<HTMLButtonElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isVideoPreview = project.preview.type === "video";
  useVideoOnView(previewRef, videoRef);

  const primaryIsLink =
    project.actionPrimary.type === "link" && project.actionPrimary.href;

  return (
    <motion.article
      variants={itemVariants}
      className="showcase-card"
      onMouseEnter={() => setHoveredProjectIndex(index)}
      onMouseLeave={() => setHoveredProjectIndex(null)}
    >
      <button
        ref={previewRef}
        type="button"
        className="showcase-preview"
        onClick={() => onOpen(project)}
        aria-label={`Open ${project.name} showcase`}
      >
        <BrowserFrame url={project.name}>
          <div className="showcase-parallax" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
            <motion.div className="showcase-parallax-inner" style={{ x: sx, y: sy }}>
              <ProjectVisual
                visual={project.preview}
                name={project.name}
                autoPlay={false}
                videoRef={isVideoPreview ? videoRef : undefined}
              />
            </motion.div>
          </div>
        </BrowserFrame>
        <span className="showcase-preview-veil" aria-hidden="true" />
        <span className="showcase-preview-open" aria-hidden="true">
          View showcase
          <span className="showcase-preview-arrow">→</span>
        </span>
      </button>

      <div className="showcase-info">
        <div className="showcase-meta">
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

        <h3 className="showcase-name">{project.name}</h3>

        <div className="showcase-client">
          <CompanyBadge name={project.client} />
          <span className="showcase-client-text">{project.client}</span>
          <span className="showcase-client-sep" aria-hidden="true">
            ·
          </span>
          <span>{project.role}</span>
          <span className="showcase-client-sep" aria-hidden="true">
            ·
          </span>
          <span>{project.date}</span>
        </div>

        <p className="showcase-description">{project.description}</p>

        {project.tech.length > 0 && (
          <div className="showcase-tech">
            {project.tech.map((t) => (
              <TechPill key={t} name={t} />
            ))}
          </div>
        )}

        <div className="showcase-actions">
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
              onClick={() => onOpen(project)}
            >
              <span>{project.actionPrimary.label}</span>
              <span className="showcase-cta-arrow">→</span>
            </button>
          )}

          {project.actionSecondary &&
            (project.actionSecondary.type === "modal" ? (
              <button
                type="button"
                className="showcase-cta showcase-cta--ghost"
                onClick={() => onOpen(project)}
              >
                {project.actionSecondary.label}
              </button>
            ) : (
              <a
                href={project.actionSecondary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="showcase-cta showcase-cta--ghost"
              >
                {project.actionSecondary.label}
                <span className="showcase-cta-arrow">↗</span>
              </a>
            ))}
        </div>
      </div>
    </motion.article>
  );
}