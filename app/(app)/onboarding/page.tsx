'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';

const CLASSES = ['Warrior', 'Mage', 'Rogue', 'Sage'] as const;
const CLASS_ICONS: Record<string, string> = { Warrior: '⚔️', Mage: '🔮', Rogue: '🗡️', Sage: '📜' };

export default function OnboardingPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [characterName, setCharacterName] = useState('');
  const [characterClass, setCharacterClass] = useState<typeof CLASSES[number]>('Warrior');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/me/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterName, characterClass }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to create character'); return; }
      qc.invalidateQueries({ queryKey: ['me'] });
      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 32px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeOut', duration: 0.2 }}
        className="card"
        style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 24, margin: '0 auto' }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 className="font-display" style={{ fontSize: 28, color: 'var(--gold)' }}>Create Your Character</h1>
          <p style={{ color: 'var(--text-dim)', marginTop: 8 }}>Your legend begins here</p>
        </div>

        {error && <div role="alert" style={{ background: '#3a1010', border: '1px solid var(--red)', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: 14 }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="char-name" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>Character Name</label>
            <input id="char-name" className="input" type="text" value={characterName} onChange={(e) => setCharacterName(e.target.value)} placeholder="Aldric the Bold" style={{ marginTop: 6 }} maxLength={30} />
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600, marginBottom: 8 }}>Choose Your Class</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {CLASSES.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setCharacterClass(cls)}
                  aria-pressed={characterClass === cls}
                  style={{
                    padding: '12px 8px', borderRadius: 10, textAlign: 'center',
                    border: `2px solid ${characterClass === cls ? 'var(--indigo-light)' : 'var(--border)'}`,
                    background: characterClass === cls ? 'var(--bg3)' : 'transparent',
                    transition: 'border-color 0.15s, background 0.15s',
                    cursor: 'pointer', color: 'var(--text)',
                  }}
                >
                  <div style={{ fontSize: 28 }}>{CLASS_ICONS[cls]}</div>
                  <div style={{ fontWeight: 600, marginTop: 4, fontSize: 14 }}>{cls}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleCreate} disabled={loading || !characterName.trim()} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Forging destiny...' : 'Begin Your Quest'}
        </button>
      </motion.div>
    </div>
  );
}
