'use client';
// components/game/XPFloater.tsx
import { motion, AnimatePresence } from 'framer-motion';

type Props = { xp: number; visible: boolean };

export function XPFloater({ xp, visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -60, opacity: 0 }}
          exit={{}}
          transition={{ type: 'spring', duration: 0.6 }}
          style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            color: 'var(--gold)', fontWeight: 700, fontSize: 20,
            pointerEvents: 'none', zIndex: 10, whiteSpace: 'nowrap',
          }}
          aria-hidden
        >
          +{xp} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
