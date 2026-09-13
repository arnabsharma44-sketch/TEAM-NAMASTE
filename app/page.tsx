'use client';
// app/page.tsx — Hellfire Quests Landing Page (Full + Interactive Splash)
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import './home.css';

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
  { icon: '⚔️', title: 'Quest System', desc: 'Create custom quests from your real-world goals. Assign difficulty, category, and XP rewards. Track progress as you conquer each challenge.' },
  { icon: '📊', title: 'Character Progression', desc: 'Level up across five core attributes — Intellect, Strength, Wisdom, Creativity, and Endurance. Watch your character grow with every completed task.' },
  { icon: '🏪', title: 'Reward Shop', desc: 'Spend hard-earned gold on themes, cosmetics, and power-ups. Customize your experience with items unlocked through dedication.' },
];

/* ═══════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════ */
export default function HomePage() {
  const [hasEntered, setHasEntered] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [spores, setSpores] = useState<{ id: number; left: string; delay: string; duration: string; size: string }[]>([]);

  useEffect(() => {
    const newSpores = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `-${Math.random() * 20}s`,
      duration: `${10 + Math.random() * 15}s`,
      size: `${2 + Math.random() * 6}px`
    }));
    setSpores(newSpores);
  }, []);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleEnter = () => {
    if (glitching || hasEntered) return;
    setGlitching(true);
    setTimeout(() => {
      setHasEntered(true);
      // Let user scroll freely after animation
      document.body.style.overflow = 'auto';
    }, 800);
  };

  // Initially prevent scrolling until they enter
  useEffect(() => {
    if (!hasEntered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [hasEntered]);

  return (
    <div className="horror-page">
      {/* ═══════════ INTERACTIVE BACKGROUND LAYERS ═══════════ */}
      <div className="splash-bg-container">
        <div className={`bg-layer bg-vecna ${hasEntered ? 'is-clear' : 'is-blurred'}`} aria-hidden="true" />
        <div className={`bg-layer bg-mindflayer ${hasEntered ? 'is-clear' : 'is-blurred'}`} aria-hidden="true" />
        <div className={`lightning-flash ${hasEntered ? 'is-active' : ''}`} aria-hidden="true" />
        
        <div className="spores-container" aria-hidden="true">
          {spores.map((spore) => (
            <div 
              key={spore.id} 
              className="spore"
              style={{
                left: spore.left,
                animationDelay: spore.delay,
                animationDuration: spore.duration,
                width: spore.size,
                height: spore.size
              }}
            />
          ))}
        </div>
      </div>

      {/* ═══════════ NAVBAR (Appears after enter) ═══════════ */}
      <nav className={`horror-nav ${hasEntered ? 'is-visible' : ''} ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="horror-nav-logo">Hellfire Quests</a>
        <ul className="horror-nav-links">
          <li><Link href="/login" className="horror-nav-cta">Sign In</Link></li>
        </ul>
      </nav>

      {/* ═══════════ HERO / SPLASH ═══════════ */}
      <section className="horror-hero">
        {!hasEntered && (
          <div className={glitching ? 'glitch-out' : ''}>
            <h1 className="splash-title">HELLFIRE<br/>QUESTS</h1>
            <button 
              className="splash-btn"
              onClick={handleEnter}
              disabled={glitching}
            >
              Enter The Upside Down
            </button>
          </div>
        )}

        {/* Revealed Hero Content */}
        <div className={`hero-content-delayed ${hasEntered ? 'is-visible' : ''}`}>
          <h2 style={{ fontFamily: 'Cinzel', fontSize: '36px', color: '#fff', textShadow: '0 0 20px #e00020' }}>
            Gamify Your Reality
          </h2>
          <p className="horror-hero-desc" style={{ marginTop: '16px' }}>
            Transform your daily tasks into epic quests. Build your character, level up your attributes,
            earn gold, and conquer the challenges of the real world.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/signup" className="splash-btn" style={{ padding: '12px 32px', fontSize: '14px' }}>
              Create Character
            </Link>
          </div>
        </div>

        <div className={`scroll-indicator ${hasEntered ? 'is-visible' : ''}`}>▼</div>
      </section>

      {/* ═══════════ MAIN CONTENT (Revealed below hero) ═══════════ */}
      <div className={`main-content-wrapper ${hasEntered ? 'is-visible' : ''}`}>
        
        {/* STATS BAR */}
        <div className="horror-stats">
          <div className="horror-stats-grid">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="horror-stat-number">{s.value}</div>
                <div className="horror-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <section className="horror-section" id="features">
          <div className="horror-section-header">
            <span className="horror-section-label">Features</span>
            <h2 className="horror-section-title">Everything You Need to Level Up</h2>
          </div>
          <div className="horror-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="horror-feature-card">
                <div className="horror-feature-icon" aria-hidden="true">{f.icon}</div>
                <h3 className="horror-feature-title">{f.title}</h3>
                <p className="horror-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid var(--horror-border)', padding: '40px 24px', textAlign: 'center', background: 'rgba(10,0,0,0.8)' }}>
          <p style={{ color: 'var(--horror-text-dim)', fontSize: '14px' }}>
            &copy; {new Date().getFullYear()} Hellfire Quests — Built by Team Namaste
          </p>
        </footer>
      </div>
    </div>
  );
}
