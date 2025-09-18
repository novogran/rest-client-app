// src/app/[locale]/rest-client/[[...params]]/page.tsx
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams } from 'next/navigation';
import { nanoid } from 'nanoid';
import { AppDispatch, RootState } from '@/core/store/store';
import {
  initializeFromUrl,
  executeRequest,
  setMethod,
  setUrl,
  selectProcessedRequest,
  commitProcessedRequest,
} from '@/features/rest-client';
import { encode, decode } from '@/core/http/url-encoding';
import { useAppSelector } from '@/core/store/hooks';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  MethodSelector,
  HeadersEditor,
  CodeGenerator,
  BodyEditor,
  ResponseViewer,
} from '@/features/rest-client';
import { useRouter } from '@/core';
import { methodSupportsBody } from '@/features/rest-client/model/http';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type Header = { id: string; key: string; value: string; enabled: boolean };

export default function RestClientPage() {
  const t = useTranslations('RestClient');
  const dispatch: AppDispatch = useDispatch();
  const searchParams = useSearchParams();
  const routeParams = useParams<{ params?: string[] }>();
  const router = useRouter();

  useEffect(() => {
    const p = routeParams?.params || [];
    if (p.length === 0) return;

    const [method, encodedUrl, encodedBody] = p;
    const url = decode(encodedUrl || '');
    const body = decode(encodedBody || '');

    const headers: Header[] = [];
    searchParams.forEach((value, key) => {
      headers.push({ id: nanoid(), key, value: String(value), enabled: true });
    });

    dispatch(
      initializeFromUrl({
        method: (method as HttpMethod) || 'GET',
        url,
        body,
        headers,
      })
    );
  }, [dispatch, routeParams, searchParams]);

  const { method, url, response } = useSelector((s: RootState) => s.restClient);
  const processedRequest = useAppSelector(selectProcessedRequest);

  const handleSendRequest = () => {
    const {
      method: processedMethod,
      url: processedUrl,
      headers: processedHeaders,
      body: processedBody,
    } = processedRequest;

    dispatch(
      commitProcessedRequest({
        url: processedUrl,
        headers: processedHeaders,
        body: processedBody,
      })
    );

    const encodedUrl = encode(processedUrl);
    const encodedBody = processedBody ? encode(processedBody) : undefined;

    let pathname = `/rest-client/${processedMethod}/${encodedUrl}`;
    if (encodedBody) pathname += `/${encodedBody}`;

    const queryParams = new URLSearchParams();
    processedHeaders.forEach((h) => {
      if (h.enabled && h.key) queryParams.append(h.key, h.value);
    });

    const finalPath = queryParams.toString()
      ? `${pathname}?${queryParams}`
      : pathname;
    router.push(finalPath, { scroll: false });

    dispatch(
      executeRequest({
        url: processedUrl,
        headers: processedHeaders,
        body: processedBody,
        method: processedMethod,
      })
    );
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
        {methodSupportsBody(method) && <BodyEditor />}
      </div>
      <Separator />
      <ResponseViewer />
    </div>
  );
}
