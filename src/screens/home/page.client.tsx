'use client';

import dynamic from 'next/dynamic';

const Guest = dynamic(
  () => import('./welcome-guest').then((m) => m.WelcomeGuest),
  { ssr: false }
);
const User = dynamic(
  () => import('./welcome-user').then((m) => m.WelcomeUser),
  { ssr: false }
);

export function HomeScreen({ isAuth }: { isAuth: boolean }) {
  return isAuth ? <User /> : <Guest />;
}
