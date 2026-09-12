'use client';
// app/page.tsx — Stranger Things horror landing page (full version)
import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import './home.css';

/* ═══════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardPop = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

/* ═══════════════════════════════
   DATA
   ═══════════════════════════════ */
const STATS = [
  { value: '10K+', label: 'Quests Created' },
  { value: '5K+', label: 'Heroes Joined' },
  { value: '50K+', label: 'XP Earned' },
  { value: '99%', label: 'Survival Rate' },
];

const FEATURES = [
  {
    icon: '⚔️',
    title: 'Quest System',
    desc: 'Create custom quests from your real-world goals. Assign difficulty, category, and XP rewards. Track progress as you conquer each challenge.',
  },
  {
    icon: '📊',
    title: 'Character Progression',
    desc: 'Level up across five core attributes — Intellect, Strength, Wisdom, Creativity, and Endurance. Watch your character grow with every completed task.',
  },
  {
    icon: '🏪',
    title: 'Reward Shop',
    desc: 'Spend hard-earned gold on themes, cosmetics, and power-ups. Customize your experience with items unlocked through dedication.',
  },
  {
    icon: '🔥',
    title: 'Streak Tracking',
    desc: 'Build daily streaks to earn bonus multipliers. Consistency is rewarded — break the chain and face the consequences.',
  },
  {
    icon: '📜',
    title: 'Quest History',
    desc: 'Review your completed adventures. Analyze your patterns, track attribute growth over time, and revisit your greatest victories.',
  },
  {
    icon: '🎒',
    title: 'Inventory System',
    desc: 'Collect items, equipment, and trophies. Manage your inventory and equip gear that matches your playstyle.',
  },
];

const STEPS = [
  {
    title: 'Create Your Character',
    desc: 'Sign up and choose your class — Warrior, Mage, Rogue, or Sage. Each path offers unique strengths for different play styles.',
  },
  {
    title: 'Accept Quests',
    desc: 'Turn your daily tasks, habits, and goals into quests. Set difficulty levels and assign attribute categories to earn targeted XP.',
  },
  {
    title: 'Complete & Level Up',
    desc: 'Mark quests as complete to earn XP and Gold. Level up your character, unlock new abilities, and climb the leaderboard.',
  },
  {
    title: 'Spend & Customize',
    desc: 'Visit the shop to spend your gold on themes, items, and cosmetics. Make the realm truly yours.',
  },
];

const CLASSES = [
  { emoji: '⚔️', name: 'Warrior', desc: 'Strength & discipline' },
  { emoji: '🔮', name: 'Mage', desc: 'Intellect & wisdom' },
  { emoji: '🗡️', name: 'Rogue', desc: 'Speed & creativity' },
  { emoji: '📜', name: 'Sage', desc: 'Balance & endurance' },
];

const FAQS = [
  {
    q: 'What is Life RPG?',
    a: 'Life RPG is a gamified productivity platform that transforms your real-world tasks, habits, and goals into an RPG adventure. Complete quests, earn XP, level up your character, and buy rewards with gold — all by doing things that matter in your real life.',
  },
  {
    q: 'Is it free to use?',
    a: 'Yes! Life RPG is completely free. Create your character, complete quests, and earn rewards without any cost. Premium cosmetic items may be available in the future.',
  },
  {
    q: 'How does the quest system work?',
    a: 'You create quests from your real tasks — like "Read for 30 minutes" or "Go for a run." Assign a difficulty (Easy, Medium, Hard) and a category (Intellect, Strength, Wisdom, Creativity, Endurance). When you complete the task in real life, mark it done to earn XP and Gold.',
  },
  {
    q: 'Can I use it with a team?',
    a: 'Team features are being developed. Soon you will be able to form parties, share quests, and compete on leaderboards with friends.',
  },
  {
    q: 'What happens if I break my streak?',
    a: 'Your streak counter resets, but your character progress, level, and gold are never lost. Streaks provide bonus multipliers — they reward consistency but don\'t punish you permanently.',
  },
];

/* ═══════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════ */
function RevealSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="horror-faq-item">
      <button
        className="horror-faq-question"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {q}
        <span className={`horror-faq-chevron${open ? ' open' : ''}`}>▼</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="horror-faq-answer">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════ */
export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  function scrollTo(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="horror-page">
      {/* ── Ambient layers ── */}
      <div className="horror-scanlines" aria-hidden="true" />
      <div className="horror-fog" aria-hidden="true">
        <div className="fog-particle" />
        <div className="fog-particle" />
        <div className="fog-particle" />
        <div className="fog-particle" />
      </div>
      <div className="horror-embers" aria-hidden="true">
        <div className="ember" />
        <div className="ember" />
        <div className="ember" />
        <div className="ember" />
        <div className="ember" />
        <div className="ember" />
      </div>

      {/* ═══════════ NAVBAR ═══════════ */}
      <nav className={`horror-nav${scrolled ? ' scrolled' : ''}`}>
        <a href="#" className="horror-nav-logo">Life RPG</a>

        <button
          className="horror-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`horror-nav-links${menuOpen ? ' open' : ''}`}>
          <li><button className="horror-nav-link" onClick={() => scrollTo('features')}>Features</button></li>
          <li><button className="horror-nav-link" onClick={() => scrollTo('how-it-works')}>How It Works</button></li>
          <li><button className="horror-nav-link" onClick={() => scrollTo('classes')}>Classes</button></li>
          <li><button className="horror-nav-link" onClick={() => scrollTo('faq')}>FAQ</button></li>
          <li><Link href="/login" className="horror-nav-cta">Enter Realm</Link></li>
        </ul>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="horror-hero">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="horror-title">LIFE RPG</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="horror-divider" />
        </motion.div>

        <motion.p
          className="horror-subtitle"
          data-text="Gamify Your Reality"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Gamify Your Reality
        </motion.p>

        <motion.p
          className="horror-hero-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          Transform your daily tasks into epic quests. Build your character, level up your attributes,
          earn gold, and conquer the challenges of the real world — one quest at a time.
        </motion.p>

        <motion.div
          className="horror-hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <Link href="/signup" className="horror-cta" id="hero-cta-signup">
            Create Character
          </Link>
          <Link href="/login" className="horror-cta-ghost" id="hero-cta-login">
            Sign In
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4, y: [0, 8, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: 40, fontSize: 22, color: 'var(--horror-text-dim)' }}
          aria-hidden="true"
        >
          ▼
        </motion.div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <RevealSection className="horror-stats">
        <div className="horror-stats-grid">
          {STATS.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} style={{ textAlign: 'center' }}>
              <div className="horror-stat-number">{s.value}</div>
              <div className="horror-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* ═══════════ FEATURES ═══════════ */}
      <RevealSection className="horror-section" id="features">
        <div className="horror-section-header">
          <motion.span variants={fadeUp} custom={0} className="horror-section-label">
            Features
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="horror-section-title">
            Everything You Need to Level Up
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="horror-section-desc">
            A complete RPG system built around your real life. Every feature is designed to make
            productivity feel rewarding and addictive.
          </motion.p>
        </div>

        <div className="horror-features-grid">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} variants={cardPop} custom={i} className="horror-feature-card">
              <div className="horror-feature-icon" aria-hidden="true">{f.icon}</div>
              <h3 className="horror-feature-title">{f.title}</h3>
              <p className="horror-feature-desc">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <RevealSection className="horror-section" id="how-it-works">
        <div className="horror-section-header">
          <motion.span variants={fadeUp} custom={0} className="horror-section-label">
            How It Works
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="horror-section-title">
            Your Journey Begins Here
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="horror-section-desc">
            Four simple steps to transform your everyday routine into an RPG adventure.
          </motion.p>
        </div>

        <div className="horror-steps">
          {STEPS.map((step, i) => (
            <motion.div key={step.title} variants={fadeUp} custom={i} className="horror-step">
              <div className="horror-step-number">{i + 1}</div>
              <div className="horror-step-content">
                <h3 className="horror-step-title">{step.title}</h3>
                <p className="horror-step-desc">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* ═══════════ CHARACTER CLASSES ═══════════ */}
      <RevealSection className="horror-section" id="classes">
        <div className="horror-section-header">
          <motion.span variants={fadeUp} custom={0} className="horror-section-label">
            Choose Your Path
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="horror-section-title">
            Character Classes
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="horror-section-desc">
            Each class shapes how you approach quests. Pick the path that fits your playstyle.
          </motion.p>
        </div>

        <div className="horror-classes-grid">
          {CLASSES.map((cls, i) => (
            <motion.div key={cls.name} variants={cardPop} custom={i} className="horror-class-card">
              <span className="horror-class-emoji" aria-hidden="true">{cls.emoji}</span>
              <h3 className="horror-class-name">{cls.name}</h3>
              <p className="horror-class-desc">{cls.desc}</p>
            </motion.div>
          ))}
        </div>
      </RevealSection>

      {/* ═══════════ FAQ ═══════════ */}
      <RevealSection className="horror-section" id="faq">
        <div className="horror-section-header">
          <motion.span variants={fadeUp} custom={0} className="horror-section-label">
            FAQ
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="horror-section-title">
            Frequently Asked Questions
          </motion.h2>
        </div>

        <motion.div variants={fadeUp} custom={2} className="horror-faq-list">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </motion.div>
      </RevealSection>

      {/* ═══════════ PORTAL CTA ═══════════ */}
      <RevealSection className="horror-portal-section">
        <motion.div variants={fadeUp} custom={0} className="horror-portal-wrapper">
          <div className="horror-portal-ring" />
          <div className="horror-portal-ring-inner" />
          <div className="horror-portal-glow" />
          <span
            style={{
              position: 'relative',
              zIndex: 1,
              fontSize: 44,
              filter: 'drop-shadow(0 0 12px rgba(224, 0, 32, 0.5))',
            }}
            aria-hidden="true"
          >
            🌀
          </span>
        </motion.div>

        <motion.h2 variants={fadeUp} custom={1} className="horror-portal-heading">
          Ready to Begin Your Adventure?
        </motion.h2>

        <motion.p variants={fadeUp} custom={2} className="horror-portal-tagline">
          Join thousands of heroes who have turned their daily grind into an epic journey.
          Your character is waiting to be created.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={3}
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href="/signup" className="horror-cta" id="portal-cta-signup">
            Create Your Character
          </Link>
          <Link href="/login" className="horror-cta-ghost" id="portal-cta-login">
            I Already Have an Account
          </Link>
        </motion.div>
      </RevealSection>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="horror-footer">
        <div className="horror-footer-inner">
          <div className="horror-footer-grid">
            <div>
              <div className="horror-footer-brand">Life RPG</div>
              <p className="horror-footer-about">
                A gamified productivity platform that transforms your real-world tasks into an RPG
                adventure. Built by Team Namaste.
              </p>
            </div>

            <div>
              <h4 className="horror-footer-col-title">Product</h4>
              <ul className="horror-footer-links">
                <li><button className="horror-footer-link" onClick={() => scrollTo('features')}>Features</button></li>
                <li><button className="horror-footer-link" onClick={() => scrollTo('how-it-works')}>How It Works</button></li>
                <li><button className="horror-footer-link" onClick={() => scrollTo('classes')}>Classes</button></li>
                <li><button className="horror-footer-link" onClick={() => scrollTo('faq')}>FAQ</button></li>
              </ul>
            </div>

            <div>
              <h4 className="horror-footer-col-title">Account</h4>
              <ul className="horror-footer-links">
                <li><Link href="/login" className="horror-footer-link">Sign In</Link></li>
                <li><Link href="/signup" className="horror-footer-link">Create Character</Link></li>
                <li><Link href="/dashboard" className="horror-footer-link">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="horror-footer-col-title">Resources</h4>
              <ul className="horror-footer-links">
                <li><a href="https://github.com/jinendrabanthia/TEAM-NAMASTE" target="_blank" rel="noopener noreferrer" className="horror-footer-link">GitHub</a></li>
                <li><a href="https://github.com/jinendrabanthia/TEAM-NAMASTE/issues" target="_blank" rel="noopener noreferrer" className="horror-footer-link">Report a Bug</a></li>
              </ul>
            </div>
          </div>

          <div className="horror-footer-bottom">
            <span>&copy; {new Date().getFullYear()} Life RPG — All souls reserved.</span>
            <span>Built by Team Namaste</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
