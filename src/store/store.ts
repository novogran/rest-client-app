import { configureStore } from '@reduxjs/toolkit';

import authorizationReducer from './authorizationSlice';
import { restClientSlice } from '@/components/RestClient/restClientSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      authorization: authorizationReducer,
      restClient: restClientSlice.reducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
