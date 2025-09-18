import { describe, it, expect } from 'vitest';
import { encode, decode } from './url-encoding';
import { logger } from '@/core/utils/logger';

describe('URL Encoding Utilities', () => {
  const testCases = [
    { description: 'should handle simple ASCII strings', value: 'hello world' },
    {
      description: 'should handle strings with numbers and punctuation',
      value: 'api/v1/users?id=123',
    },
    {
      description: 'should handle Cyrillic (Unicode) strings',
      value: 'Привет, мир!',
    },
    { description: 'should handle Emojis (Unicode)', value: '🚀✨✅' },
    {
      description: 'should handle mixed strings',
      value: 'Test 123! Привет 🚀',
    },
    { description: 'should handle an empty string', value: '' },
    {
      description: 'should handle complex JSON structure',
      value: JSON.stringify({ key: 'значение', nested: { num: 42 } }),
    },
  ];

  it.each(testCases)('$description', ({ value }) => {
    const encoded = encode(value);
    const decoded = decode(encoded);

    expect(decoded).toBe(value);

    expect(/[\+\/=]/.test(encoded)).toBe(false);
  });

  it('should return an empty string when decoding invalid Base64', () => {
    const consoleSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});

    const decoded = decode('this-is-not-valid-base64-%%%');

    expect(decoded).toBe('');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should return an empty string if btoa fails during encoding', () => {
    const consoleSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const originalBtoa = global.btoa;
    global.btoa = vi.fn().mockImplementation(() => {
      throw new Error('Simulated BTOA failure');
    });

    const encoded = encode('test');
    expect(encoded).toBe('');
    expect(consoleSpy).toHaveBeenCalled();
    global.btoa = originalBtoa;
    consoleSpy.mockRestore();
  });
});
