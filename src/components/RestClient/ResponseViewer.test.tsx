import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store/store';
import { ResponseViewer } from './ResponseViewer';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../messages/en.json';

describe('ResponseViewer', () => {
  it('should render no response message initially', () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <NextIntlClientProvider locale="en" messages={messages}>
          <ResponseViewer />
        </NextIntlClientProvider>
      </Provider>
    );
    expect(
      screen.getByText(messages.RestClient.noResponseMessage)
    ).toBeInTheDocument();
  });
});
