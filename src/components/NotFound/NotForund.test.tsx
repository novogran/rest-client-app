import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NotFound from '.';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      sadEmoji: 'Sad Emoji',
      title: '404 - Page Not Found',
      message: 'The page you are looking for was not found!',
      returnLink: 'Return to Main Page',
    };
    return translations[key] || key;
  },
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('NotFound', () => {
  beforeEach(() => {
    render(<NotFound />);
  });

  it('отображает сообщение 404', () => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '404 - Page Not Found'
    );
  });

  it('отображает грустный смайлик с правильным aria-label', () => {
    const emoji = screen.getByRole('img', { name: 'Sad Emoji' });
    expect(emoji).toBeInTheDocument();
    expect(emoji).toHaveTextContent('😢');
  });

  it('показывает описательное сообщение', () => {
    expect(
      screen.getByText('The page you are looking for was not found!')
    ).toBeInTheDocument();
  });

  it('содержит рабочую домашнюю ссылку', () => {
    const homeLink = screen.getByRole('link', {
      name: 'Return to Main Page',
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).toHaveTextContent('Return to Main Page');
  });

  it('имеет правильную структуру контейнеров', () => {
    const container = screen.getByTestId('not-found-container');
    const content = screen.getByTestId('not-found-content');

    expect(container).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it('анимация bounce применяется к смайлику', () => {
    const emoji = screen.getByRole('img', { name: 'Sad Emoji' });
    expect(emoji).toHaveClass('animate-bounce');
  });
});
