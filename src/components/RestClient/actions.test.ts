import { describe, it, expect, vi, afterEach } from 'vitest';
import { executeRequest } from './actions';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('executeRequest Server Action', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when fetch is successful', () => {
    it('should return a correctly formatted success response', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Headers({ 'content-type': 'application/json' }),
        text: vi.fn().mockResolvedValue('{"id": 101}'),
      };
      fetchMock.mockResolvedValue(mockResponse);

      const payload = {
        method: 'POST',
        url: 'https://api.example.com',
        headers: { 'X-Test': 'true' },
        body: '{}',
      };
      const result = await executeRequest(payload);

      expect(fetchMock).toHaveBeenCalledWith(payload.url, {
        method: payload.method,
        headers: payload.headers,
        body: payload.body,
      });

      expect(result.status).toBe(201);
      expect(result.statusText).toBe('Created');
      expect(result.data).toBe('{"id": 101}');
      expect(result.headers).toEqual({ 'content-type': 'application/json' });
      expect(result.error).toBeNull();
      expect(result.duration).toBeTypeOf('number');
    });
  });

  describe('when fetch fails', () => {
    it('should return a correctly formatted error response', async () => {
      const errorMessage = 'Network request failed';
      fetchMock.mockRejectedValue(new Error(errorMessage));

      const payload = {
        method: 'GET',
        url: 'https://invalid-url.com',
        headers: {},
      };
      const result = await executeRequest(payload);

      expect(result.status).toBeNull();
      expect(result.data).toBeNull();
      expect(result.error).toBe(errorMessage);
      expect(result.duration).toBeTypeOf('number');
    });
  });

  it('should return a "Failed to fetch" message for non-Error exceptions', async () => {
    const nonErrorPayload = 'Something went wrong';
    fetchMock.mockRejectedValue(nonErrorPayload);

    const payload = {
      method: 'GET',
      url: 'https://invalid-url.com',
      headers: {},
    };
    const result = await executeRequest(payload);
    expect(result.error).toBe('Failed to fetch');
  });
});
