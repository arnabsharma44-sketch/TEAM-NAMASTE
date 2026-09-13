'use client';
// app/(app)/home/page.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  const queryClient = useQueryClient();

  const { data: shopItems, isLoading } = useQuery({
    queryKey: ['shop'],
    queryFn: async () => {
      const res = await fetch('/api/shop');
      if (!res.ok) throw new Error('Failed to load shop');
      return res.json();
    },
  });

  const buyMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch('/api/shop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to buy item');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (err: Error) => {
      alert(err.message);
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 64, position: 'relative' }}>
      {/* High-Res Full-Width Horizontal Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '100vh',
          height: '100vw',
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          transformOrigin: 'center',
          objectFit: 'cover',
          zIndex: -1,
          pointerEvents: 'none',
          filter: 'brightness(0.9) contrast(1.25) saturate(1.1)',
        }}
      >
        <source src="/homepage-video.mp4" type="video/mp4" />
      </video>

      {/* Ambient Gradient Overlay for Superior Contrast on the Left */}
      <div 
        aria-hidden="true" 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'linear-gradient(to right, rgba(5,0,0,0.95) 0%, rgba(5,0,0,0.6) 35%, transparent 100%)', 
          zIndex: -1, 
          pointerEvents: 'none' 
        }} 
      />

      {/* Cinematic Hero */}
      <section style={{ position: 'relative', marginTop: '20vh', paddingBottom: 60, paddingLeft: '4vw' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="brand-logo neon-flicker" style={{ fontSize: 'clamp(64px, 8vw, 96px)', marginBottom: 16, display: 'inline-block', lineHeight: 1 }}>
            HELLFIRE<br/>QUESTS
          </h1>
          <p style={{ color: 'var(--text-primary)', fontSize: 20, maxWidth: 450, lineHeight: 1.6, marginBottom: 40, fontFamily: 'Inter, sans-serif', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            Step into the unknown. Face the darkness.<br/>
            Complete the quest.
          </p>
          <Link href="/quests">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 0 35px var(--red-glow-strong), inset 0 0 15px rgba(255, 26, 26, 0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-hero"
              style={{ fontSize: 16, padding: '16px 32px' }}
            >
              ENTER THE UPSIDE DOWN <span style={{ marginLeft: 12 }}>→</span>
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Featured Quests Grid (Mapped to Shop Items) */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <h2 className="font-display" style={{ fontSize: 20, color: 'var(--red-primary)' }}>
            FEATURED QUESTS
          </h2>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(255, 26, 26, 0.5), transparent)' }} />
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: 350 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {shopItems?.items?.slice(0, 8).map((item: any, i: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, borderColor: 'var(--red-primary)', boxShadow: '0 12px 35px rgba(0,0,0,0.6), 0 0 25px var(--red-glow-strong)' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="feature-card"
              >
                <div className="feature-card-image-wrap">
                  <div className="feature-card-gradient" />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.span 
                      whileHover={{ scale: 1.25, rotate: [0, -5, 5, 0] }}
                      style={{ fontSize: 48, filter: 'drop-shadow(0 0 10px rgba(255, 26, 26, 0.5)) grayscale(30%)' }}
                    >
                      {item.emoji}
                    </motion.span>
                  </div>
                </div>
                <div className="feature-card-content">
                  <h3 className="feature-card-title">{item.name}</h3>
                  <p className="feature-card-desc">{item.description}</p>
                  <div className="feature-card-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--gold)', fontSize: 15 }}>
                      <span style={{ fontSize: 16 }}>🪙</span> {item.price}G
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-primary"
                      onClick={() => buyMutation.mutate(item.id)}
                      disabled={buyMutation.isPending}
                      style={{ padding: '8px 16px', fontSize: 13 }}
                    >
                      <ShoppingCart size={14} /> BUY
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
