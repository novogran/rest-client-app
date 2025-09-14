import { configureStore } from '@reduxjs/toolkit';

import { restClientSlice } from '@/components/RestClient/restClientSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      restClient: restClientSlice.reducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
