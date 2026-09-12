'use client';
// components/game/ShopItem.tsx
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';

type Item = { id: string; name: string; description: string; price: number; icon: string };

type Props = { item: Item; owned: boolean; onBuy: (id: string) => void };

export function ShopItem({ item, owned, onBuy }: Props) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}>
      {owned && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'var(--green)', borderRadius: 99, padding: '2px 8px',
          fontSize: 11, fontWeight: 700, color: '#001a0a',
        }}>OWNED</div>
      )}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        style={{ fontSize: 40, textAlign: 'center' }}
        aria-hidden
      >
        {item.icon}
      </motion.div>
      <h3 style={{ fontWeight: 600, fontSize: 16, textAlign: 'center' }}>{item.name}</h3>
      <p style={{ color: 'var(--text-dim)', fontSize: 13, textAlign: 'center' }}>{item.description}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 18 }}>💰 {item.price}G</span>
        <button
          className={`btn btn-sm ${owned ? 'btn-ghost' : 'btn-gold'}`}
          onClick={() => !owned && onBuy(item.id)}
          disabled={owned}
          aria-label={owned ? `${item.name} already owned` : `Buy ${item.name} for ${item.price} Gold`}
        >
          {owned ? <><Check size={14} aria-hidden /> Owned</> : <><ShoppingCart size={14} aria-hidden /> Buy</>}
        </button>
      </div>
    </div>
  );
}
