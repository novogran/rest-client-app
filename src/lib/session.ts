import 'server-only';
import { cookies } from 'next/headers';

export async function createSession(userToken: string, expiresAt: Date) {
  const cookieStore = await cookies();

  cookieStore.set('session', userToken, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  return session;
}
