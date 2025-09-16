import { useTranslations } from 'next-intl';

export default function RootPage() {
  const t = useTranslations('HomePage');
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl">
          {t('title')}
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
          {t('subtitle')}
        </p>
      </div>
    </div>
  );
}
