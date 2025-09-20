import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HistoryCard } from './history-card';
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

describe('HistoryCard', () => {
  it('should render request data correctly', () => {
    const mockEntry: HistoryEntry = {
      id: '1',
      userId: 'u1',
      createdAt: new Date(),
      request: {
        method: 'POST',
        url: 'https://test.com',
        headers: {},
        body: '',
      },
      response: { status: 201, duration: 150, error: null },
    };

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HistoryCard entry={mockEntry} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('POST - 201')).toBeInTheDocument();
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Re-run' })).toBeInTheDocument();
  });
});
