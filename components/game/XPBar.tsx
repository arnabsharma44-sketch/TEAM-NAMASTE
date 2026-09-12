'use client';
// components/game/XPBar.tsx
import { motion } from 'framer-motion';
import { xpForLevel } from '@/lib/game';

type Props = { level: number; xp: number };

export function XPBar({ level, xp }: Props) {
  const needed = xpForLevel(level + 1);
  const pct = Math.min(100, (xp / needed) * 100);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: 'var(--text-dim)' }}>
        <span>Level {level}</span>
        <span>{xp} / {needed} XP</span>
      </div>
      <div className="xp-bar-track" role="progressbar" aria-valuenow={xp} aria-valuemin={0} aria-valuemax={needed} aria-label="XP progress">
        <motion.div
          className="xp-bar-fill"
          layoutId="xp-fill"
          style={{ width: `${pct}%` }}
          transition={{ ease: 'easeOut', duration: 0.5 }}
        />
      </div>
    </div>
  );
}
