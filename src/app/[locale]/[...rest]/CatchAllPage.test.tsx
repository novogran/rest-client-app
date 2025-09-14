import { render } from '@testing-library/react';
import CatchAllPage from './page';
import { notFound } from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('CatchAllPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call notFound function', () => {
    render(<CatchAllPage />);

    expect(notFound).toHaveBeenCalled();
  });

  it('should call notFound exactly once', () => {
    render(<CatchAllPage />);

    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('should not return any JSX content', () => {
    const { container } = render(<CatchAllPage />);

    expect(container.firstChild).toBeNull();
  });
});
