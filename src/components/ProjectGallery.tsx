import { useState } from "react";
import type { ProjectVideo, Visual } from "../types";
import ProjectVisual from "./ProjectVisual";

type Props = {
  items: (Visual | ProjectVideo)[];
  name: string;
  onPreview: (index: number) => void;
};

export default function ProjectGallery({ items, name, onPreview }: Props) {
  const [index, setIndex] = useState(0);
  const count = items.length;
  const single = count <= 1;
  const displayIndex = Math.min(index, count - 1);

  const step = (dir: number) => {
    setIndex((i) => (i + dir + count) % count);
  };

  const go = (i: number) => {
    if (i !== index) setIndex(i);
  };

  return (
    <figure className="project-gallery">
      <div className="project-gallery-main">
        <button
          type="button"
          className="project-gallery-shot"
          onClick={() => onPreview(displayIndex)}
          aria-label={`Preview gallery item ${displayIndex + 1}`}
        >
          <ProjectVisual visual={items[displayIndex]} name={name} />
        </button>

        {!single && (
          <span className="project-gallery-count">
            {String(displayIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        )}
      </div>

      {!single && (
        <div className="project-gallery-controls">
          <button
            type="button"
            className="project-gallery-nav project-gallery-nav--prev"
            onClick={() => step(-1)}
            aria-label="Previous image"
          >
            ←
          </button>

          <div className="project-gallery-thumbs">
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                className={`project-gallery-thumb ${
                  i === displayIndex ? "project-gallery-thumb--active" : ""
                }`}
                onClick={() => go(i)}
                aria-label={`Go to gallery item ${i + 1}`}
              >
                <ProjectVisual visual={item} name={name} autoPlay={false} />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="project-gallery-nav project-gallery-nav--next"
            onClick={() => step(1)}
            aria-label="Next image"
          >
            →
          </button>
        </div>
      )}
    </figure>
  );
}