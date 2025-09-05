import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Button } from '../ui/button';

const NotFound: FC = () => {
  const t = useTranslations('NotFound');

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-5"
      data-testid="not-found-container"
    >
      <div
        className="max-w-[600px] w-full bg-[var(--background)] rounded-xl shadow-lg shadow-blue-500/50 p-8 text-center border-l-4 border-blue-500"
        data-testid="not-found-content"
      >
        <div
          className="text-6xl my-5 animate-bounce"
          role="img"
          aria-label={t('sadEmoji')}
        >
          😢
        </div>
        <h1 className="text-blue-600 text-3xl font-bold mb-4">{t('title')}</h1>
        <p className="text-[var(--color-text)] text-lg leading-relaxed mb-6">
          {t('message')}
        </p>
        <Button
          className="px-6 py-3 rounded-lg text-base bg-blue-500 transition-colors duration-300 hover:bg-blue-600 mt-4"
          asChild
        >
          <Link href="/">{t('returnLink')}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
