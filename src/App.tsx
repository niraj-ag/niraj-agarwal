import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "./components/Hero";
import Builder from "./components/Builder";
import Work from "./sections/Work";
import Timeline from "./components/Timeline";
import TechStack from "./components/TechStack";
import BeyondScreen from "./components/BeyondScreen";
import Contact from "./components/Contact";

const navItems = [
  { label: "The Builder", href: "#builder" },
  { label: "Work", href: "#work" },
  { label: "Chapter", href: "#chapter" },
  { label: "Toolkit", href: "#tools" },
  { label: "Contact", href: "#contact" },
];

export default function App() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <main
      style={{
        position: "relative",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-body)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Cursor Spotlight */}
      <div
        className="cursor-spotlight"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(100, 255, 218, 0.015), transparent 80%)`,
        }}
      />

      {/* Navigation */}
      <header className="nav">
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            NIRAJ
          </a>

          {/* Desktop navigation */}
          <nav>
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile toggle */}
          <button
            className={`nav-mobile-toggle ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="nav-mobile-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav>
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="nav-link"
                  onClick={closeMobileMenu}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.75rem 0",
                  }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <Hero />
        <hr className="section-divider" />
        <Builder />
        <hr className="section-divider" />
        <Work />
        <hr className="section-divider" />
        <Timeline />
        <hr className="section-divider" />
        <TechStack />
        <hr className="section-divider" />
        <BeyondScreen />
        <hr className="section-divider" />
        <Contact />
      </div>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          Designed & built by Niraj — {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}