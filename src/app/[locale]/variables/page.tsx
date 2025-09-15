'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const VariablesScreen = dynamic(
  () =>
    import('@/screens/variables/page.client').then((mod) => mod.VariablesPage),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  }
);

export default function Page() {
  return <VariablesScreen />;
}
