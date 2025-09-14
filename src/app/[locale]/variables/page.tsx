'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const DynamicVariablesPage = dynamic(
  () => import('@/components/Variables').then((mod) => mod.VariablesPage),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
);

export default function Page() {
  return <DynamicVariablesPage />;
}
