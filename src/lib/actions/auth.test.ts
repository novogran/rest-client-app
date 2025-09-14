import { signUp, signIn, logout, getCurrentSession } from './auth';
import {
  registerWithEmailAndPassword,
  logInWithEmailAndPassword,
} from '@/lib/firebase/client';
import { createSession, deleteSession, getSession } from '../session';
import { UserCredential } from 'firebase/auth';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/lib/firebase/client');
vi.mock('../session', () => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
  getSession: vi.fn(),
}));

const mockedRegister = vi.mocked(registerWithEmailAndPassword);
const mockedLogin = vi.mocked(logInWithEmailAndPassword);
const mockedCreateSession = vi.mocked(createSession);
const mockedDeleteSession = vi.mocked(deleteSession);
const mockedGetSession = vi.mocked(getSession);

const mockUserCredential = {
  user: {
    getIdToken: vi.fn().mockResolvedValue('test-token'),
  },
} as unknown as UserCredential;

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should return success for valid registration', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');
      formData.append('confirmPassword', 'Password123!');

      mockedRegister.mockResolvedValue(mockUserCredential);

      const result = await signUp({}, formData);

      expect(result.success).toBe(true);
      expect(mockedCreateSession).toHaveBeenCalledWith('test-token');
    });

    it('should return a general error if registration fails', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');
      formData.append('confirmPassword', 'Password123!');

      mockedRegister.mockRejectedValue(new Error('Firebase error'));

      const result = await signUp({}, formData);
      expect(result.errors?.general).toEqual(['Firebase error']);
    });

    it('should return errors for invalid input', async () => {
      const formData = new FormData();
      formData.append('email', 'invalid-email');
      formData.append('password', 'short');
      formData.append('confirmPassword', 'different');

      const result = await signUp({}, formData);

      expect(result.errors).toBeDefined();
      expect(result.errors?.email).toBeDefined();
      expect(result.errors?.password).toBeDefined();
    });

    it('should return error when registration fails (no user)', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');
      formData.append('confirmPassword', 'Password123!');

      vi.mocked(registerWithEmailAndPassword).mockResolvedValue(
        {} as UserCredential
      );

      const result = await signUp({}, formData);

      expect(result.errors?.general).toEqual(['Registration failed']);
    });

    it('should handle unknown errors', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');
      formData.append('confirmPassword', 'Password123!');

      vi.mocked(registerWithEmailAndPassword).mockRejectedValue(
        'unknown error'
      );

      const result = await signUp({}, formData);

      expect(result.errors).toBeUndefined();
    });
  });

  describe('signIn', () => {
    it('should return success for valid login', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');

      mockedLogin.mockResolvedValue(mockUserCredential);

      const result = await signIn({}, formData);

      expect(result.success).toBe(true);
      expect(mockedCreateSession).toHaveBeenCalledWith('test-token');
    });

    it('should return a general error if login fails', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');

      mockedLogin.mockRejectedValue(new Error('Invalid credentials'));

      const result = await signIn({}, formData);
      expect(result.errors?.general).toEqual(['Invalid credentials']);
    });

    it('should return errors for invalid input', async () => {
      const formData = new FormData();
      formData.append('email', 'invalid-email');
      formData.append('password', '');

      const result = await signIn({}, formData);

      expect(result.errors).toBeDefined();
      expect(result.errors?.email).toBeDefined();
      expect(result.errors?.password).toBeDefined();
    });

    it('should return error when login fails (no data)', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');

      vi.mocked(logInWithEmailAndPassword).mockResolvedValue(null);

      const result = await signIn({}, formData);

      expect(result.errors?.general).toEqual(['Authentication failed']);
    });

    it('should handle unknown errors', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');

      vi.mocked(logInWithEmailAndPassword).mockRejectedValue('unknown error');

      const result = await signIn({}, formData);

      expect(result.errors).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('should call deleteSession', async () => {
      await logout();
      expect(mockedDeleteSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCurrentSession', () => {
    it('should return the session object from getSession', async () => {
      const mockSession = { userId: 'user-123' };
      mockedGetSession.mockResolvedValue(mockSession);

      const result = await getCurrentSession();
      expect(result).toEqual(mockSession);
      expect(mockedGetSession).toHaveBeenCalledTimes(1);
    });
  });
});
