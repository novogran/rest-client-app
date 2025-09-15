'use client';

import { routing } from '@/core/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GlobeIcon } from 'lucide-react';
import { useLanguageSwitcher } from './useLanguageSwitcher';
import { useTranslations } from 'next-intl';

export function LanguageSwitcher({ size = 'sm' }: { size?: 'sm' | 'default' }) {
  const t = useTranslations('Common.LanguageSwitcher');
  const { locale, isPending, onSelectChange } = useLanguageSwitcher();

  return (
    <Select
      onValueChange={onSelectChange}
      defaultValue={locale}
      disabled={isPending}
    >
      <SelectTrigger
        className="w-[80px] transition-all duration-300 bg-background text-foreground cursor-pointer"
        aria-label={t('label')}
        size={size}
      >
        <div className="flex items-center gap-2">
          <GlobeIcon className="h-4 w-4 text-slate-500" />
          <SelectValue placeholder={t('placeholder')} />
        </div>
      </SelectTrigger>

      <SelectContent>
        {routing.locales.map((cur) => (
          <SelectItem key={cur} value={cur}>
            {cur.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
