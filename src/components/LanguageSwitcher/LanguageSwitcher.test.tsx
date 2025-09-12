import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { vi, describe, it, expect } from 'vitest';
import { LanguageSwitcher } from './index';

const mockRouter = { replace: vi.fn() };
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/about',
}));

describe('LanguageSwitcher Component', () => {
  it('should render, open dropdown, and call router on selection', async () => {
    const user = userEvent.setup();

    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          Common: {
            LanguageSwitcher: {
              label: 'Choose language',
              placeholder: 'Select language',
            },
          },
        }}
      >
        <LanguageSwitcher />
      </NextIntlClientProvider>
    );

    const trigger = screen.getByRole('combobox', { name: /choose language/i });
    expect(within(trigger).getByText('EN')).toBeInTheDocument();

    await user.click(trigger);

    const optionRU = await screen.findByRole('option', { name: 'RU' });
    await user.click(optionRU);

    expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).toHaveBeenCalledWith('/about', { locale: 'ru' });
  });
});
