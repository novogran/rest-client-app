'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams } from 'next/navigation';
import { nanoid } from 'nanoid';
import { AppDispatch, RootState } from '@/core/store/store';
import {
  initializeFromUrl,
  executeRequest,
  setMethod,
  setUrl,
} from '@/features/rest-client';
import { applyVariables, useRouter } from '@/core';
import { encode, decode } from '@/core/http/url-encoding';
import { useAppSelector } from '@/core/store/hooks';
import { selectVariables } from '@/features/variables';
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

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type Header = { id: string; key: string; value: string; enabled: boolean };

export default function RestClientPage() {
  const t = useTranslations('RestClient');
  const dispatch: AppDispatch = useDispatch();
  const searchParams = useSearchParams();
  const routeParams = useParams<{ params?: string[] }>();
  const isInitialized = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized.current) return;
    const p = routeParams?.params || [];
    if (p.length > 0) {
      isInitialized.current = true;
      const [method, encodedUrl, encodedBody] = p;
      const url = decode(encodedUrl || '');
      const body = decode(encodedBody || '');

      const headers: Header[] = [];
      searchParams.forEach((value, key) => {
        headers.push({
          id: nanoid(),
          key,
          value: String(value),
          enabled: true,
        });
      });

      dispatch(
        initializeFromUrl({ method: method as HttpMethod, url, body, headers })
      );
    }
  }, [dispatch, routeParams, searchParams]);

  const { method, url, headers, body, response } = useSelector(
    (s: RootState) => s.restClient
  );
  const variables = useAppSelector(selectVariables);

  const handleSendRequest = () => {
    const processedUrl = applyVariables(url, variables);
    const processedHeaders = headers.map((h) => ({
      ...h,
      value: applyVariables(h.value, variables),
    }));
    const processedBody = applyVariables(body, variables);

    const encodedUrl = encode(processedUrl);
    const encodedBody = processedBody ? encode(processedBody) : undefined;

    let pathname = `/rest-client/${method}/${encodedUrl}`;
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
        method,
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
        <BodyEditor />
      </div>
      <Separator />
      <ResponseViewer />
    </div>
  );
}
