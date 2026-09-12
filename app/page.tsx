'use client';
// app/page.tsx — Life RPG Premium Landing Page
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './home.css';

/* ═══════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ═══════════════════════════════
   DATA
   ═══════════════════════════════ */
const STATS = [
  { value: '10K+', label: 'Quests Completed', icon: '⚔️' },
  { value: '5K+',  label: 'Heroes Joined',    icon: '🧙' },
  { value: '50K+', label: 'XP Awarded',       icon: '✨' },
  { value: '99%',  label: 'Survival Rate',    icon: '🛡️' },
];

const FEATURES = [
  { icon: '⚔️', title: 'Quest System',          desc: 'Transform any real-world goal into an epic quest. Assign difficulty, pick your category, and earn XP when you conquer it.' },
  { icon: '📈', title: 'Character Growth',       desc: 'Level up across five core attributes — Intellect, Strength, Wisdom, Creativity, and Endurance.' },
  { icon: '🏪', title: 'Reward Shop',            desc: 'Spend hard-earned gold on themes, cosmetics, and power-ups. Make the realm truly yours.' },
  { icon: '🔥', title: 'Streak Multipliers',     desc: 'Build daily streaks to unlock XP multipliers. Consistency is rewarded.' },
  { icon: '📜', title: 'Adventure History',      desc: 'Review past victories, analyze growth trends, and relive your greatest achievements.' },
  { icon: '🎒', title: 'Inventory & Gear',       desc: 'Collect trophies, equipment, and rare items. Equip what suits your playstyle.' },
];

const STEPS = [
  { num: '01', title: 'Choose Your Class',     desc: 'Pick from Warrior, Mage, Rogue, or Sage — each offers a unique lens through which to approach your daily challenges.' },
  { num: '02', title: 'Create Your Quests',    desc: 'Turn daily habits, goals, and tasks into quests. Set difficulty and category to earn the right kind of XP.' },
  { num: '03', title: 'Complete & Level Up',   desc: 'Mark quests done in real life, then claim your XP and Gold. Watch your character evolve with every victory.' },
  { num: '04', title: 'Spend & Customize',     desc: 'Visit the shop to invest your gold into cosmetics, themes, and items that reflect your legend.' },
];

const CLASSES = [
  { emoji: '⚔️', name: 'Warrior', sub: 'Strength · Discipline',  color: '#e05555', glow: 'rgba(224,85,85,0.25)' },
  { emoji: '🔮', name: 'Mage',    sub: 'Intellect · Wisdom',     color: '#9d82e0', glow: 'rgba(157,130,224,0.25)' },
  { emoji: '🗡️', name: 'Rogue',   sub: 'Speed · Creativity',     color: '#55d0a0', glow: 'rgba(85,208,160,0.25)' },
  { emoji: '📜', name: 'Sage',    sub: 'Balance · Endurance',    color: '#f0c060', glow: 'rgba(240,192,96,0.25)' },
];

const FAQS = [
  { q: 'What is Life RPG?', a: 'Life RPG is a gamified productivity platform that turns your real-world tasks, habits, and goals into an RPG adventure. Complete quests, earn XP, level up your character, and buy rewards with gold.' },
  { q: 'Is it free to use?', a: 'Yes! Life RPG is completely free. Create your character, complete quests, and earn rewards without any cost. Premium cosmetic items may arrive in the future.' },
  { q: 'How does the quest system work?', a: 'Create quests from your real tasks — "Read for 30 minutes", "Go for a run." Assign difficulty and category. Complete the task in real life, then claim your XP and Gold.' },
  { q: 'Can I use it with a team?', a: 'Team features are in development. Soon you\'ll form parties, share quests, and compete on leaderboards with friends.' },
  { q: 'What if I break my streak?', a: 'Your streak resets, but your character progress, level, and gold are never lost. Streaks multiply XP — they reward consistency, never punish you permanently.' },
];

/* ═══════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════ */
function Section({ children, id, className }: { children: React.ReactNode; id?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} id={id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="hp-faq-item">
      <button className="hp-faq-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{q}</span>
        <span className={`hp-faq-icon${open ? ' open' : ''}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
            <p className="hp-faq-answer">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════ */
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 50), []);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  function scrollTo(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="hp-page">
      {/* ── Decorative background orbs ── */}
      <div className="hp-orb hp-orb-1" aria-hidden />
      <div className="hp-orb hp-orb-2" aria-hidden />
      <div className="hp-orb hp-orb-3" aria-hidden />
      <div className="hp-grid-overlay" aria-hidden />

      {/* ══════════════════ NAVBAR ══════════════════ */}
      <nav className={`hp-nav${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <a href="#" className="hp-nav-logo" aria-label="Life RPG home">
          <span className="hp-nav-logo-icon">⚔️</span>
          <span>Life RPG</span>
        </a>

        <button className="hp-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          <span /><span /><span />
        </button>

        <ul className={`hp-nav-links${menuOpen ? ' open' : ''}`} role="list">
          {['features', 'how-it-works', 'classes', 'faq'].map((id) => (
            <li key={id}>
              <button className="hp-nav-link" onClick={() => scrollTo(id)} id={`nav-${id}`}>
                {id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            </li>
          ))}
          <li><Link href="/login" className="hp-nav-ghost" id="nav-login">Sign In</Link></li>
          <li><Link href="/signup" className="hp-nav-cta" id="nav-signup">Start for Free</Link></li>
        </ul>
      </nav>

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="hp-hero" ref={heroRef}>
        <motion.div className="hp-hero-inner" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="hp-hero-badge">🎮 Your Life. Your Legend.</div>
          </motion.div>

          <motion.h1 className="hp-hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            Turn Every Task Into<br />
            <span className="hp-hero-gradient">An Epic Quest</span>
          </motion.h1>

          <motion.p className="hp-hero-desc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
            Life RPG transforms your daily habits, goals, and tasks into a thrilling RPG adventure.
            Build your character, earn XP, collect gold, and level up — one real-world quest at a time.
          </motion.p>

          <motion.div className="hp-hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
            <Link href="/signup" className="hp-btn-primary" id="hero-cta-start">
              <span>Begin Your Adventure</span>
              <span aria-hidden>→</span>
            </Link>
            <Link href="/login" className="hp-btn-ghost" id="hero-cta-login">
              I Already Have an Account
            </Link>
          </motion.div>

          <motion.div className="hp-hero-social-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }}>
            <div className="hp-avatars" aria-hidden>
              {['⚔️', '🔮', '🗡️', '📜', '🧙'].map((e, i) => (
                <div key={i} className="hp-avatar">{e}</div>
              ))}
            </div>
            <p><strong>5,000+ heroes</strong> have already joined the realm</p>
          </motion.div>
        </motion.div>

        {/* Animated hero card mockup */}
        <motion.div
          className="hp-hero-card"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          <div className="hp-hero-card-header">
            <span className="hp-hero-card-dot red" /><span className="hp-hero-card-dot yellow" /><span className="hp-hero-card-dot green" />
            <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--hp-text-dim)' }}>Character Panel</span>
          </div>
          <div className="hp-hero-card-body">
            <div className="hp-card-avatar">🧙</div>
            <div className="hp-card-name">Jinendra</div>
            <div className="hp-card-class">Mage · Level 12</div>
            <div className="hp-xp-section">
              <div className="hp-xp-label"><span>XP</span><span>2400 / 3000</span></div>
              <div className="hp-xp-track"><motion.div className="hp-xp-fill" initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ delay: 1.2, duration: 1.2, ease: 'easeOut' }} /></div>
            </div>
            <div className="hp-card-stats">
              {[['INT', '9', '#9d82e0'], ['STR', '4', '#e05555'], ['WIS', '8', '#55d0a0'], ['CRE', '7', '#f0c060']].map(([label, val, color]) => (
                <div key={label} className="hp-card-stat" style={{ '--stat-color': color } as React.CSSProperties}>
                  <div className="hp-card-stat-val">{val}</div>
                  <div className="hp-card-stat-label">{label}</div>
                </div>
              ))}
            </div>
            <div className="hp-card-quests">
              {[
                { t: 'Read 30 mins', d: 'EASY', done: true },
                { t: 'Workout session', d: 'HARD', done: true },
                { t: 'Learn Next.js', d: 'MEDIUM', done: false },
              ].map(q => (
                <div key={q.t} className={`hp-quest-row${q.done ? ' done' : ''}`}>
                  <span className="hp-quest-check">{q.done ? '✓' : '○'}</span>
                  <span className="hp-quest-title">{q.t}</span>
                  <span className={`hp-quest-diff ${q.d.toLowerCase()}`}>{q.d}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* scroll caret */}
        <motion.div className="hp-scroll-caret" initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }} transition={{ delay: 2, duration: 2, repeat: Infinity }} aria-hidden>↓</motion.div>
      </section>

      {/* ══════════════════ STATS ══════════════════ */}
      <Section className="hp-stats-bar">
        {STATS.map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} custom={i} className="hp-stat">
            <span className="hp-stat-icon" aria-hidden>{s.icon}</span>
            <div className="hp-stat-val">{s.value}</div>
            <div className="hp-stat-label">{s.label}</div>
          </motion.div>
        ))}
      </Section>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <Section id="features" className="hp-section">
        <div className="hp-section-label-row">
          <motion.span variants={fadeUp} custom={0} className="hp-label-chip">Features</motion.span>
        </div>
        <motion.h2 variants={fadeUp} custom={1} className="hp-section-title">Everything You Need to Level Up</motion.h2>
        <motion.p variants={fadeUp} custom={2} className="hp-section-desc">
          A complete RPG system built around your real life. Every feature is designed to make productivity feel rewarding and addictive.
        </motion.p>
        <div className="hp-features-grid">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} custom={i} className="hp-feature-card">
              <div className="hp-feature-icon" aria-hidden>{f.icon}</div>
              <h3 className="hp-feature-title">{f.title}</h3>
              <p className="hp-feature-desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <Section id="how-it-works" className="hp-section hp-section-alt">
        <div className="hp-section-label-row">
          <motion.span variants={fadeUp} custom={0} className="hp-label-chip">How It Works</motion.span>
        </div>
        <motion.h2 variants={fadeUp} custom={1} className="hp-section-title">Four Steps to Your Legend</motion.h2>
        <motion.p variants={fadeUp} custom={2} className="hp-section-desc">Simple to start. Deeply satisfying to master.</motion.p>

        <div className="hp-steps">
          {STEPS.map((s, i) => (
            <motion.div key={s.num} variants={fadeUp} custom={i} className="hp-step">
              <div className="hp-step-num">{s.num}</div>
              <div className="hp-step-line" aria-hidden />
              <div className="hp-step-content">
                <h3 className="hp-step-title">{s.title}</h3>
                <p className="hp-step-desc">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ══════════════════ CLASSES ══════════════════ */}
      <Section id="classes" className="hp-section">
        <div className="hp-section-label-row">
          <motion.span variants={fadeUp} custom={0} className="hp-label-chip">Choose Your Path</motion.span>
        </div>
        <motion.h2 variants={fadeUp} custom={1} className="hp-section-title">Character Classes</motion.h2>
        <motion.p variants={fadeUp} custom={2} className="hp-section-desc">Each class shapes how you approach quests. Pick the path that fits your playstyle.</motion.p>

        <div className="hp-classes-grid">
          {CLASSES.map((cls, i) => (
            <motion.div key={cls.name} variants={fadeUp} custom={i} className="hp-class-card" style={{ '--cls-color': cls.color, '--cls-glow': cls.glow } as React.CSSProperties}>
              <div className="hp-class-emoji" aria-hidden>{cls.emoji}</div>
              <h3 className="hp-class-name">{cls.name}</h3>
              <p className="hp-class-sub">{cls.sub}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <Section id="faq" className="hp-section hp-section-alt">
        <div className="hp-section-label-row">
          <motion.span variants={fadeUp} custom={0} className="hp-label-chip">FAQ</motion.span>
        </div>
        <motion.h2 variants={fadeUp} custom={1} className="hp-section-title">Frequently Asked Questions</motion.h2>
        <motion.div variants={fadeUp} custom={2} className="hp-faq-list">
          {FAQS.map(f => <FAQItem key={f.q} {...f} />)}
        </motion.div>
      </Section>

      {/* ══════════════════ FINAL CTA ══════════════════ */}
      <Section className="hp-cta-section">
        <div className="hp-cta-glow" aria-hidden />
        <motion.div variants={fadeUp} custom={0} className="hp-cta-badge">⚔️ Your Quest Awaits</motion.div>
        <motion.h2 variants={fadeUp} custom={1} className="hp-cta-title">Ready to Begin Your Adventure?</motion.h2>
        <motion.p variants={fadeUp} custom={2} className="hp-cta-desc">
          Join thousands of heroes who have turned their daily grind into an epic journey. Your character is waiting to be created.
        </motion.p>
        <motion.div variants={fadeUp} custom={3} className="hp-cta-actions">
          <Link href="/signup" className="hp-btn-primary" id="cta-final-signup">Create Your Character</Link>
          <Link href="/login" className="hp-btn-ghost" id="cta-final-login">I Already Have an Account</Link>
        </motion.div>
      </Section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <div className="hp-footer-top">
            <div className="hp-footer-brand">
              <span className="hp-footer-logo">⚔️ Life RPG</span>
              <p className="hp-footer-about">A gamified productivity platform that transforms your real-world tasks into an RPG adventure. Built by Team Namaste.</p>
            </div>
            <div className="hp-footer-links-col">
              <h4>Product</h4>
              <ul>
                {['features', 'how-it-works', 'classes', 'faq'].map(id => (
                  <li key={id}><button onClick={() => scrollTo(id)} id={`footer-${id}`}>{id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</button></li>
                ))}
              </ul>
            </div>
            <div className="hp-footer-links-col">
              <h4>Account</h4>
              <ul>
                <li><Link href="/login">Sign In</Link></li>
                <li><Link href="/signup">Create Character</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
            <div className="hp-footer-links-col">
              <h4>Links</h4>
              <ul>
                <li><a href="https://github.com/jinendrabanthia/TEAM-NAMASTE" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href="https://github.com/jinendrabanthia/TEAM-NAMASTE/issues" target="_blank" rel="noopener noreferrer">Report a Bug</a></li>
              </ul>
            </div>
          </div>
          <div className="hp-footer-bottom">
            <span>© {new Date().getFullYear()} Life RPG — All rights reserved.</span>
            <span>Built with ❤️ by Team Namaste</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
