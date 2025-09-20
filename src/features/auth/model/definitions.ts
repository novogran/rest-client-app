import { z } from 'zod';

type TranslationFunction = (key: string) => string;

export const createAuthFormSchema = (t: TranslationFunction) =>
  z.object({
    email: z
      .string()
      .email({ message: t('email') })
      .trim(),
    password: z
      .string()
      .min(8, { message: t('passwordMin') })
      .regex(/\p{L}/u, { message: t('passwordLetter') })
      .regex(/\p{N}/u, { message: t('passwordNumber') })
      .regex(/[^\p{L}\p{N}]/u, {
        message: t('passwordSpecial'),
      })
      .trim(),
  });

export const createSignUpSchema = (t: TranslationFunction) =>
  createAuthFormSchema(t)
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('confirmPasswordMatch'),
      path: ['confirmPassword'],
    });

export type FormState = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string[];
  };
  success?: boolean;
  message?: string;
};
