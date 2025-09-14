'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export function WelcomeUser() {
  const t = useTranslations('HomePage');
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">
        {t('welcomeBack')}
      </h1>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild size="lg">
          <Link href="/rest-client">{t('restClientLink')}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/variables">{t('variablesLink')}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/history">{t('historyLink')}</Link>
        </Button>
      </div>
    </div>
  );
}
