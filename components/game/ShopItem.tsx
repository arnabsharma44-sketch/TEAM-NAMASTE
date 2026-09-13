'use client';
// components/game/ShopItem.tsx
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';

type Item = { id: string; name: string; description: string; price: number; icon: string };

type Props = { item: Item; owned: boolean; onBuy: (id: string) => void };

export function ShopItem({ item, owned, onBuy }: Props) {
  return (
    <motion.div 
      className="card" 
      whileHover={{ y: -6, borderColor: 'var(--red-primary)', boxShadow: '0 12px 35px rgba(0,0,0,0.6), 0 0 25px var(--red-glow-strong)' }}
      style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}
    >
      {owned && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'var(--green)', borderRadius: 99, padding: '2px 8px',
          fontSize: 11, fontWeight: 700, color: '#001a0a',
          boxShadow: '0 0 10px rgba(0, 255, 100, 0.4)'
        }}>OWNED</div>
      )}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
        transition={{ type: 'spring', duration: 0.5 }}
        style={{ fontSize: 40, textAlign: 'center', cursor: 'pointer' }}
        aria-hidden
      >
        {item.icon}
      </motion.div>
      <h3 style={{ fontWeight: 600, fontSize: 16, textAlign: 'center' }}>{item.name}</h3>
      <p style={{ color: 'var(--text-dim)', fontSize: 13, textAlign: 'center' }}>{item.description}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 18 }}>💰 {item.price}G</span>
        <motion.button
          whileHover={{ scale: owned ? 1 : 1.05 }}
          whileTap={{ scale: owned ? 1 : 0.95 }}
          className={`btn btn-sm ${owned ? 'btn-ghost' : 'btn-gold'}`}
          onClick={() => !owned && onBuy(item.id)}
          disabled={owned}
          aria-label={owned ? `${item.name} already owned` : `Buy ${item.name} for ${item.price} Gold`}
        >
          {owned ? <><Check size={14} aria-hidden /> Owned</> : <><ShoppingCart size={14} aria-hidden /> Buy</>}
        </motion.button>
      </div>
    </motion.div>
  );
}
