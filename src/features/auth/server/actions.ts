'use server';

import {
  createAuthFormSchema,
  createSignUpSchema,
  FormState,
} from '@/features/auth/model/definitions';
import {
  createSession,
  deleteSession,
  getSession,
} from '@/core/session/session';
import {
  registerWithEmailAndPassword,
  logInWithEmailAndPassword,
} from '@/core/firebase/client';
import { getTranslations } from 'next-intl/server';

export async function signUp(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const t = await getTranslations('ZodErrors');
  const signUpSchema = createSignUpSchema(t);
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

    const token = await data.user.getIdToken();
    await createSession(token);

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
  const t = await getTranslations('ZodErrors');
  const authFormSchema = createAuthFormSchema(t);
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

    const token = await data.user.getIdToken();
    await createSession(token);

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
  try {
    const session = await getSession();
    return session;
  } catch (error) {
    console.error('Session verification failed:', error);
    throw error;
  }
}
