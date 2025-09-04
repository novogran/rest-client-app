import { FC } from 'react';
import DeveloperInfo from '@/components/DeveloperInfo';
import { developerData } from '@/data/developerData';
import Link from 'next/link';
import Image from 'next/image';

const Footer: FC = () => {
  return (
    <section className="py-20">
      <footer>
        <ul className="flex items-center justify-center gap-10">
          {developerData.map((value) => (
            <li key={value.id}>
              <DeveloperInfo developerData={value} />
            </li>
          ))}
          <li>
            <Link target="blank" href={'https://rs.school/'}>
              <Image
                alt="rss-logo"
                src={'/icons/rss-logo.svg'}
                width={50}
                height={50}
              />
            </Link>
          </li>
        </ul>
        <div className="text-muted-foreground mt-10 flex flex-column gap-4 border-t pt-8 text-sm font-medium md:flex-row-reverse md:items-center">
          <p>© 2025 REST API client. All rights reserved.</p>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
