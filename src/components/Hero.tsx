import { motion } from "framer-motion";
import MirrorCube from "./MirrorCube";

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
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={container}
      className="hero"
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
            <a href="#work" className="btn btn-primary">
              Explore My Work
            </a>
            <a href="/resume.pdf" download className="btn btn-ghost">
              Resume
            </a>
          </motion.div>
        </div>

        {/* Right Side: The Rubik's Cube */}
        <div className="hero-cube-wrapper">
          <motion.div variants={fadeUp}>
            <MirrorCube
              size={170}
              mode="interactive"
              className="animate-float"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
