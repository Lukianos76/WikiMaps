import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/messages/fr.json';
import { Attribution } from './index';

describe('Attribution', () => {
  it('affiche les sources de données obligatoires', () => {
    render(
      <NextIntlClientProvider locale="fr" messages={messages}>
        <Attribution />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole('link', { name: 'Historical Basemaps' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Wikidata' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Natural Earth' })).toBeInTheDocument();
  });
});
