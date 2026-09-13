'use client';
// components/game/XPBar.tsx
import { xpForLevel } from '@/lib/game';
import { motion } from 'framer-motion';

type Props = { level: number; xp: number };

export function XPBar({ level, xp }: Props) {
  const needed = xpForLevel(level + 1);
  const pct = Math.min(100, (xp / needed) * 100);
  
  // Create 20 blocks for the 8-bit meter
  const totalBlocks = 20;
  const filledBlocks = Math.floor((pct / 100) * totalBlocks);

  return (
    <div style={{ fontFamily: 'VT323, monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 18, color: 'var(--text)', textTransform: 'uppercase' }}>
        <span>Level {level}</span>
        <span>{xp} / {needed} XP</span>
      </div>
      
      {/* 8-bit arcade segmented meter */}
      <div 
        role="progressbar" 
        aria-valuenow={xp} aria-valuemin={0} aria-valuemax={needed} aria-label="XP progress"
        style={{ 
          display: 'flex', 
          gap: '2px', 
          background: 'var(--bg3)', 
          padding: '4px',
          border: '2px solid var(--border)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
        }}
      >
        {Array.from({ length: totalBlocks }).map((_, i) => {
          const isFilled = i < filledBlocks;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0.2 }}
              animate={{ 
                opacity: isFilled ? 1 : 0.3,
                backgroundColor: isFilled ? 'var(--indigo)' : 'transparent',
                boxShadow: isFilled ? '0 0 10px var(--indigo)' : 'none'
              }}
              transition={{ delay: i * 0.02, duration: 0.3 }}
              style={{
                flex: 1,
                height: '14px',
                border: '1px solid',
                borderColor: isFilled ? 'var(--indigo-light)' : 'var(--bg2)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
