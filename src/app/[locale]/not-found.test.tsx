import { describe, it, expect, vi, Mock, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFoundPage from './not-found';
import NotFound from '@/components/NotFound';

vi.mock('@/components/NotFound', () => ({
  default: vi.fn(() => <div data-testid="not-found-mock">Not Found Mock</div>),
  NotFound: vi.fn(() => <div data-testid="not-found-mock">Not Found Mock</div>),
}));

describe('NotFoundPage', () => {
  it('should render 404 page correctly', () => {
    render(<NotFoundPage />);

    expect(screen.getByTestId('not-found-mock')).toBeInTheDocument();
    expect(screen.getByText('Not Found Mock')).toBeInTheDocument();
  });

  it('should use NotFound component without props', () => {
    render(<NotFoundPage />);

    expect(NotFound).toHaveBeenCalledTimes(1);

    const calls = (NotFound as Mock).mock.calls;

    expect(calls[0][0]).toEqual({});
  });

  it('should contain only NotFound component', () => {
    const { container } = render(<NotFoundPage />);

    expect(container.childElementCount).toBe(1);
    expect(container.firstChild).toHaveAttribute(
      'data-testid',
      'not-found-mock'
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
