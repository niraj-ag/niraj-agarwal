import { useState, useEffect } from "react";
import { motion, useAnimationFrame } from "framer-motion";

interface MirrorCubeProps {
  size?: number;
  mode: "interactive" | "turned" | "nearly-solved" | "solved";
  autoPlay?: boolean;
  className?: string;
}

/*
 * Material Design Language:
 * - Matte black ceramic body
 * - Graphite anodized aluminum sticker surfaces
 * - Precision-machined seam lines (hair-thin, barely visible)
 * - Dramatic product photography lighting
 * - Restrained emerald accent on edges only
 *
 * References: Apple hardware, Nothing design, Teenage Engineering, Linear
 */

// Material palette
const MATERIALS = {
  // Cubie body — matte black ceramic
  body: "#080808",
  // Outer face seam — precision-machined edge, barely visible
  seamOuter: "rgba(255, 255, 255, 0.05)",
  // Inner face seam — darker, recessed gap between cubies
  seamInner: "rgba(0, 0, 0, 0.9)",
  // Sticker edge border — machined chamfer catching light
  chamferLight: "rgba(255, 255, 255, 0.07)",
  // Active face highlight — soft emerald accent, very restrained
  accentEdge: "rgba(100, 255, 218, 0.12)",
  // Shadow beneath and between cubies
  depthShadow: "rgba(0, 0, 0, 0.7)",
};

export default function MirrorCube({
  size = 160,
  mode,
  autoPlay = true,
  className = "",
}: MirrorCubeProps) {
  const [rotation, setRotation] = useState({ x: -20, y: 45 });
  const [time, setTime] = useState(0);

  // Mouse tracking — smooth, deliberate response
  useEffect(() => {
    if (mode !== "interactive") return;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = e.clientX / window.innerWidth - 0.5;
      const normY = e.clientY / window.innerHeight - 0.5;

      setRotation({
        x: -22 + normY * 30,
        y: 40 + normX * 40,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mode]);

  // Breathing twist animation
  useAnimationFrame((t) => {
    if (mode === "interactive" && autoPlay) {
      setTime(t / 1000);
    }
  });

  // Mirror Block proportions (20%, 30%, 50%)
  const p = [0.2, 0.3, 0.5];
  const sizes = [size * p[0], size * p[1], size * p[2]];

  // Cubie center positions relative to cube origin
  const posX = [-size * 0.4, -size * 0.15, size * 0.25];
  const posZ = [-size * 0.4, -size * 0.15, size * 0.25];
  const posY = [size * 0.25, -size * 0.15, -size * 0.4];

  // Slice rotation angles per mode
  let rotTop = 0;
  let rotMiddle = 0;
  let rotBottom = 0;

  if (mode === "interactive") {
    if (autoPlay) {
      const cycle = time * 0.5;
      const alignmentWave = Math.sin(cycle / 2) * Math.sin(cycle / 2);
      rotTop = Math.sin(cycle) * 45 * alignmentWave;
      rotMiddle = Math.sin(cycle + Math.PI / 3) * -28 * alignmentWave;
      rotBottom = Math.sin(cycle + (Math.PI * 2) / 3) * 16 * alignmentWave;
    } else {
      rotTop = 35;
      rotMiddle = -20;
      rotBottom = 10;
    }
  } else if (mode === "turned") {
    rotTop = 30;
    rotMiddle = -18;
    rotBottom = 8;
  } else if (mode === "nearly-solved") {
    rotTop = 8;
    rotMiddle = -4;
    rotBottom = 2;
  } else if (mode === "solved") {
    rotTop = 0;
    rotMiddle = 0;
    rotBottom = 0;
  }

  const faceBorderRadius = Math.max(0.5, size * 0.01);
  const stickerInset = Math.max(0.5, size * 0.014);
  const stickerBorderRadius = Math.max(0.5, size * 0.008);

  // Determine which edges of a face sit on the outside of the cube
  // and should get a subtle rim highlight
  const getEdgeHighlights = (
    i: number,
    j: number,
    _k: number,
    face: string
  ) => {
    const highlights: string[] = [];

    // Top edge highlight — only on the topmost visible faces
    if (j === 2 && (face === "front" || face === "back" || face === "left" || face === "right")) {
      highlights.push("inset 0 0.5px 0 rgba(255, 255, 255, 0.08)");
    }
    // Right edge highlight — rightmost column catches rim light
    if (i === 2 && (face === "front" || face === "back" || face === "top" || face === "bottom")) {
      highlights.push("inset -0.5px 0 0 rgba(255, 255, 255, 0.05)");
    }

    return highlights.join(", ");
  };

  // Cubie rendering
  const renderCubie = (i: number, j: number, k: number) => {
    // Skip internal core cubie
    if (i === 1 && j === 1 && k === 1) return null;

    const W = sizes[i];
    const H = sizes[2 - j];
    const D = sizes[k];
    const x = posX[i];
    const y = posY[j];
    const z = posZ[k];

    const isOuterFace = (
      face: "front" | "back" | "left" | "right" | "top" | "bottom"
    ) => {
      if (face === "front" && k === 2) return true;
      if (face === "back" && k === 0) return true;
      if (face === "left" && i === 0) return true;
      if (face === "right" && i === 2) return true;
      if (face === "top" && j === 2) return true;
      if (face === "bottom" && j === 0) return true;
      return false;
    };

    const renderFace = (
      face: "front" | "back" | "left" | "right" | "top" | "bottom",
      width: number,
      height: number,
      transformStr: string,
      brushDir: "h" | "v"
    ) => {
      const active = isOuterFace(face);
      const edgeHighlights = getEdgeHighlights(i, j, k, face);

      // Build box-shadow for this face
      const shadows: string[] = [];
      if (active) {
        // Subtle depth shadow within the face
        shadows.push(`inset 0 0 ${Math.max(2, size * 0.02)}px ${MATERIALS.depthShadow}`);
        // Very faint emerald accent glow along edges
        shadows.push(`inset 0 0 ${Math.max(1, size * 0.008)}px ${MATERIALS.accentEdge}`);
      } else {
        shadows.push(`inset 0 0 3px ${MATERIALS.depthShadow}`);
      }
      if (edgeHighlights) shadows.push(edgeHighlights);

      return (
        <div
          key={face}
          style={{
            position: "absolute",
            width: `${width}px`,
            height: `${height}px`,
            marginLeft: `${-width / 2}px`,
            marginTop: `${-height / 2}px`,
            left: "50%",
            top: "50%",
            transform: transformStr,
            backfaceVisibility: "hidden",
            // Matte black ceramic body
            backgroundColor: MATERIALS.body,
            // Precision seam lines — hair-thin
            border: active
              ? `0.5px solid ${MATERIALS.chamferLight}`
              : `0.5px solid ${MATERIALS.seamInner}`,
            borderRadius: `${faceBorderRadius}px`,
            boxShadow: shadows.join(", "),
          }}
        >
          {active && (
            <div
              className={`mirror-sticker ${
                brushDir === "h" ? "mirror-sticker-h" : "mirror-sticker-v"
              }`}
              style={{
                position: "absolute",
                top: `${stickerInset}px`,
                left: `${stickerInset}px`,
                right: `${stickerInset}px`,
                bottom: `${stickerInset}px`,
                borderRadius: `${stickerBorderRadius}px`,
              }}
            />
          )}
        </div>
      );
    };

    return (
      <div
        key={`${i}-${j}-${k}`}
        style={{
          position: "absolute",
          width: `${W}px`,
          height: `${H}px`,
          left: "50%",
          top: "50%",
          marginLeft: `${-W / 2}px`,
          marginTop: `${-H / 2}px`,
          transformStyle: "preserve-3d",
          transform: `translate3d(${x}px, ${y}px, ${z}px)`,
        }}
      >
        {renderFace("front", W, H, `translate3d(0, 0, ${D / 2}px)`, "h")}
        {renderFace(
          "back",
          W,
          H,
          `rotateY(180deg) translate3d(0, 0, ${D / 2}px)`,
          "h"
        )}
        {renderFace(
          "left",
          D,
          H,
          `rotateY(-90deg) translate3d(0, 0, ${W / 2}px)`,
          "h"
        )}
        {renderFace(
          "right",
          D,
          H,
          `rotateY(90deg) translate3d(0, 0, ${W / 2}px)`,
          "h"
        )}
        {renderFace(
          "top",
          W,
          D,
          `rotateX(90deg) translate3d(0, 0, ${H / 2}px)`,
          "v"
        )}
        {renderFace(
          "bottom",
          W,
          D,
          `rotateX(-90deg) translate3d(0, 0, ${H / 2}px)`,
          "v"
        )}
      </div>
    );
  };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${size * 2}px`,
        height: `${size * 2}px`,
        perspective: `${size * 5.5}px`,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Ambient shadow — dramatic product photography lighting */}
      <div
        className="cube-core-glow"
        style={{ width: `${size * 1.8}px`, height: `${size * 1.8}px` }}
      />

      {/* Emerald rim light — restrained accent, positioned top-right */}
      <div
        className="cube-rim-light"
        style={{ width: `${size * 2}px`, height: `${size * 2}px` }}
      />

      {/* Drop shadow beneath the cube */}
      <div className="cube-drop-shadow" />

      {/* 3D Rotation Container */}
      <motion.div
        style={{
          position: "relative",
          width: `${size}px`,
          height: `${size}px`,
          transformStyle: "preserve-3d",
        }}
        animate={
          mode === "interactive"
            ? {
                rotateX: rotation.x,
                rotateY: rotation.y,
              }
            : {}
        }
        transition={
          mode === "interactive"
            ? { type: "spring", stiffness: 45, damping: 30 }
            : {}
        }
      >
        <div
          className={mode !== "interactive" ? "animate-spin-3d" : ""}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
          }}
        >
          {/* TOP SLICE (j = 2) */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
            }}
            animate={{ rotateY: rotTop }}
            transition={
              mode === "interactive"
                ? { type: "spring", stiffness: 45, damping: 30 }
                : { duration: 0.3 }
            }
          >
            {[0, 1, 2].map((i) =>
              [0, 1, 2].map((k) => renderCubie(i, 2, k))
            )}
          </motion.div>

          {/* MIDDLE SLICE (j = 1) */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
            }}
            animate={{ rotateY: rotMiddle }}
            transition={
              mode === "interactive"
                ? { type: "spring", stiffness: 45, damping: 30 }
                : { duration: 0.3 }
            }
          >
            {[0, 1, 2].map((i) =>
              [0, 1, 2].map((k) => renderCubie(i, 1, k))
            )}
          </motion.div>

          {/* BOTTOM SLICE (j = 0) */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
            }}
            animate={{ rotateY: rotBottom }}
            transition={
              mode === "interactive"
                ? { type: "spring", stiffness: 45, damping: 30 }
                : { duration: 0.3 }
            }
          >
            {[0, 1, 2].map((i) =>
              [0, 1, 2].map((k) => renderCubie(i, 0, k))
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
