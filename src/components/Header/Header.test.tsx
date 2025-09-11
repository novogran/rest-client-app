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

  it('dispatches signIn action when sign in button clicked', () => {
    mockUseAppSelector.mockReturnValue(false);
    render(<Header />);

    fireEvent.click(screen.getByText('signIn'));
    expect(mockDispatch).toHaveBeenCalledWith(mockSignIn());
  });

  it('dispatches signOut action when sign out button clicked', () => {
    mockUseAppSelector.mockReturnValue(true);
    render(<Header />);

    fireEvent.click(screen.getByText('signOut'));
    expect(mockDispatch).toHaveBeenCalledWith(mockSignOut());
  });

  it('applies correct styles when scrolled', () => {
    render(<Header />);

    Object.defineProperty(window, 'scrollY', { value: 20, writable: true });
    fireEvent.scroll(window);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-blue-500/95');
    expect(header).toHaveClass('backdrop-blur-md');
    expect(header).toHaveClass('shadow-lg');
  });
});
