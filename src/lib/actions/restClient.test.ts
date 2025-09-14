import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeRequest } from './restClient';
import * as session from '@/lib/session';
import admin from '@/lib/firebase/admin';

vi.mock('server-only', () => ({}));

describe('RestClient Server Action: executeRequest', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Unauthenticated User', () => {
    it('should not save to history if user is not logged in', async () => {
      vi.spyOn(session, 'getSession').mockResolvedValue(null);
      vi.spyOn(global, 'fetch').mockResolvedValue({} as Response);

      const mockAdd = vi.fn();

      vi.spyOn(admin, 'firestore').mockReturnValue({
        collection: () => ({ add: mockAdd }),
      } as unknown as ReturnType<typeof admin.firestore>);

      await executeRequest({
        method: 'GET',
        url: 'https://api.test.com',
        headers: {},
      });

      expect(mockAdd).not.toHaveBeenCalled();
    });
  });
});
