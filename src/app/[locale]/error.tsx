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
          <Button
            className="px-6 py-3 rounded-lg text-base bg-blue-500 transition-colors duration-300 hover:bg-blue-600 mt-4"
            onClick={reset}
          >
            {t('reset')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Error;
