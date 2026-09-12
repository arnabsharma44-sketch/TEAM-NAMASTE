'use client';
// components/game/LevelUpOverlay.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui';
import { useEffect } from 'react';

export function LevelUpOverlay() {
  const { levelUpVisible, hideLevelUp } = useUIStore();

  useEffect(() => {
    if (levelUpVisible) {
      const t = setTimeout(hideLevelUp, 2000);
      return () => clearTimeout(t);
    }
  }, [levelUpVisible, hideLevelUp]);

  return (
    <AnimatePresence>
      {levelUpVisible && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="levelup-title"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: 80, lineHeight: 1 }}>⬆️</div>
            <h2 id="levelup-title" className="font-display" style={{ fontSize: 48, color: 'var(--gold)', marginTop: 16 }}>
              LEVEL UP!
            </h2>
            <p style={{ color: 'var(--indigo-light)', marginTop: 8, fontSize: 18 }}>
              Your power grows, Hero!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
