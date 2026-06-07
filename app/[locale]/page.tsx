import { setRequestLocale } from 'next-intl/server';
import { MapView } from '@/components/Map';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  // Map-first : la page principale EST la carte, plein écran.
  return <MapView />;
}
