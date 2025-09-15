import { describe, it, expect } from 'vitest';
import Footer from '@/components/layout/footer';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

const messages = {
  Footer: {
    copyright: '© 2025 REST API client. All rights reserved.',
  },
  developers: {
    '0': { name: 'Dev Name 1', description: 'Dev Desc 1' },
    '1': { name: 'Dev Name 2', description: 'Dev Desc 2' },
    '2': { name: 'Dev Name 3', description: 'Dev Desc 3' },
  },
};

describe('Footer', () => {
  it('should render Footer', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer />
      </NextIntlClientProvider>
    );
    expect(screen.getByTestId('footer')).toBeVisible();
  });

  it('should contain 4 elements in unordered list', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer />
      </NextIntlClientProvider>
    );
    expect(screen.getAllByRole('listitem').length).toBe(4);
  });

  it('should not be empty', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer />
      </NextIntlClientProvider>
    );
    expect(screen.getByText(messages.Footer.copyright)).toBeVisible();
  });
});
