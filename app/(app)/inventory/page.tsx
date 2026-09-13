'use client';
// app/(app)/inventory/page.tsx
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { SHOP_ITEMS } from '@/lib/shop-catalogue';
import { useUIStore } from '@/store/ui';
import { useRouter } from 'next/navigation';

export default function InventoryPage() {
  const router = useRouter();
  const { setTheme, theme } = useUIStore();

  const { data, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await fetch('/api/inventory');
      if (res.status === 401) { router.push('/login'); return []; }
      return res.json();
    },
  });

  const items = (data ?? []).map((inv: { itemId: string }) =>
    SHOP_ITEMS.find((s) => s.id === inv.itemId)
  ).filter(Boolean);

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 28, color: 'var(--gold)' }}>Inventory</h1>
          <p style={{ color: 'var(--text-dim)', marginTop: 4 }}>{items.length} item{items.length !== 1 ? 's' : ''} owned</p>
        </div>

        {isLoading && <LoadingSkeleton rows={4} height={160} />}

        {!isLoading && items.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 64, color: 'var(--text-dim)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <svg className="neon-flicker" viewBox="0 0 24 24" fill="none" stroke="var(--indigo)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: 80, height: 80, filter: 'drop-shadow(0 0 10px var(--indigo))' }}>
                <rect x="6" y="8" width="12" height="14" rx="2" />
                <path d="M12 2v6" />
                <path d="M9 2h6" />
                <path d="M9 14h6" />
                <circle cx="12" cy="18" r="1.5" />
              </svg>
            </div>
            <p style={{ fontFamily: 'VT323, monospace', fontSize: 20 }}>YOUR BACKPACK IS EMPTY.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {items.map((item: typeof SHOP_ITEMS[number]) => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: 40 }} aria-hidden>{item.icon}</span>
              <h3 style={{ fontWeight: 600 }}>{item.name}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{item.description}</p>
              {item.type === 'theme' && (
                <button
                  className={`btn btn-sm ${theme === item.id ? 'btn-gold' : 'btn-ghost'}`}
                  onClick={() => setTheme(theme === item.id ? 'default' : item.id)}
                  aria-pressed={theme === item.id}
                >
                  {theme === item.id ? '✓ Active' : 'Apply Theme'}
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </AppShell>
  );
}
