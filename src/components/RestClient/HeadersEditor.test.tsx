import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store/store';
import { HeadersEditor } from './HeadersEditor';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../messages/en.json';

const renderWithProviders = () => {
  const store = makeStore();
  render(
    <Provider store={store}>
      <NextIntlClientProvider locale="en" messages={messages}>
        <HeadersEditor />
      </NextIntlClientProvider>
    </Provider>
  );
  return { store };
};

describe('HeadersEditor', () => {
  it('should add a new header row when "Add Header" is clicked', async () => {
    const { store } = renderWithProviders();
    const user = userEvent.setup();

    expect(store.getState().restClient.headers).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: /Add Header/i }));
    expect(store.getState().restClient.headers).toHaveLength(1);
    expect(
      screen.getByPlaceholderText(messages.RestClient.headerKeyPlaceholder)
    ).toBeInTheDocument();
  });

  it('should display "No headers added" message when there are no headers', () => {
    renderWithProviders();
    expect(
      screen.getByText(messages.RestClient.noHeadersMessage)
    ).toBeInTheDocument();
  });
});
