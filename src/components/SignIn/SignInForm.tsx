'use client';

import { signIn } from '@/app/actions/auth';
import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authFormSchema } from '@/lib/definitions';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@/i18n/navigation';
import { Eye, EyeOff } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export default function SignInForm() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [state, action, pending] = useActionState(signIn, {
    errors: undefined,
    success: false,
    message: undefined,
  });

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([key, messages]) => {
        if (messages && messages.length > 0) {
          if (key === 'general') {
            form.setError('root', {
              type: 'server',
              message: messages.join(', '),
            });
          } else {
            form.setError(key as keyof z.infer<typeof authFormSchema>, {
              type: 'server',
              message: messages.join(', '),
            });
          }
        }
      });
    }

    if (state?.success) {
      router.push('/');
    }
  }, [state, form, router]);

  return (
    <div className="min-h-200 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t('signInTitle')}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t('signInDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form action={action} className="space-y-6">
              {form.formState.errors.root && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                  <p className="text-sm text-destructive text-center">
                    {form.formState.errors.root.message}
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      {t('emailLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      {t('passwordLabel')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder={t('passwordPlaceholder')}
                          type={showPassword ? 'text' : 'password'}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={18} className="text-gray-400" />
                          ) : (
                            <Eye size={18} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={pending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-300"
              >
                {pending ? t('signingIn') : t('signInButton')}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {t('noAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/auth/signUp')}
                    className="text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
                  >
                    {t('signUpLink')}
                  </button>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
