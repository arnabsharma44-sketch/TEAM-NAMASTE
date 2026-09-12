'use client';
// app/(auth)/login/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Login failed'); return; }
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
        style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 24 }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 className="font-display" style={{ fontSize: 32, color: 'var(--gold)' }}>⚔️ Life RPG</h1>
          <p style={{ color: 'var(--text-dim)', marginTop: 8 }}>Enter your realm, Hero</p>
        </div>

        {error && <div role="alert" style={{ background: '#3a1010', border: '1px solid var(--red)', borderRadius: 8, padding: '10px 14px', color: 'var(--red)', fontSize: 14 }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="email" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>Email</label>
            <input id="email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hero@realm.com" style={{ marginTop: 6 }} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>Password</label>
            <input id="password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ marginTop: 6 }} autoComplete="current-password"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleLogin} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
          {loading ? 'Entering realm...' : 'Begin Adventure'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-dim)' }}>
          New hero?{' '}<Link href="/signup" style={{ color: 'var(--indigo-light)', fontWeight: 600 }}>Create Character</Link>
        </p>
      </motion.div>
    </div>
  );
}
