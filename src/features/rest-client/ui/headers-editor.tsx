'use client';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/core/store/store';
import { addHeader, removeHeader, updateHeader } from '../model/slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function HeadersEditor() {
  const t = useTranslations('RestClient');
  const dispatch: AppDispatch = useDispatch();
  const headers = useSelector((state: RootState) => state.restClient.headers);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{t('headersTitle')}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch(addHeader())}
        >
          {t('addHeaderButton')}
        </Button>
      </div>
      <div className="space-y-2 rounded-md border p-2">
        {headers.map((header) => (
          <div key={header.id} className="flex items-center gap-2">
            <Checkbox
              name={`header-enabled-${header.id}`}
              checked={header.enabled}
              onCheckedChange={(checked) =>
                dispatch(updateHeader({ id: header.id, enabled: !!checked }))
              }
            />
            <Input
              name={`header-key-${header.id}`}
              placeholder={t('headerKeyPlaceholder')}
              value={header.key}
              onChange={(e) =>
                dispatch(updateHeader({ id: header.id, key: e.target.value }))
              }
            />
            <Input
              name={`header-value-${header.id}`}
              placeholder={t('headerValuePlaceholder')}
              value={header.value}
              onChange={(e) =>
                dispatch(updateHeader({ id: header.id, value: e.target.value }))
              }
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(removeHeader(header.id))}
              data-testid="delete-header-button"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {headers.length === 0 && (
          <p className="text-sm text-muted-foreground p-2 text-center">
            {t('noHeadersMessage')}
          </p>
        )}
      </div>
    </div>
  );
}
