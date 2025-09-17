import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSession, deleteSession, getSession } from './session';

vi.mock('server-only', () => ({}));

const mockSet = vi.fn();
const mockDelete = vi.fn();
const mockGet = vi.fn();
vi.mock('next/headers', () => ({
  cookies: () => ({
    set: mockSet,
    delete: mockDelete,
    get: mockGet,
  }),
}));

const mockCreateSessionCookie = vi.fn();
const mockVerifySessionCookie = vi.fn();
vi.mock('@/core/firebase/admin.ts', () => ({
  default: {
    auth: () => ({
      createSessionCookie: mockCreateSessionCookie,
      verifySessionCookie: mockVerifySessionCookie,
    }),
  },
}));

describe('Session Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create a session cookie and set it', async () => {
      const idToken = 'test-id-token';
      const sessionCookie = 'test-session-cookie';
      mockCreateSessionCookie.mockResolvedValue(sessionCookie);

      await createSession(idToken);

      expect(mockCreateSessionCookie).toHaveBeenCalledWith(idToken, {
        expiresIn: 60 * 60 * 24 * 5 * 1000,
      });
      expect(mockSet).toHaveBeenCalledWith(
        'session',
        sessionCookie,
        expect.any(Object)
      );
    });
  });

  describe('deleteSession', () => {
    it('should delete the session cookie', async () => {
      await deleteSession();
      expect(mockDelete).toHaveBeenCalledWith('session');
    });
  });

  describe('getSession', () => {
    it('should return null if no session cookie exists', async () => {
      mockGet.mockReturnValue(undefined);
      const session = await getSession();
      expect(session).toBeNull();
    });

    it('should return userId if the session cookie is valid', async () => {
      const sessionCookie = 'valid-session-cookie';
      const decodedToken = { uid: 'user-123' };
      mockGet.mockReturnValue({ value: sessionCookie });
      mockVerifySessionCookie.mockResolvedValue(decodedToken);

      const session = await getSession();

      expect(mockVerifySessionCookie).toHaveBeenCalledWith(sessionCookie, true);
      expect(session).toEqual({ userId: 'user-123' });
    });

    it('should return null if the session cookie is invalid', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const sessionCookie = 'invalid-session-cookie';
      mockGet.mockReturnValue({ value: sessionCookie });
      mockVerifySessionCookie.mockRejectedValue(new Error('Invalid cookie'));

      const session = await getSession();

      expect(session).toBeNull();
      consoleSpy.mockRestore();
    });
  });
});
