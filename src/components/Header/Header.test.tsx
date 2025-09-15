import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '.';
import { vi } from 'vitest';

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('@/app/actions/auth', () => ({
  getCurrentSession: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
}));

const mockT = vi.fn((key: string) => {
  const translations: Record<string, string> = {
    'Header.signIn': 'Sign In',
    'Header.signOut': 'Sign Out',
    'Header.signUp': 'Sign Up',
  };
  return translations[key] || key;
});

vi.mock('next-intl', () => ({
  useTranslations: () => mockT,
}));

vi.mock('next/image', () => ({
  default: (props: {
    src: string;
    width: number;
    height: number;
    alt: string;
    className: string;
  }) => (
    <img
      src={props.src}
      width={props.width}
      height={props.height}
      alt={props.alt}
      className={props.className}
    />
  ),
}));

vi.mock('../shared/language-switcher', () => ({
  LanguageSwitcher: () => (
    <div data-testid="language-switcher">Language Switcher</div>
  ),
}));

import { getCurrentSession, logout } from '@/app/actions/auth';

const mockGetCurrentSession = getCurrentSession as vi.Mock;
const mockLogout = logout as vi.Mock;

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetCurrentSession.mockResolvedValue(null);
    mockLogout.mockResolvedValue(undefined);

    mockPush.mockClear();
    mockReplace.mockClear();

    mockT.mockClear();
    mockT.mockImplementation((key: string) => {
      const translations: Record<string, string> = {
        'Header.signIn': 'Sign In',
        'Header.signOut': 'Sign Out',
        'Header.signUp': 'Sign Up',
      };
      return translations[key] || key;
    });
  });

  it('renders logo with link', async () => {
    render(<Header />);

    await waitFor(() => {
      expect(screen.getByAltText('Logo')).toBeInTheDocument();
    });

    const logoLink = screen.getByTestId('logo-link');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('shows sign in and sign up buttons when user is null', async () => {
    mockGetCurrentSession.mockResolvedValue(null);
    render(<Header />);

    await waitFor(() => {
      expect(screen.getByText('signIn')).toBeInTheDocument();
      expect(screen.getByText('signUp')).toBeInTheDocument();
    });
  });

  it('shows sign out button when user is authenticated', async () => {
    mockGetCurrentSession.mockResolvedValue('mock-token');
    render(<Header />);

    await waitFor(() => {
      expect(screen.getByText('signOut')).toBeInTheDocument();
    });
  });

  it('calls logout and redirects when sign out button clicked', async () => {
    mockGetCurrentSession.mockResolvedValue('mock-token');
    render(<Header />);

    await waitFor(() => {
      expect(screen.getByText('signOut')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('signOut'));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  it('navigates to sign in page when sign in button clicked', async () => {
    mockGetCurrentSession.mockResolvedValue(null);
    render(<Header />);

    await waitFor(() => {
      expect(screen.getByText('signIn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('signIn'));

    expect(mockPush).toHaveBeenCalledWith('/auth/signIn');
  });

  it('navigates to sign up page when sign up button clicked', async () => {
    mockGetCurrentSession.mockResolvedValue(null);
    render(<Header />);

    await waitFor(() => {
      expect(screen.getByText('signUp')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('signUp'));

    expect(mockPush).toHaveBeenCalledWith('/auth/signUp');
  });

  it('handles errors when fetching user session', async () => {
    mockGetCurrentSession.mockRejectedValue(new Error('Failed to fetch'));
    render(<Header />);

    await waitFor(() => {
      expect(screen.getByText('signIn')).toBeInTheDocument();
      expect(screen.getByText('signUp')).toBeInTheDocument();
    });
  });

  it('renders language switcher', async () => {
    render(<Header />);

    await waitFor(() => {
      expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    });
  });
});
