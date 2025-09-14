import { configureStore } from '@reduxjs/toolkit';

import authorizationReducer from './authorizationSlice';
import { restClientSlice } from '@/components/RestClient/restClientSlice';
import variablesReducer from '@/components/Variables/variablesSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      authorization: authorizationReducer,
      restClient: restClientSlice.reducer,
      variables: variablesReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
