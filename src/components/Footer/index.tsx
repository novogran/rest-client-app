import { FC } from 'react';
import DeveloperInfo from '@/components/DeveloperInfo';
import { developerData } from '@/data/developerData';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const Footer: FC = () => {
  const t = useTranslations('Footer');
  return (
    <section className="py-20">
      <footer data-testid="footer">
        <ul className="flex items-center justify-center gap-10">
          {developerData.map((value) => (
            <li key={value.id}>
              <DeveloperInfo developerData={value} />
            </li>
          ))}
          <li>
            <Link
              data-testid="rs-school-link"
              target="blank"
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
        <div className="text-muted-foreground mr-10 mt-10 flex flex-column gap-4 border-t pt-8 text-sm font-medium md:flex-row-reverse md:items-center">
          <p>{t('copyright')}</p>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
