'use client';
// components/ui/ErrorToast.tsx
import { useUIStore } from '@/store/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();
  return (
    <div style={{ position: 'fixed', bottom: 80, right: 20, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: [0, -8, 8, -8, 0], opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'var(--bg2)', border: '1px solid var(--red)',
              borderRadius: 10, padding: '12px 16px', display: 'flex',
              alignItems: 'center', gap: 10, minWidth: 260, maxWidth: 360,
            }}
            role="alert"
          >
            <span style={{ color: 'var(--red)', fontSize: 18 }}>⚠️</span>
            <span style={{ flex: 1, fontSize: 14 }}>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              style={{ color: 'var(--text-dim)', padding: 4 }}
              aria-label="Dismiss notification"
            >
              <X size={16} aria-hidden />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
