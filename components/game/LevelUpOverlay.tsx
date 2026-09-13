'use client';
// components/game/LevelUpOverlay.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui';
import { useEffect } from 'react';

export function LevelUpOverlay() {
  const { levelUpVisible, hideLevelUp } = useUIStore();

  useEffect(() => {
    if (levelUpVisible) {
      const t = setTimeout(hideLevelUp, 2200);
      return () => clearTimeout(t);
    }
  }, [levelUpVisible, hideLevelUp]);

  return (
    <AnimatePresence>
      {levelUpVisible && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="levelup-title"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.15, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            style={{ textAlign: 'center', padding: '40px 60px', background: 'rgba(10, 0, 0, 0.9)', border: '2px solid var(--red-primary)', borderRadius: '16px', boxShadow: '0 0 50px var(--red-glow-strong)' }}
          >
            <motion.div 
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }} 
              transition={{ duration: 0.8 }}
              style={{ fontSize: 90, lineHeight: 1 }}
            >
              ⚡
            </motion.div>
            <h2 
              id="levelup-title" 
              className="font-display red-flicker" 
              style={{ fontSize: 52, color: 'var(--gold)', marginTop: 16, textShadow: '0 0 30px rgba(245, 184, 61, 0.8)' }}
            >
              LEVEL UP!
            </h2>
            <p style={{ color: 'var(--text-primary)', marginTop: 12, fontSize: 20, fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>
              Your supernatural power grows, Hero!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
