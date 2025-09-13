'use client';

import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '../shared/language-switcher';
import { getCurrentSession, logout } from '@/app/actions/auth';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

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
        const userToken = await getCurrentSession();
        setUser(userToken);
      } catch (error) {
        if (error instanceof Error) setUser(null);
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
          ? 'bg-blue-500/95 backdrop-blur-md supports-[backdrop-filter]:bg-blue-500/80 shadow-lg shadow-blue-500/30 py-2'
          : 'bg-blue-500 py-4'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link data-testid="logo-link" href="/">
            <Image
              src="/rest-client-app-logo.png"
              width={isScrolled ? 120 : 150}
              height={isScrolled ? 120 : 150}
              alt="Logo"
              className="transition-all duration-300 ease-in-out"
            />
          </Link>
        </div>

        <nav className="flex items-center gap-3">
          <LanguageSwitcher />
          {user ? (
            <Button
              size={isScrolled ? 'default' : 'lg'}
              className={
                'transition-all duration-300 bg-white text-blue-600 hover:bg-blue-50'
              }
              onClick={handleLogout}
            >
              {t('signOut')}
            </Button>
          ) : (
            <>
              <Button
                size={isScrolled ? 'default' : 'lg'}
                className="transition-all duration-300 cursor-pointer bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => router.push('/auth/signIn')}
              >
                {t('signIn')}
              </Button>
              <Button
                variant={'secondary'}
                size={isScrolled ? 'default' : 'lg'}
                className={cn(
                  'transition-all duration-300 cursor-pointer',
                  isScrolled
                    ? 'bg-blue-500/95 border-white text-white hover:bg-white hover:text-blue-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
                onClick={() => router.push('/auth/signUp')}
              >
                {t('signUp')}
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
