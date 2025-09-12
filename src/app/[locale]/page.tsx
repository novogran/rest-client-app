import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';

export default function LocaleRootPage() {
  const t = useTranslations('HomePage');
  return (
    <div className="relative flex min-h-screen flex-col items-center p-4">
      <Header />
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">
          {t('title')}
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
          {t('subtitle')}
        </p>
      </div>
      <Footer />
    </div>
  );
}
