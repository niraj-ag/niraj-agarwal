import { useEffect, useState } from "react";

/** Subtle radial light that follows the cursor — desktop only. */
export default function CursorSpotlight() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <div
      className="cursor-spotlight"
      style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(91, 140, 255, 0.015), transparent 80%)`,
      }}
    />
  );
}