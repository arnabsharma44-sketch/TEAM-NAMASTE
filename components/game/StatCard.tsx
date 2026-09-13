'use client';
// components/game/StatCard.tsx
type Props = { name: string; value: number; icon: React.ReactNode };

export function StatCard({ name, value, icon }: Props) {
  return (
    <div 
      className="card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 8, 
        minWidth: 100,
        textAlign: 'center',
        padding: '16px',
        background: 'transparent',
        border: '2px solid var(--border)',
        boxShadow: 'none',
        position: 'relative'
      }}
    >
      <div 
        style={{ 
          fontSize: 16, 
          fontFamily: 'VT323, monospace', 
          color: 'var(--text-dim)', 
          textTransform: 'uppercase', 
          borderBottom: '1px solid var(--border)',
          paddingBottom: '4px',
          marginBottom: '4px'
        }}
      >
        {name}
      </div>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 12 
        }}
      >
        <span style={{ fill: 'var(--text-dim)', width: 24, height: 24, opacity: 0.5 }} aria-hidden>{icon}</span>
        <span style={{ fontSize: 36, fontFamily: 'Share Tech Mono, monospace', fontWeight: 700, color: 'var(--indigo)' }}>{value}</span>
      </div>
    </div>
  );
}
