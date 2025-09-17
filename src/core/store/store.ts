import { configureStore } from '@reduxjs/toolkit';

import { restClientSlice } from '@/features/rest-client/model/slice';
import variablesReducer from '@/features/variables/model/slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      restClient: restClientSlice.reducer,
      variables: variablesReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
