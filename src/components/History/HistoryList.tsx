'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { HistoryCard } from './HistoryCard';
import type { HistoryEntry } from '@/app/actions/history';

export function HistoryList({ history }: { history: HistoryEntry[] }) {
  const t = useTranslations('History');

  if (history.length === 0) {
    return (
      <div className="text-center p-8 border-dashed border-2 rounded-lg">
        <p className="text-muted-foreground">{t('noHistoryMessage')}</p>
        <Button asChild className="mt-4">
          <Link href="/rest-client">{t('goToClientLink')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((entry) => (
        <HistoryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
