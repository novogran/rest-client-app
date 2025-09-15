'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/core/i18n/navigation';

export function WelcomeGuest() {
  const t = useTranslations('HomePage');
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">
        {t('title')}
      </h1>
      <p className="mt-6 text-lg ...">{t('subtitle')}</p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild size="lg">
          <Link href="/auth/signIn">{t('signInLink')}</Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/auth/signUp">{t('signUpLink')}</Link>
        </Button>
      </div>
    </div>
  );
}
