import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthPage from './page';

vi.mock('@/features/auth', () => ({
  SignInForm: () => <div>Sign In Form Mock</div>,
  SignUpForm: () => <div>Sign Up Form Mock</div>,
}));

describe('AuthPage', () => {
  it('should render SignInForm for "signIn" slug', async () => {
    const ui = await AuthPage({
      params: Promise.resolve({ slug: ['signIn'] }),
    });
    render(ui);
    expect(screen.getByText('Sign In Form Mock')).toBeInTheDocument();
  });

  it('should render SignUpForm for "signUp" slug', async () => {
    const ui = await AuthPage({
      params: Promise.resolve({ slug: ['signUp'] }),
    });
    render(ui);
    expect(screen.getByText('Sign Up Form Mock')).toBeInTheDocument();
  });

  it('should default to SignInForm if slug is empty', async () => {
    const ui = await AuthPage({ params: Promise.resolve({ slug: [] }) });
    render(ui);
    expect(screen.getByText('Sign In Form Mock')).toBeInTheDocument();
  });
});
