'use client';
// components/layout/Providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ToastContainer } from '@/components/ui/ErrorToast';
import { LevelUpOverlay } from '@/components/game/LevelUpOverlay';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 30000 } },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <LevelUpOverlay />
      <ToastContainer />
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="xp-announcer" />
    </QueryClientProvider>
  );
}
