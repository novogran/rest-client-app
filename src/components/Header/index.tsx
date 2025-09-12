'use client';

import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { signIn, signOut } from '@/store/authorizationSlice';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export const Header = () => {
  const t = useTranslations('Header');
  const authorization = useAppSelector((state) => state.authorization.value);
  const dispatch = useAppDispatch();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          {authorization ? (
            <Button
              size={isScrolled ? 'default' : 'lg'}
              className={
                'transition-all duration-300 bg-white text-blue-600 hover:bg-blue-50'
              }
              onClick={() => {
                dispatch(signOut());
              }}
            >
              <Link href="/">{t('signOut')}</Link>
            </Button>
          ) : (
            <>
              <Button
                size={isScrolled ? 'default' : 'lg'}
                className="transition-all duration-300 cursor-pointer bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  dispatch(signIn());
                }}
              >
                <Link href="/signIn">{t('signIn')}</Link>
              </Button>
              <Button
                variant={'secondary'}
                size={isScrolled ? 'default' : 'lg'}
                className={cn(
                  'transition-all duration-300',
                  isScrolled
                    ? 'bg-blue-500/95 border-white text-white hover:bg-white hover:text-blue-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                <Link href="/signIn_signUp">{t('signUp')}</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
