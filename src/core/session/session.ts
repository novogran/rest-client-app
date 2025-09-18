import 'server-only';
import { cookies } from 'next/headers';
import admin from '../firebase/admin';

export async function createSession(idToken: string) {
  const expiresIn = 60 * 5;
  const sessionCookie = await admin
    .auth()
    .createSessionCookie(idToken, { expiresIn: expiresIn * 1000 });

  const cookieStore = await cookies();
  cookieStore.set('session', sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: expiresIn,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) return null;

  try {
    const decodedToken = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);
    return { userId: decodedToken.uid };
  } catch (error) {
    throw error;
  }
}
