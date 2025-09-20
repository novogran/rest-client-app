import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getHistory } from './actions';
import { logger } from '@/core/utils/logger';

vi.mock('server-only', () => ({}));
vi.mock('@/core/session/session');
vi.mock('firebase/firestore');

import * as session from '@/core/session/session';
import { getDocs, QuerySnapshot } from 'firebase/firestore';

const mockedGetSession = vi.mocked(session.getSession);
const mockedGetDocs = vi.mocked(getDocs);

describe('getHistory Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an empty array if user is not authenticated', async () => {
    mockedGetSession.mockResolvedValue(null);
    const history = await getHistory();
    expect(history).toEqual([]);
  });

  it('should fetch and format history for an authenticated user', async () => {
    mockedGetSession.mockResolvedValue({ userId: 'user-123' });

    const mockDoc = {
      id: 'doc-1',
      data: () => ({
        userId: 'user-123',
        request: {
          method: 'GET',
          url: 'https://test.com',
          headers: {},
          body: '',
        },
        response: { status: 200, duration: 100, error: null },
        createdAt: { toDate: () => new Date() },
      }),
    };

    const mockQuerySnapshot = {
      empty: false,
      docs: [mockDoc],
      forEach: (callback: (doc: typeof mockDoc) => void) => {
        mockQuerySnapshot.docs.forEach(callback);
      },
    };

    mockedGetDocs.mockResolvedValue(
      mockQuerySnapshot as unknown as QuerySnapshot
    );

    const history = await getHistory();

    expect(history).toHaveLength(1);
    expect(history[0].id).toBe('doc-1');
    expect(history[0].request.method).toBe('GET');
  });

  it('should return an empty array if firestore throws an error', async () => {
    const consoleSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});

    mockedGetSession.mockResolvedValue({ userId: 'user-123' });
    mockedGetDocs.mockRejectedValue(new Error('Firestore failed'));

    const history = await getHistory();

    expect(history).toEqual([]);

    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch history:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
