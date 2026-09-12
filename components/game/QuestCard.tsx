'use client';
// components/game/QuestCard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Pencil } from 'lucide-react';
import { XPFloater } from './XPFloater';

type Quest = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  difficulty: string;
};

type Props = {
  quest: Quest;
  onComplete: (id: string) => Promise<{ xpEarned: number }>;
  onDelete: (id: string) => void;
  onEdit: (quest: Quest) => void;
};

const DIFF_MAP: Record<string, string> = { EASY: 'chip-easy', MEDIUM: 'chip-medium', HARD: 'chip-hard' };
const CAT_MAP: Record<string, string> = {
  INTELLECT: 'chip-intellect', STRENGTH: 'chip-strength', WISDOM: 'chip-wisdom',
  CREATIVITY: 'chip-creativity', ENDURANCE: 'chip-endurance',
};

export function QuestCard({ quest, onComplete, onDelete, onEdit }: Props) {
  const [shaking, setShaking] = useState(false);
  const [floater, setFloater] = useState<{ xp: number; show: boolean }>({ xp: 0, show: false });

  async function handleComplete() {
    try {
      const { xpEarned } = await onComplete(quest.id);
      setFloater({ xp: xpEarned, show: true });
      setTimeout(() => setFloater((f) => ({ ...f, show: false })), 700);
      // Announce for screen readers
      const el = document.getElementById('xp-announcer');
      if (el) el.textContent = `Gained ${xpEarned} XP!`;
    } catch {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
  }

  return (
    <motion.div
      className="card"
      animate={shaking ? { x: [0, -8, 8, -8, 0] } : {}}
      transition={{ duration: 0.3 }}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <XPFloater xp={floater.xp} visible={floater.show} />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span className={`chip ${CAT_MAP[quest.category]}`}>{quest.category}</span>
        <span className={`chip ${DIFF_MAP[quest.difficulty]}`}>{quest.difficulty}</span>
      </div>

      <div>
        <h3 style={{ fontWeight: 600, fontSize: 16 }}>{quest.title}</h3>
        {quest.description && <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 4 }}>{quest.description}</p>}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleComplete}
          aria-label={`Complete quest: ${quest.title}`}
        >
          <Check size={14} aria-hidden /> Complete
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onEdit(quest)}
          aria-label={`Edit quest: ${quest.title}`}
        >
          <Pencil size={14} aria-hidden /> Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(quest.id)}
          aria-label={`Abandon quest: ${quest.title}`}
        >
          <Trash2 size={14} aria-hidden /> Abandon
        </button>
      </div>
    </motion.div>
  );
}
