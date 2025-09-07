import { describe, it, expect } from 'vitest';
import Footer from '@/components/Footer';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
describe('Footer', () => {
  it('should render Footer', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          Footer: {
            copyright: '© 2025 REST API client. All rights reserved.',
          },
        }}
      >
        <Footer />
      </NextIntlClientProvider>
    );
    expect(screen.getByTestId('footer')).toBeVisible();
  });
  it('should contain 4 elements in unordered list', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          Footer: {
            copyright: '© 2025 REST API client. All rights reserved.',
          },
        }}
      >
        <Footer />
      </NextIntlClientProvider>
    );
    expect(screen.getAllByRole('listitem').length).toBe(4);
  });

  it('should not be empty', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          Footer: {
            copyright: '© 2025 REST API client. All rights reserved.',
          },
        }}
      >
        <Footer />
      </NextIntlClientProvider>
    );
    expect(screen.getByText(/2025/)).toBeVisible();
  });
});
