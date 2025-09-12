'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from '@/i18n/navigation';
import { AppDispatch, RootState } from '@/store/store';
import { setMethod, setUrl, executeRequest } from './restClientSlice';
import { encode } from '@/lib/url-encoding';
import { MethodSelector } from './MethodSelector';
import { HeadersEditor } from './HeadersEditor';
import { BodyEditor } from './BodyEditor';
import { ResponseViewer } from './ResponseViewer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CodeGenerator } from './CodeGenerator';
import { useTranslations } from 'next-intl';

export function RestClientPage() {
  const t = useTranslations('RestClient');
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { method, url, headers, body, response } = useSelector(
    (state: RootState) => state.restClient
  );

  const handleSendRequest = () => {
    const encodedUrl = encode(url);
    const encodedBody = body ? encode(body) : undefined;

    let pathname = `/rest-client/${method}/${encodedUrl}`;
    if (encodedBody) pathname += `/${encodedBody}`;

    const queryParams = new URLSearchParams();
    headers.forEach((header) => {
      if (header.enabled && header.key) {
        queryParams.append(header.key, header.value);
      }
    });

    const queryString = queryParams.toString();
    const finalPath = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(finalPath, { scroll: false });

    dispatch(executeRequest());
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <div className="space-y-4">
        <div className="flex gap-2">
          <MethodSelector
            value={method}
            onChange={(m) => dispatch(setMethod(m))}
          />
          <Input
            value={url}
            onChange={(e) => dispatch(setUrl(e.target.value))}
            placeholder={t('urlPlaceholder')}
          />
          <Button onClick={handleSendRequest} disabled={response.loading}>
            {t('sendButton')}
          </Button>
        </div>
        <HeadersEditor />
        <CodeGenerator />
        <BodyEditor />
      </div>
      <Separator />
      <ResponseViewer />
    </div>
  );
}
