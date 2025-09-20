import { describe, it, expect } from 'vitest';
import { useAppDispatch, useAppSelector } from './hooks';
import { useDispatch, useSelector } from 'react-redux';

describe('Redux Hooks', () => {
  it('should export correctly typed hooks', () => {
    expect(useAppDispatch).toBe(useDispatch);
    expect(useAppSelector).toBe(useSelector);
  });
});
