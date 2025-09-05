'use client';

import { routing } from '@/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GlobeIcon } from 'lucide-react';
import { useLanguageSwitcher } from './use-language-switcher';
import { useTranslations } from 'next-intl';

export function LanguageSwitcher() {
  const t = useTranslations('Common.LanguageSwitcher');
  const { locale, isPending, onSelectChange } = useLanguageSwitcher();

  return (
    <Select
      onValueChange={onSelectChange}
      defaultValue={locale}
      disabled={isPending}
    >
      <SelectTrigger className="w-[80px]" aria-label={t('label')}>
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
