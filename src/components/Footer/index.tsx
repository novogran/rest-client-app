import { FC } from 'react';
import DeveloperInfo from '@/components/DeveloperInfo';
import { developerData } from '@/data/developerData';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const Footer: FC = () => {
  const t = useTranslations('Footer');
  return (
    <footer
      className="border-t bg-slate-50 dark:bg-slate-900"
      data-testid="footer"
    >
      <div className="container mx-auto px-4 py-8">
        <ul className="flex items-center justify-center gap-10">
          {developerData.map((value) => (
            <li key={value.id}>
              <DeveloperInfo developerData={value} />
            </li>
          ))}
          <li>
            <Link
              data-testid="rs-school-link"
              target="_blank"
              rel="noopener noreferrer"
              href={'https://rs.school/'}
            >
              <Image
                alt="rss-logo"
                src={'/icons/rss-logo.svg'}
                width={50}
                height={50}
              />
            </Link>
          </li>
        </ul>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
