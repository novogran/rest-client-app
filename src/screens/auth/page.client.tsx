'use client';

import { SignInForm, SignUpForm } from '@/features/auth';

export function AuthScreen({ authType }: { authType: 'signIn' | 'signUp' }) {
  return authType === 'signIn' ? <SignInForm /> : <SignUpForm />;
}
