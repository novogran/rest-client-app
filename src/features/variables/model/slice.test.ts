import { describe, it, expect, vi } from 'vitest';
import variablesReducer, {
  addVariable,
  removeVariable,
  updateVariable,
  variablesSlice,
} from './slice';

vi.mock('nanoid', () => ({ nanoid: () => 'mock-id-123' }));

const initialState = variablesSlice.getInitialState();

describe('variablesSlice', () => {
  it('should handle addVariable', () => {
    const state = variablesReducer(initialState, addVariable());
    expect(state).toHaveLength(initialState.length + 1);
    expect(state[state.length - 1].id).toBe('mock-id-123');
  });

  it('should handle removeVariable', () => {
    const stateWithVar = [{ id: '123', key: 'a', value: 'b' }];
    const state = variablesReducer(stateWithVar, removeVariable('123'));
    expect(state).toHaveLength(0);
  });

  it('should handle updateVariable', () => {
    const stateWithVar = [{ id: '123', key: 'a', value: 'b' }];
    const state = variablesReducer(
      stateWithVar,
      updateVariable({ id: '123', key: 'new-key' })
    );
    expect(state[0].key).toBe('new-key');
  });
});
