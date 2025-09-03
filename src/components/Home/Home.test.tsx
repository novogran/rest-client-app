import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/components/Home';

test('Pages Router', () => {
  render(<Home />);
  expect(screen.getByText('Hello world!')).toBeInTheDocument();
});
