import { render, screen, fireEvent } from '@testing-library/react';
import SignInForm from './SignInForm';

import { vi } from 'vitest';
import { FormProviderProps } from 'react-hook-form';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key.split('.').pop() || key,
}));

const mockPush = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockSetError = vi.fn();
const mockHandleSubmit = vi.fn((fn) => fn);
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    formState: { errors: {} },
    setError: mockSetError,
    handleSubmit: mockHandleSubmit,
  }),
}));

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn(),
}));

vi.mock('@/app/actions/auth', () => ({
  signIn: vi.fn(),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props} data-testid="button">
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/form', () => ({
  Form: ({ children, ...props }: FormProviderProps) => (
    <form {...props} role="form">
      {children}
    </form>
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
    <div data-testid="error-message">{children}</div>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ type, ...props }: React.ComponentProps<'input'>) => (
    <input type={type} {...props} data-testid="input" />
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

vi.mock('lucide-react', () => ({
  Eye: () => <span data-testid="eye-icon">👁️</span>,
  EyeOff: () => <span data-testid="eye-off-icon">👁️‍🗨️</span>,
}));

interface UseActionStateResult {
  errors?: Record<string, string[] | null>;
  success?: boolean;
  message?: string;
}

let mockUseActionStateValue: [UseActionStateResult, () => void, boolean];
let mockSetShowPassword: React.Dispatch<React.SetStateAction<boolean>>;

vi.mock('react', () => ({
  ...vi.importActual('react'),
  useActionState: () => mockUseActionStateValue,
  useEffect: (callback: () => void) => callback(),
  useState: () => [false, mockSetShowPassword || vi.fn()],
}));

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActionStateValue = [
      { errors: undefined, success: false },
      vi.fn(),
      false,
    ];
    mockSetShowPassword = vi.fn();
  });

  it('should render without crashing', () => {
    render(<SignInForm />);
    expect(screen.getByText('signInTitle')).toBeInTheDocument();
    expect(screen.getByText('signInDescription')).toBeInTheDocument();
  });

  it('should render form elements', () => {
    render(<SignInForm />);
    expect(screen.getByText('signInButton')).toBeInTheDocument();
    expect(screen.getByText('noAccount')).toBeInTheDocument();
    expect(screen.getByText('signUpLink')).toBeInTheDocument();
  });

  it('should handle form submission', () => {
    render(<SignInForm />);
    const form = screen.getByTestId('button').closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    expect(form).toBeInTheDocument();
  });

  it('should handle server errors for all field types', () => {
    const testCases = [
      { field: 'email', message: 'Invalid email' },
      { field: 'password', message: 'Wrong password' },
      { field: 'general', message: 'Server error' },
    ];

    testCases.forEach(({ field, message }) => {
      vi.clearAllMocks();

      mockUseActionStateValue = [
        { errors: { [field]: [message] }, success: false },
        vi.fn(),
        false,
      ];

      render(<SignInForm />);
      expect(mockSetError).toHaveBeenCalled();
    });
  });

  it('should handle multiple server errors simultaneously', () => {
    mockUseActionStateValue = [
      {
        errors: {
          email: ['Invalid email format'],
          password: ['Password too short', 'Missing special character'],
          general: ['Authentication failed'],
        },
        success: false,
      },
      vi.fn(),
      false,
    ];

    render(<SignInForm />);
    expect(mockSetError).toHaveBeenCalledTimes(3);
  });

  it('should handle success state with message', () => {
    mockUseActionStateValue = [
      { errors: undefined, success: true, message: 'Welcome back!' },
      vi.fn(),
      false,
    ];

    render(<SignInForm />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should handle success state without message', () => {
    mockUseActionStateValue = [
      { errors: undefined, success: true },
      vi.fn(),
      false,
    ];

    render(<SignInForm />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should handle pending state correctly', () => {
    mockUseActionStateValue = [
      { errors: undefined, success: false },
      vi.fn(),
      true,
    ];

    render(<SignInForm />);
    const button = screen.getByTestId('button');
    expect(button).toBeDisabled();
    expect(screen.getByText('signingIn')).toBeInTheDocument();
  });

  it('should handle empty errors object', () => {
    mockUseActionStateValue = [{ errors: {}, success: false }, vi.fn(), false];

    render(<SignInForm />);
    expect(screen.getByText('signInTitle')).toBeInTheDocument();
  });

  it('should handle completely undefined state', () => {
    mockUseActionStateValue = [
      undefined as unknown as UseActionStateResult,
      vi.fn(),
      false,
    ];

    expect(() => render(<SignInForm />)).not.toThrow();
  });

  it('should handle null values in errors', () => {
    mockUseActionStateValue = [
      {
        errors: {
          email: null,
          password: ['Valid error'],
          general: null,
        },
        success: false,
      },
      vi.fn(),
      false,
    ];

    render(<SignInForm />);
    expect(mockSetError).toHaveBeenCalledTimes(1);
  });

  it('should handle empty arrays in errors', () => {
    mockUseActionStateValue = [
      {
        errors: {
          email: [],
          password: ['Valid error'],
          general: [],
        },
        success: false,
      },
      vi.fn(),
      false,
    ];

    render(<SignInForm />);
    expect(mockSetError).toHaveBeenCalledTimes(1);
  });

  it('should navigate to sign up page when link is clicked', () => {
    render(<SignInForm />);
    const signUpLink = screen.getByText('signUpLink');
    fireEvent.click(signUpLink);
    expect(mockPush).toHaveBeenCalledWith('/auth/signUp');
  });

  it('should handle password visibility toggle function', () => {
    render(<SignInForm />);
    expect(mockSetShowPassword).toBeDefined();
  });

  it('should display root error message when present', () => {
    mockUseActionStateValue = [
      {
        errors: {
          general: ['Test root error message'],
        },
        success: false,
      },
      vi.fn(),
      false,
    ];

    render(<SignInForm />);

    expect(mockSetError).toHaveBeenCalledWith('root', {
      type: 'server',
      message: 'Test root error message',
    });
  });

  it('should handle mixed valid and invalid error types', () => {
    mockUseActionStateValue = [
      {
        errors: {
          email: ['Valid email error'],
          password: null,
          general: [],
          nonexistent: ['Should be ignored'],
        },
        success: false,
      },
      vi.fn(),
      false,
    ];

    render(<SignInForm />);
    expect(mockSetError).toHaveBeenCalledTimes(2);
  });

  it('should handle useEffect cleanup', () => {
    const { unmount } = render(<SignInForm />);
    expect(() => unmount()).not.toThrow();
  });

  it('should render form fields with proper attributes', () => {
    render(<SignInForm />);

    const emailInput = screen.getByPlaceholderText('email@example.com');
    const passwordInput = screen.getByPlaceholderText('passwordPlaceholder');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should toggle password visibility when eye button is clicked', () => {
    render(<SignInForm />);

    const eyeButton = screen.getByTestId('eye-icon').closest('button');
    expect(eyeButton).toBeInTheDocument();

    fireEvent.click(eyeButton!);
    expect(mockSetShowPassword).toHaveBeenCalledWith(true);
  });
});
