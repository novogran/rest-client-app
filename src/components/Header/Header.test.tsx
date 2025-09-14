import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '.';
import { vi } from 'vitest';
import type { ImageProps } from 'next/image';
import { getCurrentSession, logout } from '@/app/actions/auth';

vi.mock('@/app/actions/auth', () => ({
  getCurrentSession: vi.fn(),
  logout: vi.fn(),
}));

const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  usePathname: () => '/',
}));

const mockT = vi.fn();
vi.mock('next-intl', () => ({
  useTranslations: () => mockT,
}));

vi.mock('next/image', () => ({
  default: (props: ImageProps) => {
    const { src, alt, width, height, className } = props;
    return (
      <img
        src={typeof src === 'string' ? src : ''}
        alt={alt}
        width={Number(width)}
        height={Number(height)}
        className={className}
      />
    );
  },
}));

vi.mock('../LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher-mock" />,
}));

const mockGetCurrentSession = vi.mocked(getCurrentSession);
const mockLogout = vi.mocked(logout);

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentSession.mockResolvedValue(undefined);
    mockT.mockImplementation((key: string) => key);
  });

  it('should render the logo and link to home', async () => {
    render(<Header />);
    const logo = await screen.findByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('should show sign-in and sign-up buttons when user is not authenticated', async () => {
    render(<Header />);
    expect(
      await screen.findByRole('link', { name: /signIn/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('link', { name: /signUp/i })
    ).toBeInTheDocument();
  });

  it('should show the sign-out button when user is authenticated', async () => {
    mockGetCurrentSession.mockResolvedValue('mock-user-session');
    render(<Header />);
    expect(
      await screen.findByRole('button', { name: /signOut/i })
    ).toBeInTheDocument();
  });

  it('should navigate to /auth/signIn on sign-in button click', async () => {
    render(<Header />);
    const signInLink = await screen.findByRole('link', { name: /signIn/i });
    fireEvent.click(signInLink);
    expect(signInLink).toHaveAttribute('href', '/auth/signIn');
  });

  it('should call logout action and redirect on sign-out button click', async () => {
    mockGetCurrentSession.mockResolvedValue('mock-user-session');
    render(<Header />);
    const signOutButton = await screen.findByRole('button', {
      name: /signOut/i,
    });

    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  it('should apply scrolled styles and change button size on scroll', async () => {
    mockGetCurrentSession.mockResolvedValue('mock-user-session');
    render(<Header />);

    const header = await screen.findByRole('banner');
    const signOutButton = screen.getByRole('button', { name: /signOut/i });

    expect(header).not.toHaveClass('bg-primary/95');
    expect(signOutButton).toHaveClass('h-9');
    expect(signOutButton).not.toHaveClass('h-8');

    fireEvent.scroll(window, { target: { scrollY: 100 } });

    await waitFor(() => {
      expect(header).toHaveClass('bg-primary/95');
      expect(signOutButton).toHaveClass('h-8');
      expect(signOutButton).not.toHaveClass('h-9');
    });
  });
});
