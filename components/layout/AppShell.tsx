'use client';
// components/layout/AppShell.tsx
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Sword, ShoppingBag, History, Package, LogOut, User, Home, Search, Bell } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useCharacterStore } from '@/store/character';
import Image from 'next/image';

const NAV = [
  { href: '/home',      label: 'Home',         icon: Home },
  { href: '/dashboard', label: 'Player Sheet', icon: LayoutDashboard },
  { href: '/quests',    label: 'Campaigns',    icon: Sword },
  { href: '/shop',      label: 'Starcourt Mall',icon: ShoppingBag },
  { href: '/history',   label: 'Hawkins Logs', icon: History },
  { href: '/inventory', label: 'The Backpack', icon: Package },
  { href: '/profile',   label: 'Party Profile',icon: User },
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
    queryClient.clear();
    setCharacter(null as never);
    router.push('/login');
  }

  const character = data?.character;

  if (isOnboarding) {
    return <div className="app-shell">{children}</div>;
  }

  return (
    <div className="app-shell" data-theme={theme}>
      {/* Background Layers */}
      <div className="app-bg-layer" aria-hidden="true" />
      <div className="app-bg-overlay" aria-hidden="true" />
      <div className="app-bg-vignette" aria-hidden="true" />

      {/* Desktop sidebar */}
      <nav className="sidebar" aria-label="Main navigation">
        <div style={{ marginBottom: 32, padding: '0 8px' }}>
          <Link href="/home">
            <div className="brand-logo" style={{ cursor: 'pointer' }}>
              HELLFIRE<br/>QUESTS
            </div>
          </Link>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--red-primary)' : 'inherit', transition: 'color 0.2s ease' }} aria-hidden />
                {label}
              </Link>
            );
          })}
        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <button
            className="nav-link"
            onClick={logout}
            style={{ width: '100%', color: 'var(--text-muted)' }}
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
              fontSize: 10, fontWeight: 600, padding: '8px 12px',
              color: pathname.startsWith(href) ? 'var(--red-primary)' : 'var(--text-secondary)',
            }}
            aria-label={label}
            aria-current={pathname.startsWith(href) ? 'page' : undefined}
          >
            <Icon size={22} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>

      {/* Main Content Area */}
      <div className="main-content-area">
        {/* Top Navigation Bar */}
        <header className="top-bar">
          <div className="search-bar-container">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for a quest, campaign, or character..."
            />
          </div>
          
          <div className="top-bar-actions">
            <button className="btn-ghost" style={{ padding: 8, borderRadius: '50%' }}>
              <Bell size={20} />
            </button>
            <div className="gold-display">
              <span style={{ color: 'var(--gold)' }}>🪙</span> Gold <span className="gold-value">{character?.gold || 0}</span>
            </div>
            <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <User size={20} color="var(--red-primary)" />
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, paddingBottom: 64 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
