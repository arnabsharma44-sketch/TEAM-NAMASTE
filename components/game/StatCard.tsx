'use client';
// components/game/StatCard.tsx
import { motion } from 'framer-motion';

type Props = { name: string; value: number; icon: React.ReactNode };

export function StatCard({ name, value, icon }: Props) {
  return (
    <motion.div 
      className="card" 
      whileHover={{ y: -4, borderColor: 'var(--red-primary)', boxShadow: '0 8px 25px rgba(0,0,0,0.6), 0 0 15px var(--red-glow)' }}
      transition={{ duration: 0.2 }}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 8, 
        minWidth: 100,
        textAlign: 'center',
        padding: '16px',
        background: 'transparent',
        border: '2px solid var(--border)',
        boxShadow: 'none',
        position: 'relative'
      }}
    >
      <div 
        style={{ 
          fontSize: 16, 
          fontFamily: 'VT323, monospace', 
          color: 'var(--text-dim)', 
          textTransform: 'uppercase', 
          borderBottom: '1px solid var(--border)',
          paddingBottom: '4px',
          marginBottom: '4px'
        }}
      >
        {name}
      </div>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 12 
        }}
      >
        <span style={{ fill: 'var(--text-dim)', width: 24, height: 24, opacity: 0.75 }} aria-hidden>{icon}</span>
        <motion.span 
          whileHover={{ scale: 1.1, color: '#fff', textShadow: '0 0 15px var(--red-primary)' }}
          style={{ fontSize: 36, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700, color: 'var(--indigo)', cursor: 'default' }}
        >
          {value}
        </motion.span>
      </div>
    </motion.div>
  );
}
