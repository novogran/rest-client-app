'use client';

import { useEffect, use, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { initializeFromUrl } from '@/components/RestClient/restClientSlice';
import { decode } from '@/lib/url-encoding';
import { nanoid } from 'nanoid';
import { Skeleton } from '@/components/ui/skeleton';
import { AppDispatch } from '@/store/store';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type Header = { id: string; key: string; value: string; enabled: boolean };

function RestClientSkeleton() {
  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto animate-pulse">
      <h1 className="text-3xl font-bold">REST Client</h1>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[92px]" />
          <Skeleton className="h-9 flex-grow" />
          <Skeleton className="h-9 w-[64px]" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Headers</h3>
            <Skeleton className="h-8 w-25.5" />
          </div>
          <Skeleton className="h-13.5 w-full" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Code</h3>
          <Skeleton className="h-76 w-full" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Body</h3>
            <Skeleton className="h-8 w-18" />
          </div>
          <Skeleton className="h-50 w-full" />
        </div>
        <Skeleton className="h-83.5 w-full" />
      </div>
    </div>
  );
}

const DynamicRestClientPage = dynamic(
  () => import('@/components/RestClient').then((mod) => mod.RestClientPage),
  {
    ssr: false,
    loading: () => <RestClientSkeleton />,
  }
);

export default function Page({
  params,
}: {
  params: Promise<{ params?: string[] }>;
}) {
  const resolvedParams = use(params);
  const dispatch: AppDispatch = useDispatch();
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;

    if (resolvedParams.params && resolvedParams.params.length > 0) {
      isInitialized.current = true;

      const [method, encodedUrl, encodedBody] = resolvedParams.params;

      const url = decode(encodedUrl || '');
      const body = decode(encodedBody || '');

      const headers: Header[] = [];
      searchParams.forEach((value, key) => {
        headers.push({ id: nanoid(), key, value, enabled: true });
      });

      dispatch(
        initializeFromUrl({ method: method as HttpMethod, url, body, headers })
      );
    }
  }, [dispatch, resolvedParams.params, searchParams]);

  return <DynamicRestClientPage />;
}
