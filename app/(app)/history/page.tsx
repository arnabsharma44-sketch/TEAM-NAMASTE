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
          <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-dim)' }}>
            <p style={{ fontSize: 40 }}>📜</p>
            <p style={{ marginTop: 12 }}>No completed quests yet. Begin your adventure!</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {logs.map((log) => (
            <div key={log.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px' }}>
              <span style={{ fontSize: 28 }} aria-hidden>{CAT_EMOJI[log.attribute] ?? '⚔️'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{log.attribute}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: 12 }}>{new Date(log.completedAt).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--indigo-light)', fontWeight: 700 }}>+{log.xpEarned} XP</div>
                <div style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 13 }}>+{log.goldEarned} G</div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page">← Prev</button>
            <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>Page {page} of {totalPages}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page">Next →</button>
          </div>
        )}
      </motion.div>
    </AppShell>
  );
}
