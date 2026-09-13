'use client';
// app/(app)/shop/page.tsx
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { ShopItem } from '@/components/game/ShopItem';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useCharacterStore } from '@/store/character';
import { useUIStore } from '@/store/ui';
import { useRouter } from 'next/navigation';

export default function ShopPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { addToast, setTheme } = useUIStore();
  const char = useCharacterStore((s) => s.character);
  const { saveSnapshot, rollback, addGold } = useCharacterStore();

  const { data: items, isLoading: itemsLoading } = useQuery({
    queryKey: ['shop'],
    queryFn: () => fetch('/api/shop').then((r) => r.json()),
  });

  const { data: inventory, isLoading: invLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await fetch('/api/inventory');
      if (res.status === 401) { router.push('/login'); return []; }
      return res.json();
    },
  });

  const ownedIds = new Set<string>((inventory ?? []).map((i: { itemId: string }) => i.itemId));

  async function buy(itemId: string) {
    saveSnapshot();
    const item = items?.find((i: { id: string; price: number }) => i.id === itemId);
    if (!item) return;
    // Optimistic gold deduction
    addGold(-item.price);

    const res = await fetch('/api/shop/buy', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId }),
    });
    const data = await res.json();
    if (!res.ok) {
      rollback();
      addToast(data.error ?? 'Purchase failed');
      return;
    }
    qc.invalidateQueries({ queryKey: ['me', 'inventory'] });
    // Apply theme immediately if it's a theme item
    if (itemId.startsWith('theme-')) setTheme(itemId);
    addToast(`${item.name} added to inventory!`);
  }

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: 'easeOut', duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="font-display" style={{ fontSize: 28, color: 'var(--gold)' }}>The Shop</h1>
            <p style={{ color: 'var(--text-dim)', marginTop: 4 }}>Spend your hard-earned Gold</p>
          </div>
          {char && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px', fontWeight: 700, color: 'var(--gold)', fontSize: 18 }}>
              💰 {char.gold} Gold
            </div>
          )}
        </div>

        {(itemsLoading || invLoading) && <LoadingSkeleton rows={6} height={200} />}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {(items ?? []).map((item: { id: string; name: string; description: string; price: number; icon: string }, idx: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.35 }}
            >
              <ShopItem item={item} owned={ownedIds.has(item.id)} onBuy={buy} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AppShell>
  );
}
