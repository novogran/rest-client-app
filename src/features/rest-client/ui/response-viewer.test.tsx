import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { makeStore } from '@/core/store/store';
import { ResponseViewer } from './response-viewer';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/en.json';

vi.mock('server-only', () => ({}));

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
