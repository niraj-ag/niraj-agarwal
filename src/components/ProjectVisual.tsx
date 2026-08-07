import type { ProjectVideo, Visual } from "../types";

type BrandedProps = {
  name: string;
  label?: string;
  className?: string;
};

export function BrandedTile({ name, label = "Concept", className }: BrandedProps) {
  return (
    <div className={`branded-tile ${className ?? ""}`}>
      <span className="branded-tile-grid" aria-hidden="true" />
      <span className="branded-tile-glow" aria-hidden="true" />
      <span className="branded-tile-label">{label}</span>
      <span className="branded-tile-name">{name}</span>
    </div>
  );
}

type FrameProps = {
  children: React.ReactNode;
  url?: string;
  className?: string;
};

export function BrowserFrame({ children, url, className }: FrameProps) {
  return (
    <div className={`browser-frame ${className ?? ""}`}>
      <div className="browser-frame-bar">
        <span className="browser-frame-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {url && <span className="browser-frame-url">{url}</span>}
      </div>
      <div className="browser-frame-screen">{children}</div>
    </div>
  );
}

type VisualValue = Visual | ProjectVideo;

export default function ProjectVisual({
  visual,
  name,
  className,
  autoPlay = true,
  preload = "metadata",
  videoRef,
}: {
  visual: VisualValue;
  name: string;
  className?: string;
  autoPlay?: boolean;
  preload?: "auto" | "metadata" | "none";
  videoRef?: React.Ref<HTMLVideoElement>;
}) {
  if (visual.type === "branded") {
    return <BrandedTile name={name} className={className} />;
  }

  if (visual.type === "video") {
    return (
      <video
        ref={videoRef}
        className={className}
        src={visual.src}
        poster={visual.poster}
        muted
        loop
        playsInline
        autoPlay={autoPlay}
        preload={preload}
        aria-label={`${name} preview video`}
      />
    );
  }

  return (
    <img
      className={className}
      src={visual.src}
      alt={`${name} preview`}
      loading="lazy"
    />
  );
}