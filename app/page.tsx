'use client';
// app/page.tsx — Analog Horror Landing Page (Stranger Things Inspired)
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './home.css';

/* ═══════════════════════════════
   ENVIRONMENT COMPONENTS
   ═══════════════════════════════ */

// 1. Floating Spores Canvas
function SporesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const spores = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      speedY: -(Math.random() * 0.5 + 0.1),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.8 ? '#ff3333' : '#888888' // occasional red hot ash
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      spores.forEach((spore) => {
        ctx.fillStyle = spore.color;
        ctx.globalAlpha = spore.opacity;
        ctx.beginPath();
        ctx.arc(spore.x, spore.y, spore.size, 0, Math.PI * 2);
        ctx.fill();

        spore.x += spore.speedX;
        spore.y += spore.speedY;

        if (spore.y < -10) {
          spore.y = height + 10;
          spore.x = Math.random() * width;
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, filter: 'blur(1px)' }} 
    />
  );
}

// 2. Cursor Flashlight Effect
function CursorFlashlight() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        background: `radial-gradient(circle 400px at ${pos.x}px ${pos.y}px, rgba(255, 0, 0, 0.15) 0%, transparent 80%)`,
        transition: 'background 0.1s ease',
      }}
    />
  );
}

// 3. Creeping Vines Frame (SVG Overlays)
function CreepingVines() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>
      {/* Top Left Vines */}
      <motion.svg 
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', top: -50, left: -50, width: 400, height: 400, fill: 'none', stroke: '#8b0000', strokeWidth: 2, filter: 'blur(3px)' }}
        viewBox="0 0 100 100"
      >
        <path d="M0,0 Q30,50 60,20 T100,50 M0,20 Q20,60 50,40 T90,80 M20,0 Q40,40 20,80" />
      </motion.svg>
      {/* Bottom Right Vines */}
      <motion.svg 
        animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ position: 'absolute', bottom: -50, right: -50, width: 500, height: 500, fill: 'none', stroke: '#660000', strokeWidth: 3, filter: 'blur(4px)' }}
        viewBox="0 0 100 100"
      >
        <path d="M100,100 Q70,50 40,80 T0,50 M100,80 Q80,40 50,60 T10,20 M80,100 Q60,60 80,20" />
      </motion.svg>
    </div>
  );
}

/* ═══════════════════════════════
   3D TILT QUEST CARD
   ═══════════════════════════════ */
const QUESTS = [
  { id: 1, title: "Escape Vecna's Curse", difficulty: "NIGHTMARE", reward: "+500 INT, +100 Gold", badge: "HIGH PRIORITY" },
  { id: 2, title: "Survive Hawkins High Dungeon", difficulty: "HARD", reward: "+300 STR, +50 Gold", badge: "DAILY GRIND" },
  { id: 3, title: "Locate the Russian Transmitter", difficulty: "MEDIUM", reward: "+200 WIS, +35 Gold", badge: "INTEL" }
];

function QuestCard({ quest }: { quest: typeof QUESTS[0] }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ perspective: 1000, width: '100%', maxWidth: 350 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="classified-doc"
        style={{ rotateX, rotateY, padding: '40px 24px 24px', minHeight: 280, display: 'flex', flexDirection: 'column' }}
        whileHover={{ scale: 1.05, boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1), 0 15px 30px rgba(200, 0, 0, 0.3)' }}
      >
        <div className="danger-tape">{quest.badge}</div>
        
        <div style={{ flex: 1 }}>
          <div className="typewriter-text" style={{ fontSize: 12, color: '#666', borderBottom: '1px dashed #999', paddingBottom: 8, marginBottom: 16 }}>
            CASE FILE: #00{quest.id}<br/>
            STATUS: CLASSIFIED
          </div>
          <h3 className="typewriter-text" style={{ fontSize: 22, color: '#990000', marginBottom: 16, textTransform: 'uppercase', lineHeight: 1.2 }}>
            {quest.title}
          </h3>
          <p className="typewriter-text" style={{ fontSize: 14, marginBottom: 8 }}>
            <strong>DIFFICULTY:</strong> {quest.difficulty}
          </p>
          <p className="typewriter-text" style={{ fontSize: 14 }}>
            <strong>REWARD:</strong> {quest.reward}
          </p>
        </div>

        <button className="tactile-btn" style={{ width: '100%', marginTop: 24 }}>
          ACCEPT CAMPAIGN
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════
   MAIN PAGE LAYOUT
   ═══════════════════════════════ */
export default function AnalogLandingPage() {
  const [audioEnabled, setAudioEnabled] = useState(false);

  return (
    <div className="analog-horror-root">
      {/* Background Layers */}
      <SporesCanvas />
      <CursorFlashlight />
      <CreepingVines />
      <div className="crt-overlay" />

      {/* Top Threat Level Widget */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(255, 0, 0, 0.2)', background: 'rgba(5, 3, 3, 0.8)', backdropFilter: 'blur(4px)' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ border: '1px solid #cc0000', padding: '4px 12px', background: 'rgba(200, 0, 0, 0.1)', color: '#ff3333', fontSize: 14 }}>
            <span className="neon-flicker" style={{ marginRight: 8 }}>●</span>
            THREAT LEVEL: CRITICAL
          </div>
          <div style={{ color: '#888', fontSize: 14 }}>
            ACTIVE PARTY: <span style={{ color: '#fff' }}>4,815</span>
          </div>
        </div>
        
        <button 
          onClick={() => setAudioEnabled(!audioEnabled)}
          style={{ background: 'none', border: '1px solid #444', color: audioEnabled ? '#ff3333' : '#666', padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 }}
        >
          [ 🔊 AMBIENT AUDIO: {audioEnabled ? 'ON' : 'OFF'} ]
        </button>
      </header>

      <main style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 100 }}>
        
        {/* HERO SECTION */}
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
          <h1 className="neon-flicker" style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(48px, 12vw, 130px)', color: '#ff1a1a', margin: 0, lineHeight: 1.1, fontWeight: 900, textTransform: 'uppercase' }}>
            HELLFIRE<br/>QUESTS
          </h1>
          
          <div style={{ marginTop: 24, marginBottom: 48, maxWidth: 600 }}>
            <p className="glitch-text" data-text="THE GATE IS OPEN. COMPLETE DAILY CAMPAIGN QUESTS OR FACE THE MINDFLAYER." style={{ fontSize: 18, color: '#ccc', lineHeight: 1.5, letterSpacing: 2 }}>
              THE GATE IS OPEN. COMPLETE DAILY CAMPAIGN QUESTS OR FACE THE MINDFLAYER.
            </p>
          </div>

          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 0, 0, 0.8), inset 0 0 20px rgba(255, 0, 0, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'rgba(20, 0, 0, 0.6)',
                border: '2px solid #ff1a1a',
                color: '#fff',
                padding: '16px 40px',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: 20,
                textTransform: 'uppercase',
                letterSpacing: 2,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 0 15px rgba(255, 0, 0, 0.3)'
              }}
            >
              SURVIVE THE UPSIDE DOWN <span style={{ marginLeft: 8 }}>&rarr;</span>
            </motion.button>
          </Link>
        </section>

        {/* FEATURED QUESTS GRID */}
        <section style={{ padding: '80px 24px', background: 'linear-gradient(to bottom, transparent, rgba(15, 5, 5, 0.9))' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, color: '#cc0000', borderBottom: '1px solid #cc0000', display: 'inline-block', paddingBottom: 8 }}>
              CLASSIFIED DIRECTIVES
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', maxWidth: 1200, margin: '0 auto' }}>
            {QUESTS.map(q => (
              <QuestCard key={q.id} quest={q} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
