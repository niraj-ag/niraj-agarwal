import { motion } from "framer-motion";
import {
  EMAIL_HREF,
  GITHUB_URL,
  LINKEDIN_URL,
  RESUME_PATH,
} from "../data/links";

const links = [
  { label: "GitHub", href: GITHUB_URL },
  { label: "LinkedIn", href: LINKEDIN_URL },
  { label: "Email", href: EMAIL_HREF },
  { label: "Resume", href: RESUME_PATH },
];

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

/* Homepage closing section — points visitors at the /contact booking page. */
export default function Contact() {
  return (
    <section id="contact" className="section">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={container}
      >
        <motion.span variants={fadeUp} className="section-label">
          What's Next
        </motion.span>
        <motion.h2 variants={fadeUp} className="section-title">
          Let's Build
        </motion.h2>
        <motion.p variants={fadeUp} className="section-description">
          Open to opportunities, interesting problems, and conversations about
          products worth building.
        </motion.p>

        <motion.div variants={fadeUp} className="contact-primary">
          <a href="/contact" className="btn btn-accent">
            Book a Call
          </a>
          <p className="contact-note">
            A 15-minute video call — no strings. We'll figure out if there's a
            fit, then take it from there.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="contact-links">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="contact-link"
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              download={link.label === "Resume" ? true : undefined}
            >
              {link.label}
              <span className="contact-link-arrow">↗</span>
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}