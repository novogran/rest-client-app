import Footer from '@/components/Footer';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useTranslations } from 'next-intl';

export default function LocaleRootPage() {
  const t = useTranslations('HomePage');

  return (
    <div className="min-h-screen">
      <div className="relative flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          <LanguageSwitcher />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            {t('subtitle')}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
