import { describe, it, expect } from 'vitest';
import DeveloperInfo from '@/components/DeveloperInfo';
import { render, screen } from '@testing-library/react';
import { developerData } from '@/data/developerData';
import userEvent from '@testing-library/user-event';

describe('Developer info', () => {
  const user = userEvent.setup();
  it('should render DeveloperInfo name', async () => {
    render(<DeveloperInfo developerData={developerData[0]} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText(developerData[0].name)).toBeInTheDocument();
  });
  it('should render DeveloperInfo github link', async () => {
    render(<DeveloperInfo developerData={developerData[0]} />);
    await user.click(screen.getByRole('button'));
    const githubLink = screen.getByRole('link');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', developerData[0].github);
  });
  it('should render DeveloperInfo description', async () => {
    render(<DeveloperInfo developerData={developerData[0]} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText(developerData[0].description)).toBeInTheDocument();
  });
});
