import { motion } from "framer-motion";

const interests = [
  {
    title: "Football",
    text: "The game teaches systems thinking, spatial awareness, and how to perform under pressure. Every match is a lesson in teamwork and real-time decision-making.",
  },
  {
    title: "Gaming & Esports",
    text: "Competitive strategy, quick decision-making, and understanding complex systems. The intersection of skill, game theory, and execution — applied at speed.",
  },
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

export default function BeyondScreen() {
  return (
    <section id="beyond" className="section">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={container}
      >
        <motion.span variants={fadeUp} className="section-label">
          Off The Clock
        </motion.span>
        <motion.h2 variants={fadeUp} className="section-title">
          Beyond The Screen
        </motion.h2>
        <motion.p variants={fadeUp} className="section-description">
          Software is what I do. It's not all of who I am.
        </motion.p>

        <div className="beyond-grid">
          {interests.map((item) => (
            <motion.div key={item.title} variants={fadeUp} className="beyond-card">
              <h3 className="beyond-card-title">{item.title}</h3>
              <p className="beyond-card-text">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
