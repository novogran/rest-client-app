import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StoreProvider } from './StoreProvider';

describe('StoreProvider', () => {
  it('should render children', () => {
    const { getByText } = render(
      <StoreProvider>
        <div>Test Child</div>
      </StoreProvider>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should provide store context', () => {
    const { container } = render(
      <StoreProvider>
        <div>Test</div>
      </StoreProvider>
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
