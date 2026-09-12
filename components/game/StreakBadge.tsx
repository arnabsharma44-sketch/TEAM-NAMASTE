'use client';
// components/game/StreakBadge.tsx
import { motion } from 'framer-motion';

type Props = { streak: number };

export function StreakBadge({ streak }: Props) {
  const milestone = streak >= 30 ? '30-day legend!' : streak >= 7 ? '7-day streak!' : null;

  return (
    <motion.div
      animate={milestone ? { scale: [1, 1.15, 1] } : {}}
      transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
      title={milestone ?? `${streak}-day streak`}
    >
      <span style={{ fontSize: 22 }}>🔥</span>
      <span style={{ fontWeight: 700, fontSize: 18, color: streak >= 7 ? 'var(--gold)' : 'var(--text)' }}>
        {streak}
      </span>
      {milestone && (
        <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600 }}>{milestone}</span>
      )}
    </motion.div>
  );
}
