import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { loadState, saveState } from '@/lib/localStorage';
import type { RootState } from '@/lib/store/store';

export interface Variable {
  id: string;
  key: string;
  value: string;
}

const VARIABLES_STORAGE_KEY = 'app_variables';

const initialState: Variable[] =
  loadState<Variable[]>(VARIABLES_STORAGE_KEY) || [];

const variablesSlice = createSlice({
  name: 'variables',
  initialState,
  reducers: {
    addVariable: (state) => {
      state.push({ id: nanoid(), key: '', value: '' });
      saveState(VARIABLES_STORAGE_KEY, state);
    },
    removeVariable: (state, action: PayloadAction<string>) => {
      const newState = state.filter((v) => v.id !== action.payload);
      saveState(VARIABLES_STORAGE_KEY, newState);
      return newState;
    },
    updateVariable: (
      state,
      action: PayloadAction<Partial<Variable> & { id: string }>
    ) => {
      const variable = state.find((v) => v.id === action.payload.id);
      if (variable) {
        Object.assign(variable, action.payload);
      }
      saveState(VARIABLES_STORAGE_KEY, state);
    },
  },
});

export const { addVariable, removeVariable, updateVariable } =
  variablesSlice.actions;

export const selectVariables = (state: RootState) => state.variables;

export default variablesSlice.reducer;
