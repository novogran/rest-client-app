'use server';

import { authFormSchema, FormState, signUpSchema } from '@/lib/definitions';
import {
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
} from '@/firebase/firebase';
import { createSession, deleteSession, getSession } from '../../lib/session';

export async function signUp(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const data = await registerWithEmailAndPassword(email, password);

    if (!data?.user) {
      return {
        errors: {
          general: ['Registration failed'],
        },
      };
    }

    const token = await data.user.getIdTokenResult();
    const expiresAt = new Date(token.expirationTime);

    await createSession(token.token, expiresAt);

    return {
      success: true,
      message: 'Registration successful!',
    };
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        errors: {
          general: [error.message],
        },
      };
    return { errors: undefined };
  }
}

export async function signIn(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = authFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const data = await logInWithEmailAndPassword(email, password);

    if (!data) {
      return {
        errors: {
          general: ['Authentication failed'],
        },
      };
    }

    const token = await data.user.getIdTokenResult();
    const expiresAt = new Date(token.expirationTime);

    await createSession(token.token, expiresAt);

    return {
      success: true,
      message: 'Login successful!',
    };
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        errors: {
          general: [error.message],
        },
      };
    return { errors: undefined };
  }
}

export async function logout() {
  await deleteSession();
}

export async function getCurrentSession() {
  const session = await getSession();
  return session;
}
