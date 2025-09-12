import { describe, it, expect } from 'vitest';
import authorizationReducer, {
  signIn,
  signOut,
  selectAuthorization,
} from './authorizationSlice';
import type { RootState } from './store';

describe('authorizationSlice', () => {
  it('should return initial state', () => {
    const state = authorizationReducer(undefined, { type: 'unknown' });
    expect(state.value).toBe(false);
  });

  it('should handle signIn', () => {
    const initialState = { value: false };
    const state = authorizationReducer(initialState, signIn());
    expect(state.value).toBe(true);
  });

  it('should handle signOut', () => {
    const initialState = { value: true };
    const state = authorizationReducer(initialState, signOut());
    expect(state.value).toBe(false);
  });

  it('should select authorization value', () => {
    const mockState = {
      authorization: { value: true },
    } as RootState;

    const result = selectAuthorization(mockState);
    expect(result).toBe(true);
  });
});
