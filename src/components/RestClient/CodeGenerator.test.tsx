import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store/store';
import { CodeGenerator } from './CodeGenerator';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../messages/en.json';

vi.mock('httpsnippet', () => ({
  HTTPSnippet: vi.fn().mockImplementation(() => ({
    convert: (target: string) => `Generated snippet for ${target}`,
  })),
}));

interface MockCodeMirrorProps {
  value: string;
  onChange: (value: string) => void;
}

vi.mock('@uiw/react-codemirror', () => ({
  default: (props: MockCodeMirrorProps) => (
    <textarea readOnly value={props.value} />
  ),
}));

describe('CodeGenerator', () => {
  it('should show a placeholder message when URL is empty', () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <NextIntlClientProvider locale="en" messages={messages}>
          <CodeGenerator />
        </NextIntlClientProvider>
      </Provider>
    );

    expect(
      screen.getByText(messages.RestClient.noCodeMessage)
    ).toBeInTheDocument();
  });
});
