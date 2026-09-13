// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/Providers';

export const metadata: Metadata = {
  title: 'Hellfire Quests',
  description: 'Turn real-world tasks into an RPG progression system. Complete Quests, earn XP and Gold, level up your character.',
  openGraph: {
    title: 'Hellfire Quests',
    description: 'Gamified productivity — earn XP for real-world achievements.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
