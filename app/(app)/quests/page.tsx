'use client';
// app/(app)/quests/page.tsx
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { QuestCard } from '@/components/game/QuestCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useCharacterStore } from '@/store/character';
import { useUIStore } from '@/store/ui';
import { XP_REWARDS, GOLD_REWARDS } from '@/lib/game';
import { useRouter } from 'next/navigation';

type Quest = { id: string; title: string; description?: string | null; category: string; difficulty: string };
type FormState = { title: string; description: string; category: string; difficulty: string };

const CATEGORIES = ['INTELLECT', 'STRENGTH', 'WISDOM', 'CREATIVITY', 'ENDURANCE'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

function QuestForm({ initial, onSave, onClose }: {
  initial?: Quest; onSave: (data: FormState) => Promise<void>; onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    title: initial?.title ?? '', description: initial?.description ?? '',
    category: initial?.category ?? 'INTELLECT', difficulty: initial?.difficulty ?? 'EASY',
  });
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!form.title.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
      animate={{ opacity: 1, backdropFilter: 'blur(8px)' }} 
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="card"
        initial={{ scale: 0.92, opacity: 0, y: 15 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid var(--red-primary)', boxShadow: '0 0 35px var(--red-glow-strong)' }}
        role="dialog" aria-modal="true" aria-labelledby="quest-form-title"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 id="quest-form-title" className="font-display red-flicker" style={{ fontSize: 20, color: 'var(--red-primary)' }}>
            {initial ? 'Edit Quest' : 'New Quest'}
          </h2>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} aria-label="Close dialog">
            <X size={20} aria-hidden />
          </motion.button>
        </div>

        <div>
          <label htmlFor="q-title" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>Quest Title *</label>
          <input id="q-title" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Conquer the morning run" style={{ marginTop: 6 }} maxLength={100} />
        </div>
        <div>
          <label htmlFor="q-desc" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>Description</label>
          <textarea id="q-desc" className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ marginTop: 6, resize: 'vertical' }} maxLength={500} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label htmlFor="q-cat" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>Category</label>
            <select id="q-cat" className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ marginTop: 6 }}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="q-diff" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>Difficulty</label>
            <select id="q-diff" className="select" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} style={{ marginTop: 6 }}>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d} ({XP_REWARDS[d]}XP / {GOLD_REWARDS[d]}G)</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} className="btn btn-ghost" onClick={onClose}>Cancel</motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" onClick={submit} disabled={saving || !form.title.trim()}>
            {saving ? 'Saving...' : initial ? 'Update Quest' : 'Create Quest'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function QuestsPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { saveSnapshot, rollback, addXP, addGold } = useCharacterStore();
  const { showLevelUp, addToast } = useUIStore();
  const [modal, setModal] = useState<'create' | Quest | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const res = await fetch('/api/quests');
      if (res.status === 401) { router.push('/login'); return null; }
      return res.json();
    },
  });

  async function createQuest(form: FormState) {
    const res = await fetch('/api/quests', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    if (!res.ok) { addToast('Failed to create quest'); return; }
    qc.invalidateQueries({ queryKey: ['quests'] });
    setModal(null);
  }

  async function editQuest(form: FormState) {
    if (typeof modal !== 'object' || !modal) return;
    const res = await fetch(`/api/quests/${modal.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    if (!res.ok) { addToast('Failed to update quest'); return; }
    qc.invalidateQueries({ queryKey: ['quests'] });
    setModal(null);
  }

  async function completeQuest(id: string): Promise<{ xpEarned: number }> {
    saveSnapshot();
    const res = await fetch(`/api/quests/${id}/complete`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) { rollback(); throw new Error(data.error); }
    addXP(data.xpEarned);
    addGold(data.goldEarned);
    if (data.leveled) showLevelUp();
    qc.invalidateQueries({ queryKey: ['me', 'quests'] });
    return { xpEarned: data.xpEarned };
  }

  async function deleteQuest(id: string) {
    const res = await fetch(`/api/quests/${id}`, { method: 'DELETE' });
    if (!res.ok) { addToast('Failed to abandon quest'); return; }
    qc.invalidateQueries({ queryKey: ['quests'] });
  }

  const quests: Quest[] = data?.quests ?? [];

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="font-display red-flicker" style={{ fontSize: 28, color: 'var(--gold)' }}>Active Quests</h1>
            <p style={{ color: 'var(--text-dim)', marginTop: 4 }}>{quests.length} quest{quests.length !== 1 ? 's' : ''} awaiting</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary" 
            onClick={() => setModal('create')} 
            aria-label="Create new quest"
          >
            <Plus size={16} aria-hidden /> New Quest
          </motion.button>
        </div>

        {isLoading && <LoadingSkeleton rows={3} height={130} />}
        {!isLoading && quests.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card" 
            style={{ textAlign: 'center', padding: 64, color: 'var(--text-dim)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <svg className="neon-flicker" viewBox="0 0 24 24" fill="none" stroke="var(--indigo)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: 80, height: 80, filter: 'drop-shadow(0 0 10px var(--indigo))' }}>
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <polygon points="12 22 7 12 17 12 12 22" />
                <polygon points="12 2 7 12 17 12 12 2" />
                <line x1="2" y1="8.5" x2="7" y2="12" />
                <line x1="2" y1="15.5" x2="7" y2="12" />
                <line x1="22" y1="8.5" x2="17" y2="12" />
                <line x1="22" y1="15.5" x2="17" y2="12" />
              </svg>
            </div>
            <p style={{ fontFamily: 'VT323, monospace', fontSize: 20 }}>NO ACTIVE CAMPAIGNS. ROLL INITIATIVE!</p>
          </motion.div>
        )}

        <div style={{ display: 'grid', gap: 14 }}>
          {quests.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
            >
              <QuestCard quest={q} onComplete={completeQuest} onDelete={deleteQuest} onEdit={(q) => setModal(q)} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {modal === 'create' && <QuestForm onSave={createQuest} onClose={() => setModal(null)} />}
        {modal && typeof modal === 'object' && <QuestForm initial={modal} onSave={editQuest} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </AppShell>
  );
}
