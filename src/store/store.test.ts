import { describe, it, expect } from 'vitest';
import { store } from './store';
import type { RootState, AppDispatch } from './store';

describe('store', () => {
  it('should create store with authorization reducer', () => {
    const state = store.getState();
    expect(state.authorization.value).toBe(false);
  });

  it('should have correct RootState type', () => {
    const state: RootState = store.getState();
    expect(state.authorization.value).toBeDefined();
  });

  it('should have correct AppDispatch type', () => {
    const dispatch: AppDispatch = store.dispatch;
    expect(typeof dispatch).toBe('function');
  });
});
