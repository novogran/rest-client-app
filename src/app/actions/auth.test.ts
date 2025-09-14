import { signUp, signIn, logout, getCurrentSession } from '@/app/actions/auth';
import {
  registerWithEmailAndPassword,
  logInWithEmailAndPassword,
} from '@/firebase/firebase';
import { createSession, deleteSession, getSession } from '@/lib/session';
import { UserCredential } from 'firebase/auth';
import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockUser: UserCredential = {
  user: {
    getIdTokenResult: vi.fn().mockResolvedValue({
      token: 'test-token',
      expirationTime: new Date(Date.now() + 3600000).toISOString(),
    }),
    emailVerified: false,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
    getIdToken: function (): Promise<string> {
      throw new Error('Function not implemented.');
    },
    reload: function (): Promise<void> {
      throw new Error('Function not implemented.');
    },
    toJSON: function (): object {
      throw new Error('Function not implemented.');
    },
    displayName: null,
    email: null,
    phoneNumber: null,
    photoURL: null,
    providerId: '',
    uid: '',
  },
  providerId: null,
  operationType: 'signIn',
};

vi.mock('@/firebase/firebase', () => ({
  registerWithEmailAndPassword: vi.fn(),
  logInWithEmailAndPassword: vi.fn(),
}));

vi.mock('@/lib/session', () => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
  getSession: vi.fn(),
}));

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
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

    it('should return success for valid registration', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');
      formData.append('confirmPassword', 'Password123!');

      vi.mocked(registerWithEmailAndPassword).mockResolvedValue(
        mockUser as UserCredential
      );
      vi.mocked(createSession).mockResolvedValue(undefined);

      const result = await signUp({}, formData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Registration successful!');
      expect(createSession).toHaveBeenCalled();
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

    it('should handle Firebase errors', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');
      formData.append('confirmPassword', 'Password123!');

      vi.mocked(registerWithEmailAndPassword).mockRejectedValue(
        new Error('Firebase error')
      );

      const result = await signUp({}, formData);

      expect(result.errors?.general).toEqual(['Firebase error']);
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
    it('should return errors for invalid input', async () => {
      const formData = new FormData();
      formData.append('email', 'invalid-email');
      formData.append('password', '');

      const result = await signIn({}, formData);

      expect(result.errors).toBeDefined();
      expect(result.errors?.email).toBeDefined();
      expect(result.errors?.password).toBeDefined();
    });

    it('should return success for valid login', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');

      vi.mocked(logInWithEmailAndPassword).mockResolvedValue(mockUser);
      vi.mocked(createSession).mockResolvedValue(undefined);

      const result = await signIn({}, formData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Login successful!');
      expect(createSession).toHaveBeenCalled();
    });

    it('should return error when login fails (no data)', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');

      vi.mocked(logInWithEmailAndPassword).mockResolvedValue(null);

      const result = await signIn({}, formData);

      expect(result.errors?.general).toEqual(['Authentication failed']);
    });

    it('should handle Firebase errors', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'Password123!');

      vi.mocked(logInWithEmailAndPassword).mockRejectedValue(
        new Error('Invalid credentials')
      );

      const result = await signIn({}, formData);

      expect(result.errors?.general).toEqual(['Invalid credentials']);
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
      vi.mocked(deleteSession).mockResolvedValue(undefined);

      await logout();

      expect(deleteSession).toHaveBeenCalled();
    });
  });

  describe('getCurrentSession', () => {
    it('should return session', async () => {
      const mockSession = '123';
      vi.mocked(getSession).mockResolvedValue(mockSession as string);

      const result = await getCurrentSession();

      expect(result).toEqual(mockSession);
      expect(getSession).toHaveBeenCalled();
    });
  });
});
