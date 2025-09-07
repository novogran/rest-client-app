import { describe, it, expect } from 'vitest';
import DeveloperInfo from '@/components/DeveloperInfo';
import { render, screen } from '@testing-library/react';
import { developerData } from '@/data/developerData';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';

describe('Developer info', () => {
  const user = userEvent.setup();
  it('should render DeveloperInfo name', async () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          developers: {
            0: {
              name: 'Daniil Sudorgin',
              description:
                'Front-end developer. Developer with commercial experience in Svelte, who used this course to deeply master the modern React ecosystem. He focuses on building robust, scalable applications with a strong emphasis on clean architecture, full test coverage, and pragmatic engineering solutions.',
            },
          },
        }}
      >
        <DeveloperInfo developerData={developerData[0]} />
      </NextIntlClientProvider>
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByText(developerData[0].name)).toBeInTheDocument();
  });
  it('should render DeveloperInfo github link', async () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          developers: {
            0: {
              name: 'Daniil Sudorgin',
              description:
                'Front-end developer. Developer with commercial experience in Svelte, who used this course to deeply master the modern React ecosystem. He focuses on building robust, scalable applications with a strong emphasis on clean architecture, full test coverage, and pragmatic engineering solutions.',
            },
          },
        }}
      >
        <DeveloperInfo developerData={developerData[0]} />
      </NextIntlClientProvider>
    );
    await user.click(screen.getByRole('button'));
    const githubLink = screen.getByRole('link');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', developerData[0].github);
  });
  it('should render DeveloperInfo description', async () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          developers: {
            0: {
              name: 'Daniil Sudorgin',
              description:
                'Front-end developer. Developer with commercial experience in Svelte, who used this course to deeply master the modern React ecosystem. He focuses on building robust, scalable applications with a strong emphasis on clean architecture, full test coverage, and pragmatic engineering solutions.',
            },
          },
        }}
      >
        <DeveloperInfo developerData={developerData[0]} />
      </NextIntlClientProvider>
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByText(developerData[0].description)).toBeInTheDocument();
  });
});
