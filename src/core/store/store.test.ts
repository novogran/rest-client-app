import { describe, it, expect } from 'vitest';
import { makeStore, RootState, AppDispatch } from './store';

vi.mock('server-only', () => ({}));

describe('Redux Store', () => {
  it('should create a store with all reducers', () => {
    const store = makeStore();
    const state = store.getState();
    expect(state.restClient).toBeDefined();
  });

  it('should have correct types for RootState and AppDispatch', () => {
    const store = makeStore();
    const state: RootState = store.getState();
    const dispatch: AppDispatch = store.dispatch;

    expect(typeof state).toBe('object');
    expect(typeof dispatch).toBe('function');
  });
});
