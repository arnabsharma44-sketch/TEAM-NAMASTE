'use client';
// components/game/StatCard.tsx
type Props = { name: string; value: number; icon: string };

export function StatCard({ name, value, icon }: Props) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 110 }}>
      <span style={{ fontSize: 28 }} aria-hidden>{icon}</span>
      <span style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{name}</span>
      <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--indigo-light)' }}>{value}</span>
    </div>
  );
}
