import { Button } from '@/components/ui/button';
import { Link } from '@/core/i18n/navigation';
import { getSession } from '@/core/session/session';
import { getTranslations } from 'next-intl/server';

export default async function RootPage() {
  const session = await getSession();
  const t = await getTranslations('HomePage');
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center">
      {!!session ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold">{t('welcomeBack')}</h1>
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
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p className="mt-6 text-lg">{t('subtitle')}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/auth/signIn">{t('signInLink')}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/signUp">{t('signUpLink')}</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
