import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface AuthorizationState {
  value: boolean;
}

const initialState: AuthorizationState = {
  value: false,
};

export const authorizationSlicer = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    signIn: (state) => {
      state.value = true;
    },
    signOut: (state) => {
      state.value = false;
    },
  },
});

export const { signIn, signOut } = authorizationSlicer.actions;

export const selectAuthorization = (state: RootState) =>
  state.authorization.value;

export default authorizationSlicer.reducer;
