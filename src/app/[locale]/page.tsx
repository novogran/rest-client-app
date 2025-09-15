import { getSession } from '@/core/session/session';
import { HomeScreen } from '@/screens/home/page.client';

export default async function RootPage() {
  const session = await getSession();
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center">
      <HomeScreen isAuth={!!session} />
    </div>
  );
}
