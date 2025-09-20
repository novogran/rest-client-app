import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInitializeApp = vi.fn();
const mockApps: { apps: Array<{ [key: string]: unknown }> } = { apps: [] };
vi.mock('firebase-admin', () => ({
  default: {
    initializeApp: mockInitializeApp,
    get apps() {
      return mockApps.apps;
    },
  },
}));

describe('Firebase Admin SDK Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    mockApps.apps = [];
  });

  it('should throw an error if environment variables are not set', () => {
    vi.stubEnv('FIREBASE_PROJECT_ID', '');

    const importModule = async () => await import('./admin');
    expect(importModule).rejects.toThrow(
      'Firebase admin environment variables are not set.'
    );
  });

  it('should NOT initialize the app if it is already initialized', async () => {
    mockApps.apps = [{}];

    await import('./admin');

    expect(mockInitializeApp).not.toHaveBeenCalled();
  });
});
