'use client';

import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { getCurrentSession, logout } from '@/lib/actions/auth';
import { useRouter, usePathname } from '@/i18n/navigation';

export const Header = () => {
  const t = useTranslations('Header');
  const [user, setUser] = useState<unknown>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userSession = await getCurrentSession();
        setUser(userSession);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.replace('/');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 ease-in-out',
        isScrolled
          ? 'bg-primary/95 text-primary-foreground shadow-lg shadow-primary/30 backdrop-blur-md supports-[backdrop-filter]:bg-primary/80 py-2'
          : 'bg-primary text-primary-foreground py-4'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link data-testid="logo-link" href="/" className="flex items-center">
          <Image
            src="/rest-client-app-logo.png"
            width={isScrolled ? 100 : 120}
            height={isScrolled ? 100 : 120}
            alt="Logo"
            className="transition-all duration-300 ease-in-out"
          />
        </Link>

        <nav className="flex items-center gap-3">
          <LanguageSwitcher size={isScrolled ? 'sm' : 'default'} />
          {user ? (
            <Button
              size={isScrolled ? 'sm' : 'default'}
              variant="secondary"
              onClick={handleLogout}
            >
              {t('signOut')}
            </Button>
          ) : (
            <>
              <Button
                size={isScrolled ? 'sm' : 'default'}
                variant="secondary"
                asChild
              >
                <Link href="/auth/signIn">{t('signIn')}</Link>
              </Button>
              <Button
                size={isScrolled ? 'sm' : 'default'}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link href="/auth/signUp">{t('signUp')}</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
