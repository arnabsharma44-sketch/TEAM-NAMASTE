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

const STAT_ICONS: Record<string, string> = {
  intellect: '🧠', strength: '💪', wisdom: '🦉', creativity: '🎨', endurance: '🏃',
};

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
        style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
      >
        <div>
          <h1 className="font-display" style={{ fontSize: 28, color: 'var(--gold)' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-dim)', marginTop: 4 }}>Your heroic journey at a glance</p>
        </div>

        {isLoading && <LoadingSkeleton rows={4} height={120} />}
        {isError && <p style={{ color: 'var(--red)' }}>Failed to load character data.</p>}

        {character && (
          <>
            {/* Character header */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 64 }}>
                {{ Warrior: '⚔️', Mage: '🔮', Rogue: '🗡️', Sage: '📜' }[character.class as string] ?? '🧙'}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h2 className="font-display" style={{ fontSize: 24, color: 'var(--text)' }}>{character.name}</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>{character.class} · Level {character.level}</p>
                <div style={{ marginTop: 12 }}>
                  <XPBar level={character.level} xp={character.xp} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <StreakBadge streak={character.streak} />
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Day Streak</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, color: 'var(--gold)', fontWeight: 700 }}>💰 {character.gold}</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Gold</div>
              </div>
            </div>

            {/* Attributes */}
            <div>
              <h2 className="font-display" style={{ fontSize: 18, marginBottom: 16 }}>Attributes</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
                {(['intellect', 'strength', 'wisdom', 'creativity', 'endurance'] as const).map((attr) => (
                  <StatCard
                    key={attr}
                    name={attr}
                    value={character[attr] as number}
                    icon={STAT_ICONS[attr]}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AppShell>
  );
}
