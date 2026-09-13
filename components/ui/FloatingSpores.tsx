'use client';
// components/ui/FloatingSpores.tsx
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type Spore = {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  opacity: number;
};

export function FloatingSpores({ count = 25 }: { count?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const [spores, setSpores] = useState<Spore[]>([]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * 3.7 + Math.random() * 5) % 100}%`,
      delay: `-${Math.random() * 20}s`,
      duration: `${14 + Math.random() * 16}s`,
      size: `${2 + Math.random() * 4}px`,
      opacity: 0.2 + Math.random() * 0.5,
    }));
    setSpores(generated);
  }, [count, shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <div className="spores-ambient-container" aria-hidden="true">
      {spores.map((spore) => (
        <div
          key={spore.id}
          className="ambient-spore"
          style={{
            left: spore.left,
            animationDelay: spore.delay,
            animationDuration: spore.duration,
            width: spore.size,
            height: spore.size,
            opacity: spore.opacity,
          }}
        />
      ))}
    </div>
  );
}
