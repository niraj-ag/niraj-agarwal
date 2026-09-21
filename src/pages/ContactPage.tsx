import { useEffect } from "react";
import { motion } from "framer-motion";
import Nav from "../components/Nav";
import CursorSpotlight from "../components/CursorSpotlight";
import Footer from "../components/Footer";
import CalEmbed from "../components/CalEmbed";
import {
  EMAIL_HREF,
  GITHUB_URL,
  LINKEDIN_URL,
  RESUME_PATH,
} from "../data/links";

const PAGE_TITLE = "Book a Call — Niraj";

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
      staggerChildren: 0.12,
    },
  },
};

export default function ContactPage() {
  useEffect(() => {
    document.title = PAGE_TITLE;
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="page-shell">
      <CursorSpotlight />
      <Nav />

      <div className="container contact-page">
        {/* Intro */}
        <motion.div
          className="contact-page-intro"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={container}
        >
          <motion.span variants={fadeUp} className="section-label">
            What's Next
          </motion.span>
          <motion.h1 variants={fadeUp} className="contact-page-title">
            Let's Build
          </motion.h1>
          <motion.p variants={fadeUp} className="contact-page-description">
            Open to opportunities, interesting problems, and conversations about
            products worth building. Pick a time that suits you — every call is
            a video meeting, zero phone numbers, zero commitment.
          </motion.p>
          <motion.div variants={fadeUp} className="contact-page-links">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="contact-link"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                download={link.label === "Resume" ? true : undefined}
              >
                {link.label}
                <span className="contact-link-arrow">↗</span>
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scheduler — the full cal.com/niraj-ag embed */}
        <motion.section
          className="contact-scheduler"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={container}
        >
          <motion.header variants={fadeUp} className="contact-scheduler-header">
            <div>
              <motion.span variants={fadeUp} className="section-label">
                Availability
              </motion.span>
              <motion.h2 variants={fadeUp} className="contact-scheduler-title">
                Pick the call that fits
              </motion.h2>
              <motion.p variants={fadeUp} className="contact-scheduler-sub">
                Intro, deep-dive, or project discovery — book straight on my
                calendar. No emailing back and forth.
              </motion.p>
            </div>
            <span className="contact-calendar-badge">Video · 15–45 min</span>
          </motion.header>

          <motion.div variants={fadeUp} className="contact-scheduler-card">
            <CalEmbed />
          </motion.div>

          <motion.p variants={fadeUp} className="contact-scheduler-note">
            Prefer async? Email or LinkedIn works too — I reply within a day.
          </motion.p>
        </motion.section>

        <a href="/" className="contact-page-back">
          ← Back to portfolio
        </a>
      </div>

      <Footer />
    </main>
  );
}