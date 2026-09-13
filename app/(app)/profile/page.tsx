'use client';
// app/(app)/profile/page.tsx
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Mail, Save } from 'lucide-react';
import { StatCard } from '@/components/game/StatCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// D&D SVG Line-art icons
const Icons = {
  STR: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h5v5m-5-5L22 2m-8 6-3 3-5-5-4 4 5 5-3 3h-5v5h5l3-3 5 5 4-4-5-5 3-3V4z"/>
    </svg>
  ),
  DEX: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  CON: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  INT: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  WIS: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
};

export default function ProfilePage() {
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/me');
      if (!res.ok) throw new Error('Failed to load');
      return res.json();
    },
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (data?.user) {
      setFirstName(data.user.firstName || '');
      setLastName(data.user.lastName || '');
      setBio(data.user.bio || '');
    }
  }, [data]);

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { firstName: string, lastName: string, bio: string }) => {
      const res = await fetch('/api/me/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  });

  if (isLoading) {
    return <div style={{ padding: 24, color: 'var(--text-dim)' }}>Loading profile...</div>;
  }

  const user = data?.user;
  const character = data?.character;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <Link href="/dashboard" className="btn btn-ghost" style={{ marginBottom: 16, display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Return Back
        </Link>
        <h1 className="font-display neon-flicker" style={{ fontSize: 32, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <User size={32} /> User Profile
        </h1>
        <p style={{ color: 'var(--text-dim)', marginTop: 4, fontFamily: 'VT323, monospace', fontSize: 18 }}>Manage your personal details and view your hero's status.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* Profile Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <h2 className="font-display" style={{ fontSize: 20, color: 'var(--text)' }}>Personal Details</h2>
          
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={14} /> Email Account
            </label>
            <div style={{ marginTop: 6, padding: '10px 14px', background: 'var(--bg)', borderRadius: 8, color: 'var(--text-dim)', border: '1px solid var(--border)' }}>
              {user?.email}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Email cannot be changed.</p>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="firstName" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>First Name</label>
              <input id="firstName" className="input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" style={{ marginTop: 6 }} />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="lastName" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>Last Name</label>
              <input id="lastName" className="input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" style={{ marginTop: 6 }} />
            </div>
          </div>

          <div>
            <label htmlFor="bio" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>Bio</label>
            <textarea id="bio" className="input" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." style={{ marginTop: 6, minHeight: 100, resize: 'vertical' }} />
          </div>

          {successMsg && <div style={{ color: 'var(--green)', fontSize: 14, fontWeight: 500 }}>{successMsg}</div>}

          <button 
            className="btn btn-primary" 
            onClick={() => updateProfileMutation.mutate({ firstName, lastName, bio })}
            disabled={updateProfileMutation.isPending}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Save size={18} /> {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.div>

        {/* Character Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <h2 className="font-display" style={{ fontSize: 20, color: 'var(--cyan)' }}>Party Member Synopsis</h2>
          
          {character ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{character.name}</div>
                <div style={{ fontSize: 14, color: 'var(--cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{character.class}</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Level</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{character.level}</div>
                </div>
                <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Gold</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--cyan)' }}>{character.gold} GP</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 16 }}>
                 <StatCard name="STR" value={character.strength} icon={Icons.STR} />
                 <StatCard name="DEX" value={character.creativity} icon={Icons.DEX} />
                 <StatCard name="CON" value={character.endurance} icon={Icons.CON} />
                 <StatCard name="INT" value={character.intellect} icon={Icons.INT} />
                 <StatCard name="WIS" value={character.wisdom} icon={Icons.WIS} />
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-dim)' }}>No character found.</div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
