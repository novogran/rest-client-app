import { createSession, deleteSession, getSession } from '@/lib/session';
import { vi } from 'vitest';

vi.mock('server-only', () => ({}));

const mockSet = vi.fn();
const mockDelete = vi.fn();
const mockGet = vi.fn();

vi.mock('next/headers', () => ({
  cookies: () => ({
    set: mockSet,
    delete: mockDelete,
    get: mockGet,
    getAll: vi.fn(),
    has: vi.fn(),
  }),
}));

describe('Session Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSession', () => {
    it('should set a session cookie with correct parameters', async () => {
      const userToken = 'test-token-123';
      const expiresAt = new Date('2024-01-01');

      await createSession(userToken, expiresAt);

      expect(mockSet).toHaveBeenCalledWith('session', userToken, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
      });
    });
  });

  describe('deleteSession', () => {
    it('should delete the session cookie', async () => {
      await deleteSession();

      expect(mockDelete).toHaveBeenCalledWith('session');
    });
  });

  describe('getSession', () => {
    it('should return session token when session exists', async () => {
      const sessionToken = 'test-session-token';
      mockGet.mockReturnValue({ value: sessionToken });

      const result = await getSession();

      expect(mockGet).toHaveBeenCalledWith('session');
      expect(result).toBe(sessionToken);
    });

    it('should return undefined when session does not exist', async () => {
      mockGet.mockReturnValue(undefined);

      const result = await getSession();

      expect(mockGet).toHaveBeenCalledWith('session');
      expect(result).toBeUndefined();
    });

    it('should return empty string when session value is empty', async () => {
      mockGet.mockReturnValue({ value: '' });

      const result = await getSession();

      expect(result).toBe('');
    });
  });
});
