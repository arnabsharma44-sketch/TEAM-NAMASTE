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
          <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-dim)' }}>
            <p style={{ fontSize: 40 }}>🎒</p>
            <p style={{ marginTop: 12 }}>Your bag is empty. Visit the Shop to spend your Gold!</p>
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
