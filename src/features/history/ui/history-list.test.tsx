import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HistoryList } from './history-list';
import { NextIntlClientProvider } from 'next-intl';
import type { ComponentProps } from 'react';
import type { HistoryEntry } from '../server/actions';

vi.mock('@/core/i18n/navigation', () => ({
  Link: (props: ComponentProps<'a'>) => <a {...props} />,
}));

const messages = {
  History: {
    rerunButton: 'Re-run',
    noHistoryMessage: 'No history',
    goToClientLink: 'Go to Client',
  },
};

describe('HistoryList', () => {
  it('should render a list of cards when history is not empty', () => {
    const mockHistory: HistoryEntry[] = [
      {
        id: '1',
        userId: 'u1',
        createdAt: new Date(),
        request: { method: 'GET', url: 'url1', headers: {} },
        response: { status: 200, duration: 100, error: null },
      },
      {
        id: '2',
        userId: 'u1',
        createdAt: new Date(),
        request: { method: 'POST', url: 'url2', headers: {} },
        response: { status: 404, duration: 200, error: null },
      },
    ];

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HistoryList history={mockHistory} />
      </NextIntlClientProvider>
    );

    expect(screen.getAllByRole('link', { name: /Re-run/i })).toHaveLength(2);
  });

  it('should render a placeholder when history is empty', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HistoryList history={[]} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('No history')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Go to Client/i })
    ).toBeInTheDocument();
  });
});
