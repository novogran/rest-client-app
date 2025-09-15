import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MethodSelector } from './method-selector';
import { NextIntlClientProvider } from 'next-intl';

describe('MethodSelector', () => {
  it('should display the current value and call onChange on selection', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <NextIntlClientProvider
        locale="en"
        messages={{ RestClient: { methodPlaceholder: 'Method' } }}
      >
        <MethodSelector value="GET" onChange={handleChange} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('GET')).toBeInTheDocument();

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('POST'));

    expect(handleChange).toHaveBeenCalledWith('POST');
  });
});
