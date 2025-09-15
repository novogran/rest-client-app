import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

const AuthScreen = dynamic(() =>
  import('@/screens/auth/page.client').then((m) => m.AuthScreen)
);

export default async function AuthPage({
  params,
}: {
  params: Promise<{ slug: string[] | null | undefined }>;
}) {
  const { slug } = await params;
  const authType = (slug?.[0] || 'signIn') as 'signIn' | 'signUp';

  if (authType !== 'signIn' && authType !== 'signUp') notFound();

  return <AuthScreen authType={authType} />;
}
