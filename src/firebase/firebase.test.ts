import { vi } from 'vitest';

vi.mock('firebase/app', () => {
  const mockApp = {};
  return {
    initializeApp: vi.fn(() => mockApp),
  };
});

vi.mock('firebase/auth', () => {
  const mockAuth = {};
  const signInWithEmailAndPassword = vi.fn();
  const createUserWithEmailAndPassword = vi.fn();
  const signOut = vi.fn();
  const getAuth = vi.fn(() => mockAuth);

  return {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    AuthError: class AuthError extends Error {},
  };
});

vi.mock('firebase/firestore', () => {
  const mockDb = {};
  const collection = vi.fn(() => 'users-collection');
  const addDoc = vi.fn();
  const getFirestore = vi.fn(() => mockDb);

  return {
    getFirestore,
    collection,
    addDoc,
  };
});

import {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
} from '@/firebase/firebase';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  IdTokenResult,
} from 'firebase/auth';
import { collection, addDoc, DocumentReference } from 'firebase/firestore';

describe('Firebase', () => {
  const mockUserCredential: UserCredential = {
    user: {
      uid: 'test-uid',
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
      getIdTokenResult: function (): Promise<IdTokenResult> {
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
    },
    providerId: null,
    operationType: 'signIn',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(signInWithEmailAndPassword).mockResolvedValue(mockUserCredential);
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(
      mockUserCredential
    );
    vi.mocked(addDoc).mockResolvedValue({} as DocumentReference);
  });

  it('should export auth and db', () => {
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
  });

  it('should login successfully', async () => {
    const result = await logInWithEmailAndPassword(
      'test@example.com',
      'password'
    );

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'test@example.com',
      'password'
    );
    expect(result).toEqual(mockUserCredential);
  });

  it('should throw error on login failure', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(
      new Error('Auth failed')
    );

    await expect(
      logInWithEmailAndPassword('test@example.com', 'wrong')
    ).rejects.toThrow('Auth failed');
  });

  it('should register successfully', async () => {
    const result = await registerWithEmailAndPassword(
      'test@example.com',
      'password'
    );

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'test@example.com',
      'password'
    );
    expect(collection).toHaveBeenCalledWith(db, 'users');
    expect(addDoc).toHaveBeenCalledWith('users-collection', {
      uid: 'test-uid',
      authProvider: 'local',
      email: 'test@example.com',
      createdAt: expect.any(Date),
    });
    expect(result).toEqual(mockUserCredential);
  });

  it('should throw error on registration failure', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(
      new Error('Registration failed')
    );

    await expect(
      registerWithEmailAndPassword('test@example.com', 'password')
    ).rejects.toThrow('Registration failed');
  });

  it('should logout', () => {
    logout();
    expect(signOut).toHaveBeenCalledWith(auth);
  });
});
