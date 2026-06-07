import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/messages/en.json';
import { Attribution } from './index';

describe('Attribution', () => {
  it('renders the required data sources', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Attribution />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole('link', { name: 'OpenHistoricalMap' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Natural Earth' })).toBeInTheDocument();
  });
});
