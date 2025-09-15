import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';
import { makeStore, AppStore } from '@/core/store/store';
import { RestClientPage } from './page.client';
import messages from '../../../messages/en.json';
import * as actions from '@/features/rest-client/server/actions';

vi.mock('server-only', () => ({}));

vi.mock('@/features/rest-client/server/actions');
const executeRequestMock = vi.mocked(actions.executeRequestServer);

vi.mock('@uiw/react-codemirror', () => ({
  default: (props: { value: string; onChange?: (value: string) => void }) => (
    <textarea
      data-testid="codemirror-mock"
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value)}
    />
  ),
}));

vi.mock('httpsnippet', () => ({
  HTTPSnippet: vi.fn().mockImplementation(() => ({
    convert: () => 'Generated code snippet',
  })),
}));

export const mockRouterPush = vi.fn();

vi.mock('@/core/i18n/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: vi.fn(),
  }),
}));

function renderRestClient() {
  const store = makeStore();
  render(
    <Provider store={store}>
      <NextIntlClientProvider locale="en" messages={messages}>
        <RestClientPage />
      </NextIntlClientProvider>
    </Provider>
  );
  return { store };
}

describe('RestClient Feature', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let store: AppStore;

  beforeEach(() => {
    user = userEvent.setup();
    const rendered = renderRestClient();
    store = rendered.store;
    executeRequestMock.mockClear();
  });

  it('should update the URL in the store when user types', async () => {
    const urlInput = screen.getByPlaceholderText('https://api.example.com');
    await user.type(urlInput, 'https://my.api.com');
    expect(store.getState().restClient.url).toBe('https://my.api.com');
  });

  it('should update the method in the store on selection', async () => {
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('POST'));
    expect(store.getState().restClient.method).toBe('POST');
  });

  it('should add, update, and remove headers', async () => {
    await user.click(screen.getByText('Add Header'));
    expect(store.getState().restClient.headers).toHaveLength(1);

    await user.type(screen.getByPlaceholderText('Key'), 'Authorization');
    await user.type(screen.getByPlaceholderText('Value'), 'Bearer 123');

    expect(store.getState().restClient.headers[0]).toEqual(
      expect.objectContaining({ key: 'Authorization', value: 'Bearer 123' })
    );

    await user.click(screen.getByTestId('delete-header-button'));
    expect(store.getState().restClient.headers).toHaveLength(0);
  });

  it('should prettify valid JSON in the body editor', async () => {
    const bodyEditorSection = screen.getByTestId('body-editor-section');
    const bodyEditorTextarea =
      within(bodyEditorSection).getByTestId('codemirror-mock');
    const prettifyButton = within(bodyEditorSection).getByRole('button', {
      name: /Prettify/i,
    });

    const uglyJson = '{"a":1,"b":2}';

    fireEvent.change(bodyEditorTextarea, { target: { value: uglyJson } });

    await user.click(prettifyButton);

    const expectedBody = JSON.stringify({ a: 1, b: 2 }, null, 2);
    expect(store.getState().restClient.body).toBe(expectedBody);
  });

  it('should dispatch the thunk, call the action, and display the response', async () => {
    executeRequestMock.mockResolvedValue({
      status: 200,
      statusText: 'OK',
      data: '{"success":true}',
      headers: {},
      duration: 123,
      error: null,
    });

    await user.type(
      screen.getByPlaceholderText('https://api.example.com'),
      'https://test.com'
    );

    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(executeRequestMock).toHaveBeenCalledTimes(1);
    const statusElement = await screen.findByText(/Status: 200 OK/i);
    expect(statusElement).toBeInTheDocument();
    expect(store.getState().restClient.response.data).toBe('{"success":true}');
  });

  it('should only include enabled headers in the URL when sending the request', async () => {
    await user.click(screen.getByRole('button', { name: /Add Header/i }));
    await user.type(screen.getByPlaceholderText('Key'), 'Content-Type');
    await user.type(screen.getByPlaceholderText('Value'), 'application/json');
    await user.click(screen.getByRole('button', { name: /Add Header/i }));
    const keyInputs = screen.getAllByPlaceholderText('Key');
    const valueInputs = screen.getAllByPlaceholderText('Value');
    await user.type(keyInputs[1], 'X-Debug');
    await user.type(valueInputs[1], 'true');

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    await user.type(
      screen.getByPlaceholderText('https://api.example.com'),
      'https://test.com'
    );
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(mockRouterPush).toHaveBeenCalledTimes(2);
    const finalPath = mockRouterPush.mock.calls[0][0] as string;

    expect(finalPath).toContain('/rest-client/GET/aHR0cHM6Ly90ZXN0LmNvbQ');
  });

  it('should include the encoded body in the URL path when the body is present', async () => {
    const testBody = '{"test": "body"}';
    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('POST'));

    await user.type(
      screen.getByPlaceholderText('https://api.example.com'),
      'https://api.test'
    );

    const bodyEditorSection = screen.getByTestId('body-editor-section');
    const bodyEditorTextarea =
      within(bodyEditorSection).getByTestId('codemirror-mock');

    fireEvent.change(bodyEditorTextarea, {
      target: { value: testBody },
    });

    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(mockRouterPush).toHaveBeenCalledTimes(3);

    const finalPath = mockRouterPush.mock.calls[0][0] as string;
    expect(finalPath).toContain(`/rest-client/GET/aHR0cHM6Ly90ZXN0LmNvbQ`);
  });
});
