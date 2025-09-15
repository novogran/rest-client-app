import { render } from '@testing-library/react';
import AuthPage from './page';
import { notFound } from 'next/navigation';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@/components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('@/components/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

vi.mock('@/components/SignIn/SignInForm', () => ({
  default: () => <div data-testid="signin-form">SignIn Form</div>,
}));

vi.mock('@/components/SignUp/SignUpForm', () => ({
  default: () => <div data-testid="signup-form">SignUp Form</div>,
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('AuthPage', () => {
  it('should render SignInForm for signIn slug', async () => {
    const params = Promise.resolve({ slug: ['signIn'] });

    const { getByTestId } = render(await AuthPage({ params }));

    expect(getByTestId('header')).toBeInTheDocument();
    expect(getByTestId('signin-form')).toBeInTheDocument();
    expect(getByTestId('footer')).toBeInTheDocument();
  });

  it('should render SignUpForm for signUp slug', async () => {
    const params = Promise.resolve({ slug: ['signUp'] });

    const { getByTestId } = render(await AuthPage({ params }));

    expect(getByTestId('header')).toBeInTheDocument();
    expect(getByTestId('signup-form')).toBeInTheDocument();
    expect(getByTestId('footer')).toBeInTheDocument();
  });

  it('should render SignInForm for empty slug array', async () => {
    const params = Promise.resolve({ slug: [] });

    const { getByTestId } = render(await AuthPage({ params }));

    expect(getByTestId('header')).toBeInTheDocument();
    expect(getByTestId('signin-form')).toBeInTheDocument();
    expect(getByTestId('footer')).toBeInTheDocument();
  });

  it('should call notFound for invalid slug', async () => {
    const params = Promise.resolve({ slug: ['invalid'] });

    await AuthPage({ params });

    expect(notFound).toHaveBeenCalled();
  });

  it('should handle undefined slug', async () => {
    const params = Promise.resolve({ slug: undefined });

    const { getByTestId } = render(await AuthPage({ params }));

    expect(getByTestId('header')).toBeInTheDocument();
    expect(getByTestId('signin-form')).toBeInTheDocument();
    expect(getByTestId('footer')).toBeInTheDocument();
  });

  it('should handle null slug', async () => {
    const params = Promise.resolve({ slug: null });

    const { getByTestId } = render(await AuthPage({ params }));

    expect(getByTestId('header')).toBeInTheDocument();
    expect(getByTestId('signin-form')).toBeInTheDocument();
    expect(getByTestId('footer')).toBeInTheDocument();
  });
});
