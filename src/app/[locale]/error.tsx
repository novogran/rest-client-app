'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

const Error: FC<{
  error: Error & { digest?: string };
  reset: () => void;
}> = ({ error, reset }) => {
  const t = useTranslations('Error');
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{error.name}</CardTitle>
        </CardHeader>
        <CardContent>{error.message}</CardContent>
        <CardFooter>
          <Button onClick={reset}>{t('reset')}</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Error;
