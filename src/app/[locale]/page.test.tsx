import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RootPage from './page';
import * as session from '@/core/session/session';
import { ComponentProps } from 'react';

vi.mock('server-only', () => ({}));
vi.mock('@/core/session/session');
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));
vi.mock('@/core/i18n/navigation', () => ({
  Link: (props: ComponentProps<'a'>) => <a {...props} />,
}));

const mockedGetSession = vi.mocked(session.getSession);

describe('RootPage', () => {
  it('should render guest view when not authenticated', async () => {
    mockedGetSession.mockResolvedValue(null);
    const ui = await RootPage();
    render(ui);
    expect(
      screen.getByRole('link', { name: 'signInLink' })
    ).toBeInTheDocument();
  });

  it('should render user view when authenticated', async () => {
    mockedGetSession.mockResolvedValue({ userId: '123' });
    const ui = await RootPage();
    render(ui);
    expect(
      screen.getByRole('link', { name: 'restClientLink' })
    ).toBeInTheDocument();
  });
});
