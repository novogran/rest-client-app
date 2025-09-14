'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { encode } from '@/lib/url-encoding';
import type { HistoryEntry } from '@/app/actions/history';

function getStatusColor(status: number | null): string {
  if (status === null) return 'text-yellow-500';
  if (status >= 200 && status < 300) return 'text-green-500';
  if (status >= 400 && status < 500) return 'text-orange-500';
  if (status >= 500) return 'text-red-500';
  return 'text-muted-foreground';
}

export function HistoryCard({ entry }: { entry: HistoryEntry }) {
  const t = useTranslations('History');
  const { method, url, headers, body } = entry.request;

  const encodedUrl = encode(url);
  const encodedBody = body ? encode(body) : undefined;
  let pathname = `/rest-client/${method}/${encodedUrl}`;
  if (encodedBody) pathname += `/${encodedBody}`;
  const queryParams = new URLSearchParams(headers);
  const queryString = queryParams.toString();
  const finalPath = queryString ? `${pathname}?${queryString}` : pathname;

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-4 mb-1">
          <span
            className={`font-bold text-sm ${getStatusColor(entry.response.status)}`}
          >
            {entry.response.status
              ? `${entry.request.method} - ${entry.response.status}`
              : entry.request.method}
          </span>
          <span className="text-xs text-muted-foreground">
            {entry.response.duration ? `${entry.response.duration}ms` : ''}
          </span>
        </div>
        <p className="text-muted-foreground truncate" title={entry.request.url}>
          {entry.request.url}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          {entry.createdAt.toLocaleString()}
        </p>
      </div>
      <Button asChild className="ml-4 flex-shrink-0">
        <Link href={finalPath}>{t('rerunButton')}</Link>
      </Button>
    </div>
  );
}
