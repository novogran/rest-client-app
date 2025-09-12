import { render, screen } from '@testing-library/react';
import MyError from '@/app/[locale]/error';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';

describe('Error', () => {
  const user = userEvent.setup();
  it('renders error message', () => {
    const error: Error = new Error('Something went wrong');
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          Error: {
            reset: 'Reset',
          },
        }}
      >
        <MyError error={error} reset={vi.fn()} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('calls reset when retry is clicked', async () => {
    const resetMock = vi.fn();
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          Error: {
            reset: 'Reset',
          },
        }}
      >
        <MyError error={new Error('Something went wrong')} reset={resetMock} />
      </NextIntlClientProvider>
    );

    await user.click(screen.getByText('Reset'));
    expect(resetMock).toHaveBeenCalled();
  });
});
