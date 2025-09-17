import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as session from '@/core/session/session';
import admin from '@/core/firebase/admin';
import { executeRequestServer } from './actions';

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

      await executeRequestServer({
        method: 'GET',
        url: 'https://api.test.com',
        headers: {},
      });

      expect(mockAdd).not.toHaveBeenCalled();
    });
  });
});
