import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import SignInForm from '@/components/SignIn/SignInForm';
import SignUpForm from '@/components/SignUp/SignUpForm';
import { notFound } from 'next/navigation';

export default async function AuthPage({
  params,
}: {
  params: Promise<{ slug: string[] | null | undefined }>;
}) {
  const { slug } = await params;
  const authType = slug?.[0] || 'signIn';

  if (authType !== 'signIn' && authType !== 'signUp') {
    notFound();
  }

  return (
    <>
      <Header />
      {authType === 'signIn' ? <SignInForm /> : <SignUpForm />}
      <Footer />
    </>
  );
}
