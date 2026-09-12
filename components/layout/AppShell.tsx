'use client';
// components/layout/AppShell.tsx
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Sword, ShoppingBag, History, Package, LogOut, User } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useCharacterStore } from '@/store/character';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/quests',    label: 'Quests',     icon: Sword },
  { href: '/shop',      label: 'Shop',       icon: ShoppingBag },
  { href: '/history',   label: 'History',    icon: History },
  { href: '/inventory', label: 'Inventory',  icon: Package },
  { href: '/profile',   label: 'Profile',    icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useUIStore((s) => s.theme);
  const setCharacter = useCharacterStore((s) => s.setCharacter);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/api/me');
      if (res.status === 401) { router.push('/login'); return null; }
      if (!res.ok) throw new Error('Failed to load');
      return res.json();
    },
  });

  useEffect(() => {
    if (data?.character) setCharacter(data.character);
  }, [data, setCharacter]);

  useEffect(() => {
    if (!isLoading && data && !data.character && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [isLoading, data, pathname, router]);

  const isOnboarding = pathname === '/onboarding';

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    // Clear ALL cached queries so no previous user's data leaks to the next session
    queryClient.clear();
    // Reset Zustand character store
    setCharacter(null as never);
    router.push('/login');
  }

  return (
    <div className="app-shell" data-theme={theme}>
      {!isOnboarding && (
        <>
      {/* Desktop sidebar */}
      <nav className="sidebar" aria-label="Main navigation">
        <div style={{ marginBottom: 24 }}>
          <h1 className="font-display" style={{ fontSize: 22, color: 'var(--gold)', letterSpacing: 1 }}>
            ⚔️ Life RPG
          </h1>
        </div>
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link${pathname.startsWith(href) ? ' active' : ''}`}
            aria-current={pathname.startsWith(href) ? 'page' : undefined}
          >
            <Icon size={18} aria-hidden />
            {label}
          </Link>
        ))}
        <div style={{ marginTop: 'auto' }}>
          <button
            className="nav-link"
            onClick={logout}
            style={{ width: '100%', color: 'var(--red)' }}
            aria-label="Log out"
          >
            <LogOut size={18} aria-hidden /> Logout
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              fontSize: 10, fontWeight: 600, padding: '4px 12px',
              color: pathname.startsWith(href) ? 'var(--indigo-light)' : 'var(--text-dim)',
            }}
            aria-label={label}
            aria-current={pathname.startsWith(href) ? 'page' : undefined}
          >
            <Icon size={22} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>
        </>
      )}

      <main className="main-content">{children}</main>
    </div>
  );
}
