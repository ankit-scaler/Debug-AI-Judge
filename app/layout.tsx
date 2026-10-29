import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-ui', display: 'swap' });
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Debugging Lab',
  description: 'Fix broken real-world apps in the browser.',
};

/**
 * Applied before first paint so a viewer who chose light mode never sees a dark
 * flash. Wrapped in try/catch because localStorage throws in a private window.
 */
const themeScript = `
try {
  var t = localStorage.getItem('debuglab-theme');
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      // The inline theme script below sets data-theme before hydration, which
      // intentionally differs from the server-rendered markup (the server has
      // no way to know the viewer's stored preference). This is the standard
      // Next.js escape hatch for exactly that case; without it, every load
      // logged a hydration-mismatch error for an attribute that was never
      // meant to match.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
