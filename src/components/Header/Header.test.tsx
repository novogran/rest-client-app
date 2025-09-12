import { signIn, signOut } from '@/store/authorizationSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useTranslations } from 'next-intl';
import { Header } from '.';
import { render, screen, fireEvent } from '@testing-library/react';

const mockRouter = { replace: vi.fn() };
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/about',
}));

vi.mock('@/store/hooks');
vi.mock('next-intl');
vi.mock('@/store/authorizationSlice');
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

const mockDispatch = vi.fn();
const mockUseAppSelector = vi.mocked(useAppSelector);
const mockUseTranslations = vi.mocked(useTranslations);
const mockSignIn = vi.mocked(signIn);
const mockSignOut = vi.mocked(signOut);

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppSelector.mockReturnValue(false);

    const mockT = vi.fn((key: string) => {
      const translations: Record<string, string> = {
        'Header.signIn': 'Sign In',
        'Header.signOut': 'Sign Out',
        'Header.signUp': 'Sign Up',
      };
      return translations[key] || key;
    }) as unknown as ReturnType<typeof useTranslations>;

    mockT.rich = vi.fn();
    mockT.markup = vi.fn();
    mockT.raw = vi.fn();
    mockT.has = vi.fn();

    mockUseTranslations.mockReturnValue(mockT);
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
  });

  it('renders logo with link', () => {
    render(<Header />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByTestId('logo-link')).toHaveAttribute('href', '/');
  });

  it('shows sign in and sign up buttons when not authorized', () => {
    mockUseAppSelector.mockReturnValue(false);
    render(<Header />);

    expect(screen.getByText('signIn')).toBeInTheDocument();
    expect(screen.getByText('signUp')).toBeInTheDocument();
  });

  it('shows sign out button when authorized', () => {
    mockUseAppSelector.mockReturnValue(true);
    render(<Header />);

    expect(screen.getByText('signOut')).toBeInTheDocument();
  });

  it('renders a link to the sign-in page when not authorized', () => {
    mockUseAppSelector.mockReturnValue(false);
    render(<Header />);
    const signInLink = screen.getByRole('link', { name: 'signIn' });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/signIn');
  });

  it('dispatches signOut action when sign out button clicked', () => {
    mockUseAppSelector.mockReturnValue(true);
    render(<Header />);

    const signOutButton = screen.getByText('signOut');
    if (!signOutButton) throw new Error('Sign Out button not found');

    fireEvent.click(signOutButton);
    expect(mockDispatch).toHaveBeenCalledWith(signOut());
  });

  it('applies correct styles when scrolled', async () => {
    render(<Header />);

    fireEvent.scroll(window, { target: { scrollY: 100 } });
    const header = await screen.findByRole('banner');

    expect(header).toHaveClass('bg-primary/95');
    expect(header).toHaveClass('backdrop-blur-md');
    expect(header).toHaveClass('shadow-lg');
  });

  it('changes button size on scroll when authorized', async () => {
    mockUseAppSelector.mockReturnValue(true);
    render(<Header />);

    const signOutButton = screen.getByRole('button', { name: 'signOut' });
    expect(signOutButton).toHaveClass('h-9');

    fireEvent.scroll(window, { target: { scrollY: 100 } });
    const updatedSignOutButton = await screen.findByRole('button', {
      name: 'signOut',
    });

    expect(updatedSignOutButton).toHaveClass('h-8');
  });
});
