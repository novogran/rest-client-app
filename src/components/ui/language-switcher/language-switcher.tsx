// TODO: Refactor to use Shadcn's <Select> component once it's integrated.
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition, SVGProps } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const t = useTranslations('Common.LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div
      className={`
        relative inline-flex items-center justify-center rounded-md text-sm font-medium
        border border-slate-200 bg-white text-slate-900 shadow-sm
        dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50
        transition-colors hover:bg-slate-100 dark:hover:bg-slate-800
        focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-400
        focus-within:ring-offset-2 dark:focus-within:ring-slate-500 dark:focus-within:ring-offset-slate-900
        ${isPending ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      <GlobeIcon className="h-4 w-4 ml-2 text-slate-500 dark:text-slate-400" />

      <select
        onChange={handleChange}
        defaultValue={locale}
        disabled={isPending}
        className="
          absolute inset-0 h-full w-full cursor-pointer opacity-0
          appearance-none
        "
        aria-label={t('label')}
      >
        {routing.locales.map((cur) => (
          <option key={cur} value={cur}>
            {cur.toUpperCase()}
          </option>
        ))}
      </select>

      <span className="py-2 pl-2 pr-1 font-semibold">
        {locale.toUpperCase()}
      </span>

      <ChevronDownIcon
        className="
          h-4 w-4 mr-2 text-slate-500 dark:text-slate-400
          pointer-events-none
        "
      />
    </div>
  );
}
