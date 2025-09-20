import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadState, saveState } from './local-storage';
import { logger } from '@/core/utils/logger';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: () => {
      store = {};
    },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

describe('localStorage Utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  const TEST_KEY = 'my-test-key';
  const testData = { a: 1, b: 'test' };

  describe('saveState', () => {
    it('should stringify the state and call localStorage.setItem', () => {
      saveState(TEST_KEY, testData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        TEST_KEY,
        JSON.stringify(testData)
      );
    });
  });

  describe('loadState', () => {
    it('should call localStorage.getItem and parse the result', () => {
      localStorageMock.setItem(TEST_KEY, JSON.stringify(testData));

      const loadedData = loadState(TEST_KEY);

      expect(localStorageMock.getItem).toHaveBeenCalledWith(TEST_KEY);
      expect(loadedData).toEqual(testData);
    });

    it('should return undefined if no state is found', () => {
      const loadedData = loadState('non-existent-key');
      expect(loadedData).toBeUndefined();
    });

    it('should return undefined and log an error for invalid JSON', () => {
      const consoleSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
      localStorageMock.setItem(TEST_KEY, 'invalid-json');

      const loadedData = loadState(TEST_KEY);

      expect(loadedData).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
