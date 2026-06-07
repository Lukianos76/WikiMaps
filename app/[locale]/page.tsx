import { setRequestLocale } from 'next-intl/server';
import { MapView } from '@/components/Map';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Map-first: the main page IS the map, full screen.
  return <MapView />;
}
