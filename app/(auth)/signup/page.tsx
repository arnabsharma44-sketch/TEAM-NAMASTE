'use client';
// app/(auth)/signup/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CLASSES = ['Warrior', 'Mage', 'Rogue', 'Sage'] as const;
const CLASS_ICONS: Record<string, string> = { Warrior: '⚔️', Mage: '🔮', Rogue: '🗡️', Sage: '📜' };

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [characterClass, setCharacterClass] = useState<typeof CLASSES[number]>('Warrior');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, characterName, characterClass }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Signup failed'); return; }
      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 16 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeOut', duration: 0.2 }}
        className="card"
        style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 24 }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 className="font-display" style={{ fontSize: 28, color: 'var(--gold)' }}>Create Your Character</h1>
          <p style={{ color: 'var(--text-dim)', marginTop: 8 }}>Your legend begins here</p>
        </div>

        {error && <div role="alert" style={{ background: '#3a1010', border: '1px solid var(--red)', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: 14 }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="signup-email" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>Email</label>
            <input id="signup-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hero@realm.com" style={{ marginTop: 6 }} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="signup-password" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>Password (min 8 chars)</label>
            <input id="signup-password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ marginTop: 6 }} autoComplete="new-password" />
          </div>
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

        <button className="btn btn-primary" onClick={handleSignup} disabled={loading || !characterName.trim()} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Forging destiny...' : 'Begin Your Quest'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ padding: '0 12px', fontSize: 12, color: 'var(--text-dim)' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <a href="/api/auth/google" className="btn btn-ghost" style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </a>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-dim)' }}>
          Already a hero?{' '}<Link href="/login" style={{ color: 'var(--indigo-light)', fontWeight: 600 }}>Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
