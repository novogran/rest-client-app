import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { makeStore } from '@/core/store/store';
import { BodyEditor } from './body-editor';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/en.json';
import { toast } from 'sonner';

vi.mock('server-only', () => ({}));

vi.mock('sonner', () => ({
  toast: { info: vi.fn(), success: vi.fn(), error: vi.fn() },
}));

interface MockCodeMirrorProps {
  value: string;
  onChange: (value: string) => void;
}

vi.mock('@uiw/react-codemirror', () => ({
  default: (props: MockCodeMirrorProps) => (
    <textarea
      data-testid="codemirror-mock"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  ),
}));

const renderWithProviders = () => {
  const store = makeStore();
  render(
    <Provider store={store}>
      <NextIntlClientProvider locale="en" messages={messages}>
        <BodyEditor />
      </NextIntlClientProvider>
    </Provider>
  );
  return { store };
};

describe('BodyEditor', () => {
  it('should show error toast for invalid JSON', async () => {
    renderWithProviders();
    const user = userEvent.setup();

    const textarea = screen.getByTestId('codemirror-mock');
    fireEvent.change(textarea, { target: { value: 'invalid json' } });

    await user.click(screen.getByRole('button', { name: /Prettify/i }));

    expect(toast.error).toHaveBeenCalledWith(messages.RestClient.prettifyError);
  });
});
