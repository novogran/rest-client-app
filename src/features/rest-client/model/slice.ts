import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  nanoid,
} from '@reduxjs/toolkit';
import type { RootState } from '@/core/store/store';
import { executeRequestServer as executeServerRequest } from '../server/actions';
import { createSelector } from 'reselect';
import { selectVariables } from '@/features/variables/model/slice';
import { applyVariables } from '@/core/http/variable-replacer';
import { methodSupportsBody } from './http';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type Header = { id: string; key: string; value: string; enabled: boolean };

interface ResponseState {
  status: number | null;
  statusText: string | null;
  data: string | null;
  headers: Record<string, string> | null;
  loading: boolean;
  error: string | null;
  duration: number | null;
}

export interface RestClientState {
  method: HttpMethod;
  url: string;
  headers: Header[];
  body: string;
  response: ResponseState;
}

const initialState: RestClientState = {
  method: 'GET',
  url: '',
  headers: [],
  body: '',
  response: {
    status: null,
    statusText: null,
    data: null,
    headers: null,
    loading: false,
    error: null,
    duration: null,
  },
};

interface ExecuteRequestPayload {
  method: HttpMethod;
  url: string;
  headers: Header[];
  body: string;
}

export const executeRequest = createAsyncThunk(
  'restClient/executeRequest',
  async (processedRequest: ExecuteRequestPayload) => {
    const { method, url, headers, body } = processedRequest;

    const activeHeaders = headers
      .filter((h) => h.enabled && h.key)
      .reduce(
        (acc, h) => {
          acc[h.key] = h.value;
          return acc;
        },
        {} as Record<string, string>
      );

    const response = await executeServerRequest({
      method,
      url,
      headers: activeHeaders,
      body: methodSupportsBody(method) && body.trim() ? body : undefined,
    });
    return response;
  }
);

interface InitialStatePayload {
  method: HttpMethod;
  url: string;
  headers: Header[];
  body: string;
}

export const restClientSlice = createSlice({
  name: 'restClient',
  initialState,
  reducers: {
    setMethod: (state, action: PayloadAction<HttpMethod>) => {
      state.method = action.payload;
      if (!methodSupportsBody(state.method)) {
        state.body = '';
      }
    },
    setUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    setBody: (state, action: PayloadAction<string>) => {
      state.body = action.payload;
    },
    addHeader: (state) => {
      state.headers.push({ id: nanoid(), key: '', value: '', enabled: true });
    },
    removeHeader: (state, action: PayloadAction<string>) => {
      state.headers = state.headers.filter((h) => h.id !== action.payload);
    },
    updateHeader: (
      state,
      action: PayloadAction<{
        id: string;
        key?: string;
        value?: string;
        enabled?: boolean;
      }>
    ) => {
      const header = state.headers.find((h) => h.id === action.payload.id);
      if (header) {
        Object.assign(header, action.payload);
      }
    },
    initializeFromUrl: (state, action: PayloadAction<InitialStatePayload>) => {
      state.method = action.payload.method || 'GET';
      state.url = action.payload.url || '';
      state.headers = action.payload.headers || [];
      state.body = action.payload.body ?? '';
    },
    commitProcessedRequest: (
      state,
      action: PayloadAction<{
        url: string;
        headers: Header[];
        body: string | undefined;
      }>
    ) => {
      state.url = action.payload.url;
      state.headers = action.payload.headers;
      state.body = action.payload.body ?? '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeRequest.pending, (state) => {
        state.response.loading = true;
        state.response.error = null;
      })
      .addCase(executeRequest.fulfilled, (state, action) => {
        state.response.loading = false;
        state.response.status = action.payload.status;
        state.response.statusText = action.payload.statusText;
        state.response.data = action.payload.data;
        state.response.headers = action.payload.headers;
        state.response.duration = action.payload.duration;
        state.response.error = action.payload.error;
      })
      .addCase(executeRequest.rejected, (state, action) => {
        state.response.loading = false;
        state.response.error =
          action.error.message || 'An unknown error occurred';
      });
  },
});

export const {
  setMethod,
  setUrl,
  setBody,
  addHeader,
  removeHeader,
  updateHeader,
  initializeFromUrl,
  commitProcessedRequest,
} = restClientSlice.actions;

export const selectRequest = (state: RootState) => state.restClient;
export const selectResponse = (state: RootState) => state.restClient.response;

export default restClientSlice.reducer;

const selectRestClientState = (state: RootState) => state.restClient;

export const selectProcessedRequest = createSelector(
  [selectRestClientState, selectVariables],
  (restClient, variables) => {
    const url = applyVariables(restClient.url, variables);
    const headers = restClient.headers.map((h) => ({
      ...h,
      value: applyVariables(h.value, variables),
    }));
    const bodyReplaced = applyVariables(restClient.body, variables);

    const body =
      methodSupportsBody(restClient.method) && bodyReplaced.trim()
        ? bodyReplaced
        : '';

    return { method: restClient.method, url, headers, body };
  }
);
