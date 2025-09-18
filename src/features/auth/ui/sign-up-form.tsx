'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@/core/i18n/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { signUp } from '../server/actions';
import { createSignUpSchema } from '../model/definitions';

export default function SignUpForm() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [state, action, pending] = useActionState(signUp, {
    errors: undefined,
    success: false,
    message: undefined,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tZod = useTranslations('ZodErrors');
  const signUpSchema = useMemo(() => createSignUpSchema(tZod), [tZod]);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
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
            form.setError(key as keyof z.infer<typeof signUpSchema>, {
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
      <Card className="w-full max-w-md shadow-2xl shadow-primary/10 border-border/50">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            {t('signUpTitle')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('signUpDescription')}
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
                    <FormLabel
                      htmlFor="email"
                      className="text-foreground font-medium"
                    >
                      {t('emailLabel')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="email@example.com"
                        autoComplete="email"
                        type="email"
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
                    <FormLabel
                      htmlFor="password"
                      className="text-foreground font-medium"
                    >
                      {t('passwordLabel')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          placeholder={t('passwordPlaceholder')}
                          type={showPassword ? 'text' : 'password'}
                          className="pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant={'invisible'}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={18} className="text-gray-400" />
                          ) : (
                            <Eye size={18} className="text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="confirm-password"
                      className="text-foreground font-medium"
                    >
                      {t('confirmPasswordLabel')}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          placeholder={t('confirmPasswordPlaceholder')}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant={'invisible'}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} className="text-gray-400" />
                          ) : (
                            <Eye size={18} className="text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  name="show-passwords"
                  id="show-passwords"
                  checked={showPassword && showConfirmPassword}
                  onCheckedChange={(checked) => {
                    setShowPassword(!!checked);
                    setShowConfirmPassword(!!checked);
                  }}
                />
                <label
                  htmlFor="show-passwords"
                  className="text-sm text-gray-600 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t('showPasswords')}
                </label>
              </div>

              <Button type="submit" disabled={pending} className="w-full">
                {pending ? t('creatingAccount') : t('signUpButton')}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {t('haveAccount')}{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-medium text-primary"
                    onClick={() => router.push('/auth/signIn')}
                  >
                    {t('signInLink')}
                  </Button>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
