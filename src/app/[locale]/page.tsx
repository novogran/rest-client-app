import { getSession } from '@/lib/session';
import { WelcomeGuest } from '@/components/HomePage/WelcomeGuest';
import { WelcomeUser } from '@/components/HomePage/WelcomeUser';

export default async function RootPage() {
  const session = await getSession();

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center">
      {session ? <WelcomeUser /> : <WelcomeGuest />}
    </div>
  );
}
