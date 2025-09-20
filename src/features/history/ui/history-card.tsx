'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/core/i18n/navigation';
import { Button } from '@/components/ui/button';
import { encode } from '@/core/http/url-encoding';
import { HistoryEntry } from '../server/actions';
import { AlertTriangle, ArrowDown, ArrowUp, Clock } from 'lucide-react';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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

  const isError = entry.response.error !== null;

  return (
    <div
      className={`rounded-lg p-4 flex justify-between items-center hover:bg-muted/50 transition-colors`}
    >
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={`font-bold text-sm px-2 py-0.5 rounded-md text-white bg-opacity-10 ${isError ? 'bg-destructive' : 'bg-green-500'}`}
          >
            {entry.response.status
              ? `${method} - ${entry.response.status}`
              : method}
          </span>
          <p
            className="text-muted-foreground font-mono text-sm truncate"
            title={entry.request.url}
          >
            {entry.request.url}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground/80 mt-2">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {entry.response.duration ?? 0}ms
          </span>
          <span className="flex items-center gap-1">
            <ArrowUp size={12} />
            {formatBytes(entry.request.size)}
          </span>
          <span className="flex items-center gap-1">
            <ArrowDown size={12} />
            {formatBytes(entry.response.size)}
          </span>
        </div>

        {entry.response.error && (
          <div className="mt-2 text-xs text-destructive flex items-center gap-1">
            <AlertTriangle size={12} />
            <p className="truncate" title={entry.response.error}>
              {entry.response.error}
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground/70 mt-2">
          {entry.createdAt.toLocaleString()}
        </p>
      </div>
      <Button asChild className="ml-4 flex-shrink-0">
        <Link href={finalPath}>{t('rerunButton')}</Link>
      </Button>
    </div>
  );
}
