import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { loadState, saveState } from '@/core/storage/local-storage';
import type { RootState } from '@/core/store/store';

export interface Variable {
  id: string;
  key: string;
  value: string;
}

const VARIABLES_STORAGE_KEY = 'app_variables';
const initialState: Variable[] =
  loadState<Variable[]>(VARIABLES_STORAGE_KEY) || [];

const normalizeKey = (k: string) => k.trim();

export const variablesSlice = createSlice({
  name: 'variables',
  initialState,
  reducers: {
    addVariable: (state) => {
      state.push({ id: nanoid(), key: '', value: '' });
      saveState(VARIABLES_STORAGE_KEY, state);
    },
    removeVariable: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((v) => v.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
      saveState(VARIABLES_STORAGE_KEY, state);
    },
    updateVariable: (
      state,
      action: PayloadAction<Partial<Variable> & { id: string }>
    ) => {
      const idx = state.findIndex((v) => v.id === action.payload.id);
      if (idx === -1) return;

      const next = { ...state[idx], ...action.payload };

      if (typeof action.payload.key === 'string') {
        const newKey = normalizeKey(action.payload.key);
        if (
          newKey &&
          state.some((v, i) => i !== idx && normalizeKey(v.key) === newKey)
        ) {
          next.key = state[idx].key;
        } else {
          next.key = newKey;
        }
      }

      state.splice(idx, 1, next);
      saveState(VARIABLES_STORAGE_KEY, state);
    },
  },
});

export const { addVariable, removeVariable, updateVariable } =
  variablesSlice.actions;
export const selectVariables = (state: RootState) => state.variables;
export default variablesSlice.reducer;
