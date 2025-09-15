import { describe, it, expect } from 'vitest';
import restClientReducer, {
  setMethod,
  setUrl,
  setBody,
  addHeader,
  removeHeader,
  updateHeader,
  initializeFromUrl,
  executeRequest,
  restClientSlice,
} from './slice';
import { RestClientState } from './slice';
const initialState: RestClientState = restClientSlice.getInitialState();

vi.mock('server-only', () => ({}));

describe('restClientSlice', () => {
  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(restClientReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });

    it('should handle setMethod', () => {
      const state = restClientReducer(initialState, setMethod('POST'));
      expect(state.method).toBe('POST');
    });

    it('should handle setUrl', () => {
      const state = restClientReducer(initialState, setUrl('https://api.com'));
      expect(state.url).toBe('https://api.com');
    });

    it('should handle setBody', () => {
      const state = restClientReducer(initialState, setBody('{"a":1}'));
      expect(state.body).toBe('{"a":1}');
    });

    it('should handle addHeader', () => {
      const state = restClientReducer(initialState, addHeader());
      expect(state.headers).toHaveLength(1);
      expect(state.headers[0]).toEqual(
        expect.objectContaining({ key: '', value: '', enabled: true })
      );
    });

    it('should handle removeHeader', () => {
      const stateWithHeader: RestClientState = {
        ...initialState,
        headers: [{ id: '123', key: 'a', value: 'b', enabled: true }],
      };
      const state = restClientReducer(stateWithHeader, removeHeader('123'));
      expect(state.headers).toHaveLength(0);
    });

    it('should handle updateHeader', () => {
      const stateWithHeader: RestClientState = {
        ...initialState,
        headers: [{ id: '123', key: 'a', value: 'b', enabled: true }],
      };
      const state = restClientReducer(
        stateWithHeader,
        updateHeader({ id: '123', key: 'new-key', enabled: false })
      );
      expect(state.headers[0].key).toBe('new-key');
      expect(state.headers[0].enabled).toBe(false);
    });

    it('should handle initializeFromUrl', () => {
      const payload = {
        method: 'PUT' as const,
        url: 'https://init.com',
        headers: [{ id: 'abc', key: 'init', value: 'true', enabled: true }],
        body: 'init body',
      };
      const state = restClientReducer(initialState, initializeFromUrl(payload));
      expect(state.method).toBe('PUT');
      expect(state.url).toBe('https://init.com');
      expect(state.headers).toEqual(payload.headers);
      expect(state.body).toBe('init body');
    });
  });

  describe('extraReducers (executeRequest)', () => {
    it('should handle pending state', () => {
      const action = { type: executeRequest.pending.type };
      const state = restClientReducer(initialState, action);
      expect(state.response.loading).toBe(true);
      expect(state.response.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const payload = {
        status: 200,
        data: '{"ok":true}',
        duration: 100,
        statusText: 'OK',
        headers: {},
        error: null,
      };
      const action = { type: executeRequest.fulfilled.type, payload };
      const state = restClientReducer(
        {
          ...initialState,
          response: { ...initialState.response, loading: true },
        },
        action
      );

      expect(state.response.loading).toBe(false);
      expect(state.response.status).toBe(200);
      expect(state.response.data).toBe('{"ok":true}');
    });

    it('should handle rejected state', () => {
      const error = { message: 'Network Error' };
      const action = { type: executeRequest.rejected.type, error };
      const state = restClientReducer(
        {
          ...initialState,
          response: { ...initialState.response, loading: true },
        },
        action
      );

      expect(state.response.loading).toBe(false);
      expect(state.response.error).toBe('Network Error');
    });

    it('should handle rejected state without an error message', () => {
      const error = { code: 'SOME_CODE' };
      const action = { type: executeRequest.rejected.type, error };
      const state = restClientReducer(
        {
          ...initialState,
          response: { ...initialState.response, loading: true },
        },
        action
      );

      expect(state.response.loading).toBe(false);
      expect(state.response.error).toBe('An unknown error occurred');
    });
  });
});
