'use client';
// app/(app)/dashboard/page.tsx
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { XPBar } from '@/components/game/XPBar';
import { StatCard } from '@/components/game/StatCard';
import { StreakBadge } from '@/components/game/StreakBadge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useCharacterStore } from '@/store/character';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// D&D SVG Line-art icons
const Icons = {
  STR: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h5v5m-5-5L22 2m-8 6-3 3-5-5-4 4 5 5-3 3h-5v5h5l3-3 5 5 4-4-5-5 3-3V4z"/>
    </svg>
  ),
  DEX: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  CON: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  INT: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  WIS: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  CHA: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
};

// Map backend attributes to classic D&D stats
const STAT_MAPPING = [
  { key: 'strength',   label: 'STR', icon: Icons.STR },
  { key: 'creativity', label: 'DEX', icon: Icons.DEX },
  { key: 'endurance',  label: 'CON', icon: Icons.CON },
  { key: 'intellect',  label: 'INT', icon: Icons.INT },
  { key: 'wisdom',     label: 'WIS', icon: Icons.WIS },
];

export default function DashboardPage() {
  const router = useRouter();
  const setCharacter = useCharacterStore((s) => s.setCharacter);
  const char = useCharacterStore((s) => s.character);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/me');
      if (res.status === 401) { router.push('/login'); return null; }
      if (!res.ok) throw new Error('Failed to load');
      return res.json();
    },
  });

  useEffect(() => {
    if (data?.character) setCharacter(data.character);
  }, [data, setCharacter]);

  const character = char ?? data?.character;

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeOut', duration: 0.2 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
      >
        <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: 16 }}>
          <h1 className="font-display neon-flicker" style={{ fontSize: 36, color: 'var(--red)' }}>Player Sheet</h1>
          <p style={{ color: 'var(--text-dim)', marginTop: 8, fontFamily: 'VT323, monospace', fontSize: 18, textTransform: 'uppercase' }}>
            Hawkins Middle School // Official Record
          </p>
        </div>

        {isLoading && <LoadingSkeleton rows={4} height={120} />}
        {isError && <p style={{ color: 'var(--red)', fontFamily: 'VT323, monospace' }}>ERROR: CONNECTION TO MAINFRAME LOST.</p>}

        {character && (
          <>
            {/* Player ID Card (Cinematic Styling) */}
            <motion.div 
              className="glass-panel" 
              whileHover={{ borderColor: 'var(--red-primary)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 25px var(--red-glow-strong)' }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', gap: 32, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}
            >
              <motion.div 
                whileHover={{ scale: 1.05, rotate: [0, -4, 4, 0] }}
                style={{ 
                  width: 120, 
                  height: 120, 
                  border: '1px solid var(--border-active)', 
                  background: 'rgba(255, 26, 26, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 0 20px var(--red-glow)'
                }}
              >
                <span style={{ fontSize: 48, filter: 'drop-shadow(0 0 10px rgba(255, 26, 26, 0.8))' }}>
                  {{ Warrior: '⚔️', Mage: '🔮', Rogue: '🗡️', Sage: '📜' }[character.class as string] ?? '👤'}
                </span>
              </motion.div>

              <div style={{ flex: 1, minWidth: 250, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 36, color: 'var(--text-primary)', lineHeight: 1, textTransform: 'uppercase', textShadow: '0 0 15px rgba(255, 26, 26, 0.3)' }}>{character.name}</h2>
                  <div style={{ display: 'flex', gap: 16, fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'var(--red-primary)', marginTop: 8, fontWeight: 600 }}>
                    <span>CLASS: {character.class.toUpperCase()}</span>
                    <span>//</span>
                    <span>STATUS: ALIVE</span>
                  </div>
                </div>
                
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '100%' }}>
                    <XPBar level={character.level} xp={character.xp} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingLeft: 32, borderLeft: '1px solid var(--border-subtle)' }}>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  style={{ textAlign: 'center', padding: '12px 24px', background: 'rgba(10, 10, 15, 0.6)', borderRadius: 'var(--radius)', border: '1px solid var(--border-subtle)' }}
                >
                  <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600 }}>TOTAL GOLD</div>
                  <div className="gold-value" style={{ fontSize: 24, fontFamily: 'Inter, sans-serif', color: 'var(--gold)', fontWeight: 700 }}>{character.gold}</div>
                </motion.div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <StreakBadge streak={character.streak} />
                  <span style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE STREAK</span>
                </div>
              </div>
            </motion.div>

            {/* Attributes List */}
            <div>
              <h2 style={{ fontFamily: 'VT323, monospace', fontSize: 24, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 8, display: 'inline-block' }}>
                BASE ATTRIBUTES
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16 }}>
                {STAT_MAPPING.map((stat, idx) => (
                  <motion.div
                    key={stat.key}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.3 }}
                  >
                    <StatCard
                      name={stat.label}
                      value={character[stat.key] as number}
                      icon={stat.icon}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AppShell>
  );
}
