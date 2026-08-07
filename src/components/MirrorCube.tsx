import { motion, useAnimationFrame, useAnimation } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";

interface MirrorCubeProps {
  size?: number;
  mode: "interactive" | "turned" | "nearly-solved" | "solved";
  autoPlay?: boolean;
  className?: string;
  // Interaction-awareness props (from CubeController context)
  activeSection?: string;
  hoveredProjectIndex?: number | null;
  isHovered?: boolean;
  isClicked?: boolean;
  gyroRotation?: { alpha: number; beta: number; gamma: number } | null;
  gyroAvailable?: boolean;
}


// Premium three-tier electric-blue lighting system
const BLUE = {
  bright: "#6EC6FF",   // specular highlights — brightest
  primary: "#4DA6FF",  // glow source — primary accent
  deep: "#1F7CFF",     // depth and rim lighting — deepest
};

// Material palette — lifted from background for clear visibility
const MATERIALS = {
  body: "#15171C",
  bodyInner: "#0A0B0D",

  seamHighlight: "rgba(255,255,255,0.18)",
  seamRecessed: "rgba(0,0,0,0.8)",

  chamfer: "rgba(255,255,255,0.22)",

  blueSeam: "rgba(77,166,255,0.65)",

  ambientOcclusion: "rgba(0,0,0,0.7)",

  glowPrimary: "#4DA6FF",
  glowSecondary: "#1F7CFF",

  accentReflection: "rgba(77,166,255,0.40)"
};

// --- Section-level slice rotation offsets ---
// Each section maps to subtle structural adjustments
const SECTION_OFFSETS: Record<string, { top: number; mid: number; bot: number }> = {
  hero:    { top: 0,  mid: 0,   bot: 0 },
  builder: { top: 8,  mid: -3,  bot: 2 },
  work:    { top: 18, mid: -10, bot: 6 },
  chapter: { top: 5,  mid: -2,  bot: 1 },
  tools:   { top: 12, mid: -6,  bot: 4 },
  beyond:  { top: 10, mid: -5,  bot: 3 },
  contact: { top: 0,  mid: 0,   bot: 0 },
};

// --- Project hover rotation offsets ---
// Each project triggers a unique cube configuration
const PROJECT_OFFSETS = [
  { top: 12,  mid: -4, bot: 2 },
  { top: -6,  mid: 8,  bot: -3 },
  { top: 4,   mid: 4,  bot: 8 },
  { top: -10, mid: -2, bot: 5 },
  { top: 9,   mid: 6,  bot: -6 },
  { top: -4,  mid: -8, bot: 4 },
];

// Hex-to-RGB helper for building rgba strings from BLUE constants
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Spring-interpolation helper (framerate-independent lerp)
function springLerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}


export default function MirrorCube({
  size = 160,
  mode,
  autoPlay = true,
  className = "",
  activeSection = "hero",
  hoveredProjectIndex = null,
  isHovered = false,
  isClicked = false,
  gyroRotation = null,
  gyroAvailable = false,
}: MirrorCubeProps) {
  const [time, setTime] = useState(0);

  // --- Spring-physics cursor tracking ---
  // Instead of direct setState, we track target and interpolate smoothly
  const mouseTargetRef = useRef({ x: -20, y: 45 });
  const currentRotationRef = useRef({ x: -20, y: 45 });
  const [smoothRotation, setSmoothRotation] = useState({ x: -20, y: 45 });

  // --- Idle timer for discovery micro-rotation ---
  const lastInteractionRef = useRef(Date.now());
  const idleMicroRotationRef = useRef(0);

  // --- Internal face depth pulse ---
  const [internalPulse, setInternalPulse] = useState(0.7);

  // --- Click animation controls ---
  const topSliceControls = useAnimation();
  const clickAnimatingRef = useRef(false);
  const rotTopRef = useRef(0);

  // --- Hover state transitions ---
  const [hoverIntensity, setHoverIntensity] = useState(0);
  const hoverIntensityRef = useRef(0);

  // Mouse tracking — capture target, not direct rotation
  useEffect(() => {
    if (mode !== "interactive") return;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = e.clientX / window.innerWidth - 0.5;
      const normY = e.clientY / window.innerHeight - 0.5;

      // Max ±10° rotation from center — premium, restrained
      mouseTargetRef.current = {
        x: -20 + normY * 20,
        y: 45 + normX * 20,
      };

      lastInteractionRef.current = Date.now();
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mode]);

  // Main animation frame — spring physics, idle detection, internal pulse
  useAnimationFrame((t) => {
    if (mode !== "interactive") return;

    if (autoPlay) {
      setTime(t / 1000);
    }

    // --- Spring-physics interpolation ---
    // Spring factor 0.07 creates premium, weighty feel while remaining responsive
    const springFactor = 0.07;
    let targetX = mouseTargetRef.current.x;
    let targetY = mouseTargetRef.current.y;

    // Gyroscope overrides mouse on mobile
    if (gyroAvailable && gyroRotation) {
      // gyroRotation.beta/gamma are now relative tilt from how user first held phone
      // Map relative tilt to ±12° cube rotation — clearly perceptible
      const gyroBeta = Math.max(-12, Math.min(12, gyroRotation.beta * 0.6));
      const gyroGamma = Math.max(-12, Math.min(12, gyroRotation.gamma * 0.8));
      targetX = -20 + gyroBeta;
      targetY = 45 + gyroGamma;
    }

    currentRotationRef.current = {
      x: springLerp(currentRotationRef.current.x, targetX, springFactor),
      y: springLerp(currentRotationRef.current.y, targetY, springFactor),
    };

    setSmoothRotation({ ...currentRotationRef.current });

    // --- Hover intensity interpolation ---
    const hoverTarget = isHovered ? 1 : 0;
    hoverIntensityRef.current = springLerp(
      hoverIntensityRef.current,
      hoverTarget,
      0.06
    );
    // Only update state when meaningfully different
    if (Math.abs(hoverIntensityRef.current - hoverIntensity) > 0.005) {
      setHoverIntensity(hoverIntensityRef.current);
    }

    // --- Internal face depth pulse (12s cycle) ---
    const pulseValue = 0.7 + 0.15 * Math.sin((t / 1000) * (Math.PI / 6));
    setInternalPulse(pulseValue);

    // --- Idle micro-rotation (after 30s of no interaction) ---
    const idleTime = Date.now() - lastInteractionRef.current;
    if (idleTime > 30000) {
      // Very slow 2° micro-rotation on middle slice, 20s cycle
      idleMicroRotationRef.current =
        2 * Math.sin(((t / 1000) * Math.PI) / 10);
    } else {
      idleMicroRotationRef.current = springLerp(
        idleMicroRotationRef.current,
        0,
        0.02
      );
    }
  });

  // --- Click interaction: controlled mechanical movement ---
  const handleClick = useCallback(async () => {
    if (mode !== "interactive" || clickAnimatingRef.current) return;
    clickAnimatingRef.current = true;
    lastInteractionRef.current = Date.now();

    // Top slice: quick rotation to +90°, then smooth return
    await topSliceControls.start({
      rotateY: 90,
      transition: { type: "spring", stiffness: 60, damping: 18 },
    });

    await topSliceControls.start({
      rotateY: 0,
      transition: { type: "spring", stiffness: 45, damping: 30 },
    });

    clickAnimatingRef.current = false;
  }, [mode, topSliceControls]);

  // Trigger click animation when isClicked changes to true
  useEffect(() => {
    if (isClicked) {
      handleClick();
    }
  }, [isClicked, handleClick]);


  // Mirror Block proportions (20%, 30%, 50%)
  const p = [0.2, 0.3, 0.5];
  const sizes = [size * p[0], size * p[1], size * p[2]];

  // Cubie center positions relative to cube origin
  const posX = [-size * 0.4, -size * 0.15, size * 0.25];
  const posZ = [-size * 0.4, -size * 0.15, size * 0.25];
  const posY = [size * 0.25, -size * 0.15, -size * 0.4];

  // --- Compute slice rotations ---
  let rotTop = 0;
  let rotMiddle = 0;
  let rotBottom = 0;

  if (mode === "interactive") {
    if (autoPlay) {
      // Breathing twist animation (preserved from original)
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

    // --- Section-level offsets (added to breathing) ---
    const sectionOffset = SECTION_OFFSETS[activeSection] || SECTION_OFFSETS.hero;

    // --- Project hover overrides section offsets while active ---
    if (hoveredProjectIndex !== null && hoveredProjectIndex !== undefined) {
      const projOffset =
        PROJECT_OFFSETS[hoveredProjectIndex % PROJECT_OFFSETS.length];
      rotTop += projOffset.top;
      rotMiddle += projOffset.mid;
      rotBottom += projOffset.bot;
    } else {
      rotTop += sectionOffset.top;
      rotMiddle += sectionOffset.mid;
      rotBottom += sectionOffset.bot;
    }

    // --- Idle micro-rotation on middle slice ---
    rotMiddle += idleMicroRotationRef.current;
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

  // --- Sync top slice controls with computed rotTop ---
  // (must be after rotTop computation for correct value)
  if (rotTopRef.current !== rotTop) {
    rotTopRef.current = rotTop;
    if (!clickAnimatingRef.current) {
      topSliceControls.start({
        rotateY: rotTop,
        transition:
          mode === "interactive"
            ? hoveredProjectIndex !== null
              ? { type: "spring", stiffness: 40, damping: 28 }
              : { type: "spring", stiffness: 25, damping: 35 }
            : { duration: 0.3 },
      });
    }
  }

  const faceBorderRadius = Math.max(0.5, size * 0.01);
  const stickerInset = Math.max(0.5, size * 0.014);
  const stickerBorderRadius = Math.max(0.5, size * 0.008);

  // --- Hover-enhanced chamfer and three-tier blue intensity ---
  const chamferOpacity = 0.22 + hoverIntensity * 0.2;
  const blueIntensity = 0.65 + hoverIntensity * 0.25; // 0.65 → 0.90 on hover
  const chamferHover = `rgba(255,255,255,${chamferOpacity.toFixed(3)})`;

  const brightRgb = hexToRgb(BLUE.bright);
  const primaryRgb = hexToRgb(BLUE.primary);
  const deepRgb = hexToRgb(BLUE.deep);

  const blueBright = `rgba(${brightRgb.r},${brightRgb.g},${brightRgb.b},${(blueIntensity * 0.85).toFixed(3)})`;
  const bluePrimary = `rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},${blueIntensity.toFixed(3)})`;
  const blueDeep = `rgba(${deepRgb.r},${deepRgb.g},${deepRgb.b},${(blueIntensity * 0.65).toFixed(3)})`;

  // Build edge-specific rim lighting using three-tier blue system
  // Simulates premium studio lighting on a machined object
  const getEdgeLighting = (
    i: number,
    j: number,
    k: number,
    face: string,
    active: boolean
  ) => {
    const shadows: string[] = [];

    if (active) {
      // Ambient occlusion — soft depth within each face
      shadows.push(
        `inset 0 0 ${Math.max(3, size * 0.025)}px ${MATERIALS.ambientOcclusion}`
      );

      // Top faces — blue-tinted key light rim instead of pure white
      if (
        j === 2 &&
        (face === "front" || face === "back" || face === "left" || face === "right")
      ) {
        shadows.push(`inset 0 1px 0 rgba(77,166,255,${(0.08 + hoverIntensity * 0.06).toFixed(3)})`);
      }

      // Right-column faces — deep blue side rim instead of white
      if (
        i === 2 &&
        (face === "front" || face === "back" || face === "top" || face === "bottom")
      ) {
        shadows.push(`inset -1px 0 0 rgba(31,124,255,${(0.06 + hoverIntensity * 0.05).toFixed(3)})`);
      }

      // Top-right corner cubies — brightest specular reflection (BLUE.bright)
      if (
        (i === 2 && j === 2) ||
        (i === 2 && k === 2 && face === "right") ||
        (j === 2 && k === 2 && face === "top")
      ) {
        shadows.push(`inset 0 0 ${Math.max(2, size * 0.018)}px ${blueBright}`);
      }

      // Front-right corner cubies — secondary specular (BLUE.bright, weaker)
      if ((i === 2 && k === 2 && face === "front")) {
        shadows.push(`inset 0 0 ${Math.max(1, size * 0.01)}px rgba(${brightRgb.r},${brightRgb.g},${brightRgb.b},${(0.15 + hoverIntensity * 0.15).toFixed(3)})`);
      }

      // Right column front faces — primary blue edge reflection
      if (i === 2 && face === "front") {
        shadows.push(`inset -0.5px 0 0 ${bluePrimary}`);
      }

      // Front layer bottom edge — deep blue rim
      if (k === 2 && face === "front") {
        shadows.push(`inset 0 -0.5px 0 ${blueDeep}`);
      }

      // Front layer top edge — deep blue highlight
      if (k === 2 && face === "top") {
        shadows.push(`inset 0 -0.5px 0 rgba(31,124,255,${(0.06 + hoverIntensity * 0.1).toFixed(3)})`);
      }
    } else {
      // Internal faces — deep ambient occlusion with depth pulse
      shadows.push(`inset 0 0 4px rgba(0, 0, 0, ${internalPulse.toFixed(2)})`);
    }

    return shadows.join(", ");
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
      const edgeLighting = getEdgeLighting(i, j, k, face, active);

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
            // Graphite body — clearly above #050505 background
            backgroundColor: active ? MATERIALS.body : MATERIALS.bodyInner,
            // Precision seam lines — hover-enhanced chamfer on outer, dark on inner
            border: active
              ? `0.5px solid ${chamferHover}`
              : `0.5px solid ${MATERIALS.seamRecessed}`,
            borderRadius: `${faceBorderRadius}px`,
            boxShadow: edgeLighting,
          }}
        >
          {active && (
            <div
              className={`mirror-sticker ${brushDir === "h" ? "mirror-sticker-h" : "mirror-sticker-v"
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

  // --- Hover filter style — premium clarity increase ---
  const hoverFilter =
    hoverIntensity > 0.01
      ? `contrast(${(1 + hoverIntensity * 0.2).toFixed(4)}) brightness(${(1 + hoverIntensity * 0.1).toFixed(4)})`
      : "none";

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
        // Hover-driven filter — subtle clarity increase
        filter: hoverFilter,
        transition: "filter 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Volumetric blue aura — premium studio key light */}
      <div
        className="cube-core-glow"
        style={{ width: `${size * 2}px`, height: `${size * 2}px` }}
      />

      {/* Blue rim light — top-right specular accent */}
      <div
        className="cube-rim-light"
        style={{ width: `${size * 2.4}px`, height: `${size * 2.4}px` }}
      />

      {/* Secondary blue ambient — bottom-left fill */}
      <div
        className="cube-rim-light-secondary"
        style={{ width: `${size * 2.4}px`, height: `${size * 2.4}px` }}
      />

      {/* Drop shadow — grounds the object in space */}
      <div className="cube-drop-shadow" />

      {/* 3D Rotation Container — spring-physics driven via manual lerp */}
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
              rotateX: smoothRotation.x,
              rotateY: smoothRotation.y,
            }
            : {}
        }
        transition={
          mode === "interactive"
            ? { duration: 0 }
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
          {/* TOP SLICE (j = 2) — click animation controlled */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
            }}
            animate={topSliceControls}
            initial={{ rotateY: 0 }}
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
                ? hoveredProjectIndex !== null
                  ? { type: "spring", stiffness: 40, damping: 28 }
                  : { type: "spring", stiffness: 25, damping: 35 }
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
                ? hoveredProjectIndex !== null
                  ? { type: "spring", stiffness: 40, damping: 28 }
                  : { type: "spring", stiffness: 25, damping: 35 }
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
