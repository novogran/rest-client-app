import { describe, it, expect } from 'vitest';
import Footer from '@/components/Footer';
import { render, screen } from '@testing-library/react';

describe('Footer', () => {
  it('should render Footer', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer')).toBeVisible();
  });
  it('should contain 4 elements in unordered list', () => {
    render(<Footer />);
    expect(screen.getAllByRole('listitem').length).toBe(4);
  });

  it('should not be empty', () => {
    render(<Footer />);
    expect(screen.getByText(/2025/)).toBeVisible();
  });
});
