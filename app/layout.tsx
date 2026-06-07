import type { ReactNode } from 'react';

// Layout racine « passthrough » : la balise <html> est rendue dans
// app/[locale]/layout.tsx afin que l'attribut lang reflète la locale active.
// Pattern recommandé par next-intl pour l'App Router.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
