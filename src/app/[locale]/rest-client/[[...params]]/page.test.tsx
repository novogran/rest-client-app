import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { makeStore } from '@/core/store/store';
import { NextIntlClientProvider } from 'next-intl';
import RestClientPage from './page';
import messages from '../../../../../messages/en.json';

vi.mock('server-only', () => ({}));

vi.mock('@/features/rest-client', () => {
  const stableProcessed = {
    method: 'POST',
    url: '',
    headers: [] as {
      id: string;
      key: string;
      value: string;
      enabled: boolean;
    }[],
    body: '',
  };

  return {
    MethodSelector: () => <div data-testid="method-selector-mock" />,
    HeadersEditor: () => <div data-testid="headers-editor-mock" />,
    CodeGenerator: () => <div data-testid="code-generator-mock" />,
    BodyEditor: () => <div data-testid="body-editor-mock" />,
    ResponseViewer: () => <div data-testid="response-viewer-mock" />,
    selectProcessedRequest: vi.fn(() => stableProcessed),
  };
});
const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ params: [] }),
  useRouter: () => ({ push: mockRouterPush }),
}));
vi.mock('@/core/i18n/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

describe('RestClientPage', () => {
  it('should render all child components without crashing', () => {
    const store = makeStore();
    store.dispatch({ type: 'restClient/setMethod', payload: 'POST' });

    render(
      <Provider store={store}>
        <NextIntlClientProvider locale="en" messages={messages}>
          <RestClientPage />
        </NextIntlClientProvider>
      </Provider>
    );

    expect(
      screen.getByRole('heading', { name: messages.RestClient.title })
    ).toBeInTheDocument();
    expect(screen.getByTestId('method-selector-mock')).toBeInTheDocument();
    expect(screen.getByTestId('headers-editor-mock')).toBeInTheDocument();
    expect(screen.getByTestId('code-generator-mock')).toBeInTheDocument();
    expect(screen.getByTestId('body-editor-mock')).toBeInTheDocument();
    expect(screen.getByTestId('response-viewer-mock')).toBeInTheDocument();
  });
});
