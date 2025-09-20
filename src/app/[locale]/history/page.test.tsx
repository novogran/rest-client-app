import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HistoryPage from './page';
import { HistoryEntry } from '@/features/history';

vi.mock('@/features/history', () => ({
  getHistory: vi.fn().mockResolvedValue([]),
  HistoryList: ({ history }: { history: HistoryEntry[] }) => (
    <div data-testid="history-list">{history.length} items</div>
  ),
}));
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

vi.mock('@/components/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('HistoryPage', () => {
  it('should render the title and the history list', async () => {
    const ui = await HistoryPage();
    render(ui);

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument();
    expect(screen.getByTestId('history-list')).toHaveTextContent('0 items');
  });
});
