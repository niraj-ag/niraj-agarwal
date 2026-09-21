import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MirrorCube from "./MirrorCube";
import { useCubeContext } from "./CubeController";
import { RESUME_PATH } from "../data/links";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Hero() {
  const {
    activeSection,
    hoveredProjectIndex,
    isHovered,
    isClicked,
    setIsHovered,
    triggerClick,
    gyroRotation,
    gyroAvailable,
    requestGyroPermission,
  } = useCubeContext();

  // Responsive cube size — shrink on narrow viewports so the cube and its
  // rim glows (extent = size * 2.4) never clip horizontally.
  const [cubeSize, setCubeSize] = useState(170);

  useEffect(() => {
    const computeSize = () => {
      // 48px = 24px padding each side; clamp between 120 and the desktop default
      const fitted = Math.round((window.innerWidth - 48) / 2.4);
      setCubeSize(Math.min(170, Math.max(120, fitted)));
    };
    computeSize();
    window.addEventListener("resize", computeSize);
    return () => window.removeEventListener("resize", computeSize);
  }, []);

  const handleCubeInteraction = () => {
    triggerClick();
    // iOS requires gyro permission from a user gesture — first tap triggers it
    requestGyroPermission();
  };

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={container}
      className="hero"
      id="hero"
    >
      <div className="hero-grid">
        {/* Left Side: Editorial Typography */}
        <div className="hero-content">
          <div>
            <motion.h1 variants={fadeUp} className="hero-name">
              NIRAJ
            </motion.h1>
            <motion.p variants={fadeUp} className="hero-role">
              Software Engineer
            </motion.p>
          </div>

          <motion.h2 variants={fadeUp} className="hero-tagline">
            Turning ideas into reliable digital products.
          </motion.h2>

          <motion.p variants={fadeUp} className="hero-description">
            I enjoy building products that balance engineering, usability, and
            long-term maintainability.
          </motion.p>

          <motion.div variants={fadeUp} className="hero-cta-group">
            <a href="/contact" className="btn btn-accent">
              Book a Call
            </a>
            <a href="#work" className="btn btn-ghost">
              Explore My Work
            </a>
          </motion.div>
          
        </div>

        {/* Right Side: The Rubik's Cube — with interaction awareness */}
        <div
          className="hero-cube-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleCubeInteraction}
          onTouchStart={requestGyroPermission}
          style={{ pointerEvents: "auto", cursor: "default" }}
        >
          <motion.div variants={fadeUp}>
            <MirrorCube
              size={cubeSize}
              mode="interactive"
              className="animate-float"
              activeSection={activeSection}
              hoveredProjectIndex={hoveredProjectIndex}
              isHovered={isHovered}
              isClicked={isClicked}
              gyroRotation={gyroRotation}
              gyroAvailable={gyroAvailable}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
