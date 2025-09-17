import { getHistory } from '@/features/history';
import { HistoryList } from '@/features/history';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const history = await getHistory();
  const t = await getTranslations('History');

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <HistoryList history={history} />
    </div>
  );
}
