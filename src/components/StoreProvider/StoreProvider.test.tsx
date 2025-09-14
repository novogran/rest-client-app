import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSelector } from 'react-redux';
import StoreProvider from './index';
import * as storeModule from '@/lib/store/store';

const makeStoreSpy = vi.spyOn(storeModule, 'makeStore');

function TestConsumer() {
  const restClientState = useSelector(
    (state: storeModule.RootState) => state.restClient
  );
  return <div>Method: {restClientState.method}</div>;
}

describe('StoreProvider', () => {
  beforeEach(() => {
    makeStoreSpy.mockClear();
  });

  it('should render its children', () => {
    render(
      <StoreProvider>
        <p>Test Child</p>
      </StoreProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should create the store and provide it to children', () => {
    render(
      <StoreProvider>
        <TestConsumer />
      </StoreProvider>
    );

    expect(screen.getByText('Method: GET')).toBeInTheDocument();
  });

  it('should create the store only once on initial render', () => {
    const { rerender } = render(
      <StoreProvider>
        <p>Child</p>
      </StoreProvider>
    );

    expect(makeStoreSpy).toHaveBeenCalledTimes(1);

    rerender(
      <StoreProvider>
        <p>New Child</p>
      </StoreProvider>
    );

    expect(makeStoreSpy).toHaveBeenCalledTimes(1);
  });
});
