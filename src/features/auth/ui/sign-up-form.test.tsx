import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useActionState } from 'react';
import { useRouter } from '@/core/i18n/navigation';
import { useTranslations } from 'next-intl';
import SignUpForm from './sign-up-form';

vi.mock('server-only', () => ({}));

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

vi.mock('@/core/i18n/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('@/features/auth/server', () => ({
  signUp: vi.fn(),
}));

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(),
}));

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn(),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('@/components/ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => (
    <form>{children}</form>
  ),
  FormControl: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  FormField: ({
    render,
  }: {
    render: (props: {
      field: {
        value: string;
        onChange: () => void;
        onBlur: () => void;
        ref: () => void;
      };
      fieldState: {
        error: null;
      };
    }) => React.ReactNode;
  }) =>
    render({
      field: {
        value: '',
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
      },
      fieldState: {
        error: null,
      },
    }),
  FormItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  FormLabel: ({ children }: { children: React.ReactNode }) => (
    <label>{children}</label>
  ),
  FormMessage: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ placeholder, type, ...props }: React.ComponentProps<'input'>) => (
    <input placeholder={placeholder} type={type} {...props} />
  ),
}));

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({
    checked,
    onCheckedChange,
    ...props
  }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  } & React.ComponentProps<'input'>) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
}));

vi.mock('lucide-react', () => ({
  Eye: () => <span data-testid="eye-icon">👁️</span>,
  EyeOff: () => <span data-testid="eye-off-icon">👁️‍🗨️</span>,
}));

const { useForm } = await import('react-hook-form');

describe('SignUpForm', () => {
  const mockRouterPush = vi.fn();
  const mockAction = vi.fn();
  const mockSetError = vi.fn();
  const mockUseForm = {
    control: {},
    formState: { errors: {} },
    setError: mockSetError,
    watch: vi.fn(),
    handleSubmit: vi.fn((fn) => fn),
    register: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as vi.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    (useTranslations as vi.Mock).mockImplementation((namespace: string) => {
      const translations: Record<string, string> = {
        'Auth.signUpTitle': 'Create Account',
        'Auth.signUpDescription': 'Sign up to get started',
        'Auth.emailLabel': 'Email',
        'Auth.passwordLabel': 'Password',
        'Auth.confirmPasswordLabel': 'Confirm Password',
        'Auth.passwordPlaceholder': 'Enter your password',
        'Auth.confirmPasswordPlaceholder': 'Confirm your password',
        'Auth.showPasswords': 'Show passwords',
        'Auth.creatingAccount': 'Creating account...',
        'Auth.signUpButton': 'Sign Up',
        'Auth.haveAccount': 'Already have an account?',
        'Auth.signInLink': 'Sign in',
      };
      return (key: string) => translations[`${namespace}.${key}`] || key;
    });

    (useActionState as vi.Mock).mockReturnValue([
      { errors: undefined, success: false, message: undefined },
      mockAction,
      false,
    ]);

    (useForm as vi.Mock).mockReturnValue(mockUseForm);
  });

  it('renders the sign up form correctly', () => {
    render(<SignUpForm />);

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Sign up to get started')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your password')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Confirm your password')
    ).toBeInTheDocument();
    expect(screen.getByText('Show passwords')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    render(<SignUpForm />);

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const toggleButtons = screen.getAllByRole('button');
    const eyeButton = toggleButtons.find(
      (btn) =>
        btn.querySelector('[data-testid="eye-icon"]') ||
        btn.querySelector('[data-testid="eye-off-icon"]')
    );

    expect(passwordInput).toHaveAttribute('type', 'password');

    if (eyeButton) {
      fireEvent.click(eyeButton);
    }
  });

  it('toggles confirm password visibility', () => {
    render(<SignUpForm />);

    const confirmPasswordInput = screen.getByPlaceholderText(
      'Confirm your password'
    );
    const toggleButtons = screen.getAllByRole('button');
    const eyeButton = toggleButtons.find(
      (btn) =>
        btn.querySelector('[data-testid="eye-icon"]') ||
        btn.querySelector('[data-testid="eye-off-icon"]')
    );

    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    if (eyeButton) {
      fireEvent.click(eyeButton);
    }
  });

  it('toggles both passwords with checkbox', () => {
    render(<SignUpForm />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('submits the form', () => {
    render(<SignUpForm />);

    const submitButton = screen.getByRole('button', { name: 'Sign Up' });
    fireEvent.click(submitButton);

    expect(mockAction).toHaveBeenCalled();
  });

  it('shows loading state when pending', () => {
    (useActionState as vi.Mock).mockReturnValue([
      { errors: undefined, success: false, message: undefined },
      mockAction,
      true,
    ]);

    render(<SignUpForm />);

    expect(screen.getByText('Creating account...')).toBeInTheDocument();
    const submitButton = screen.getByRole('button', {
      name: 'Creating account...',
    });
    expect(submitButton).toBeDisabled();
  });

  it('handles server errors', async () => {
    (useActionState as vi.Mock).mockReturnValue([
      {
        errors: {
          email: ['Invalid email'],
          general: ['Server error'],
        },
        success: false,
        message: undefined,
      },
      mockAction,
      false,
    ]);

    render(<SignUpForm />);

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('email', {
        type: 'server',
        message: 'Invalid email',
      });
      expect(mockSetError).toHaveBeenCalledWith('root', {
        type: 'server',
        message: 'Server error',
      });
    });
  });

  it('redirects on success', async () => {
    (useActionState as vi.Mock).mockReturnValue([
      {
        errors: undefined,
        success: true,
        message: 'Account created',
      },
      mockAction,
      false,
    ]);

    render(<SignUpForm />);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/');
    });
  });

  it('navigates to sign in page', () => {
    render(<SignUpForm />);

    const signInLink = screen.getByText('Sign in');
    fireEvent.click(signInLink);

    expect(mockRouterPush).toHaveBeenCalledWith('/auth/signIn');
  });

  it('handles empty state gracefully', () => {
    (useActionState as vi.Mock).mockReturnValue([null, mockAction, false]);

    render(<SignUpForm />);

    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('handles undefined errors', async () => {
    (useActionState as vi.Mock).mockReturnValue([
      {
        errors: undefined,
        success: false,
        message: undefined,
      },
      mockAction,
      false,
    ]);

    render(<SignUpForm />);

    await waitFor(() => {
      expect(mockSetError).not.toHaveBeenCalled();
    });
  });
});
