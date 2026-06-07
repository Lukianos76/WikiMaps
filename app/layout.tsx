import type { ReactNode } from 'react';

// Passthrough root layout: the <html> tag is rendered in
// app/[locale]/layout.tsx so the lang attribute reflects the active locale.
// This is the recommended next-intl pattern for the App Router.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
