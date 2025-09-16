import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useLanguageSwitcher } from './useLanguageSwitcher';

const mockRouter = { replace: vi.fn() };
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/about',
}));

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});

describe('useLanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the current locale and initial state', () => {
    const { result } = renderHook(() => useLanguageSwitcher());
    expect(result.current.locale).toBe('en');
    expect(result.current.isPending).toBe(false);
  });

  it('should call router.replace when onSelectChange is triggered', () => {
    const { result } = renderHook(() => useLanguageSwitcher());

    act(() => {
      result.current.onSelectChange('ru');
    });

    expect(mockRouter.replace).toHaveBeenCalledTimes(1);
    expect(mockRouter.replace).toHaveBeenCalledWith('/about', { locale: 'ru' });
  });
});
