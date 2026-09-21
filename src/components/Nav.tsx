import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Section links are prefixed with "/" so they resolve from any page
// (e.g. /#work goes home first, then scrolls). Contact is a real page.
const navItems = [
  { label: "The Builder", href: "/#builder" },
  { label: "Work", href: "/#work" },
  { label: "Chapter", href: "/#chapter" },
  { label: "Toolkit", href: "/#tools" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock scroll when the mobile drawer is open
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
    <>
      <header className="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo">
            NIRAJ
          </a>

          {/* Desktop navigation */}
          <nav className="nav-right">
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a href="/contact" className="nav-cta">
              Book a Call
            </a>
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
            <motion.a
              href="/contact"
              onClick={closeMobileMenu}
              className="nav-mobile-cta btn btn-accent"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * navItems.length, duration: 0.3 }}
            >
              Book a Call
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}