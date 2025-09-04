import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { LanguageSwitcher } from './language-switcher';

const mockRouter = {
  replace: vi.fn(),
};
const mockPathname = '/some-page';

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
}));

const renderComponent = (locale: 'en' | 'ru') => {
  const messages = {
    Common: { LanguageSwitcher: { label: 'Choose language' } },
  };

  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LanguageSwitcher />
    </NextIntlClientProvider>
  );
};

describe('LanguageSwitcher', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render and display the current locale correctly', () => {
    renderComponent('en');

    const select = screen.getByLabelText('Choose language');
    expect(select).toBeInTheDocument();

    expect(select).toHaveValue('en');
  });

  it('should call router.replace with the new locale on change', async () => {
    renderComponent('en');
    const user = userEvent.setup();

    const select = screen.getByLabelText('Choose language');

    await user.selectOptions(select, 'ru');

    expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).toHaveBeenCalledWith(mockPathname, {
      locale: 'ru',
    });
  });
});
