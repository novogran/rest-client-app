import { Button } from '@/components/ui/button';
import './globals.css';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
};

export default async function GlobalNotFound() {
  const t = await getTranslations('NotFound');

  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-secondary via-background to-background">
        <div className="flex h-screen w-full flex-col items-center justify-center text-center p-4">
          <div className="w-full max-w-md p-8 sm:p-12 bg-card/80 backdrop-blur-lg rounded-2xl shadow-2xl shadow-primary/10 border border-border/50 animate-float">
            <div
              className="group text-8xl md:text-9xl mb-8 transition-transform duration-300 ease-out hover:scale-125"
              role="img"
              aria-label={t('sadEmoji')}
            >
              <span className="group-hover:animate-shake inline-block">😢</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">{t('message')}</p>
            <Button
              asChild
              size="default"
              className="transition-transform active:scale-95 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
            >
              <Link href="/">{t('returnLink')}</Link>
            </Button>
          </div>

          <div className="absolute bottom-8 text-center">
            <p className="text-sm text-muted-foreground/50">Rest Client App</p>
          </div>
        </div>
      </body>
    </html>
  );
}
