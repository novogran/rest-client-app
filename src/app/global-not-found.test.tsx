import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import GlobalNotFound from './global-not-found';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

describe('GlobalNotFound Page', () => {
  it('should render the main heading and a link to the home page', async () => {
    const ui = await GlobalNotFound();
    render(ui);

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument();
    const homeLink = screen.getByRole('link', { name: 'returnLink' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
