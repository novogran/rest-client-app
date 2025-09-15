import { z } from 'zod';

export const authFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/\p{L}/u, { message: 'Contain at least one letter.' })
    .regex(/\p{N}/u, { message: 'Contain at least one number.' })
    .regex(/[^\p{L}\p{N}]/u, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});

export const signUpSchema = authFormSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
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
