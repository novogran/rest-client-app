import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Provider } from 'react-redux';
import { makeStore } from '@/core/store/store';
import { NextIntlClientProvider } from 'next-intl';
import VariablesPage from './page';
import messages from '../../../../messages/en.json';

vi.mock('server-only', () => ({}));

const renderWithProviders = () => {
  const store = makeStore();
  render(
    <Provider store={store}>
      <NextIntlClientProvider locale="en" messages={messages}>
        <VariablesPage />
      </NextIntlClientProvider>
    </Provider>
  );
  return { store };
};

describe('VariablesPage', () => {
  it('should render the title and add button', () => {
    renderWithProviders();
    expect(
      screen.getByRole('heading', { name: messages.Variables.title })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: messages.Variables.createVariableButton,
      })
    ).toBeInTheDocument();
  });

  it('should add a new variable row when "Add Variable" is clicked', async () => {
    const { store } = renderWithProviders();
    const user = userEvent.setup();

    await user.click(
      screen.getByRole('button', {
        name: messages.Variables.createVariableButton,
      })
    );

    expect(store.getState().variables).toHaveLength(1);
    expect(
      screen.getByPlaceholderText(messages.Variables.variableNamePlaceholder)
    ).toBeInTheDocument();
  });
});
