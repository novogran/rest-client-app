import { notFound } from 'next/navigation';
import { SignInForm, SignUpForm } from '@/features/auth';

export default async function AuthPage({
  params,
}: {
  params: Promise<{ slug: string[] | null | undefined }>;
}) {
  const { slug } = await params;
  const authType = (slug?.[0] || 'signIn') as 'signIn' | 'signUp';

  if (authType !== 'signIn' && authType !== 'signUp') notFound();

  return authType === 'signIn' ? <SignInForm /> : <SignUpForm />;
}
