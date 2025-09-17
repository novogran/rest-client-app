import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MainLayout from './layout';

vi.mock('@/components/layout/header', () => ({
  Header: () => <header>Mock Header</header>,
}));
vi.mock('@/components/layout/footer', () => ({
  default: () => <footer>Mock Footer</footer>,
}));
vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div>Mock Toaster</div>,
}));
vi.mock('../store-provider', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('next-intl/server', () => ({
  getMessages: vi.fn().mockResolvedValue({}),
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
  setRequestLocale: vi.fn(),
}));

describe('MainLayout', () => {
  it('should render Header, Footer, and children', async () => {
    const ui = await MainLayout({
      children: <div>Test Page Content</div>,
      params: Promise.resolve({ locale: 'en' }),
    });
    render(ui);

    expect(screen.getByText('Mock Header')).toBeInTheDocument();
    expect(screen.getByText('Test Page Content')).toBeInTheDocument();
    expect(screen.getByText('Mock Footer')).toBeInTheDocument();
  });
});
