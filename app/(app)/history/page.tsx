'use client';
// app/(app)/history/page.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useRouter } from 'next/navigation';

type Log = { id: string; questId: string; xpEarned: number; goldEarned: number; attribute: string; completedAt: string };

const CAT_EMOJI: Record<string, string> = {
  INTELLECT: '🧠', STRENGTH: '💪', WISDOM: '🦉', CREATIVITY: '🎨', ENDURANCE: '🏃',
};

export default function HistoryPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['history', page],
    queryFn: async () => {
      const res = await fetch(`/api/history?page=${page}`);
      if (res.status === 401) { router.push('/login'); return null; }
      return res.json();
    },
  });

  const logs: Log[] = data?.logs ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 28, color: 'var(--gold)' }}>Quest History</h1>
          <p style={{ color: 'var(--text-dim)', marginTop: 4 }}>{total} quests completed</p>
        </div>

        {isLoading && <LoadingSkeleton rows={5} height={72} />}

        {!isLoading && logs.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 64, color: 'var(--text-dim)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <svg className="neon-flicker" viewBox="0 0 24 24" fill="none" stroke="var(--indigo)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: 80, height: 80, filter: 'drop-shadow(0 0 10px var(--indigo))' }}>
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
                <circle cx="8" cy="14" r="2" />
                <circle cx="16" cy="14" r="2" />
                <path d="M10 14h4" />
              </svg>
            </div>
            <p style={{ fontFamily: 'VT323, monospace', fontSize: 20 }}>NO LOGS FOUND. INSERT TAPE.</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {logs.map((log, idx) => (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 4, borderColor: 'var(--red-primary)', boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 15px var(--red-glow)' }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              className="card" 
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px' }}
            >
              <span style={{ fontSize: 28 }} aria-hidden>{CAT_EMOJI[log.attribute] ?? '⚔️'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{log.attribute}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: 12 }}>{new Date(log.completedAt).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--indigo-light)', fontWeight: 700 }}>+{log.xpEarned} XP</div>
                <div style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 13 }}>+{log.goldEarned} G</div>
              </div>
            </motion.div>
          ))}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-ghost btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page">← Prev</motion.button>
            <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>Page {page} of {totalPages}</span>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-ghost btn-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page">Next →</motion.button>
          </div>
        )}
      </motion.div>
    </AppShell>
  );
}
