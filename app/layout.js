import './globals.css';
import { getSettings } from '@/lib/queries';

// Always render with fresh data from the backend
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const s = await getSettings();
  const name = s?.companyName || 'DreamRobotics';
  return {
    title: { default: `${name} — ${s?.tagline || 'Turning Ideas Into Technology'}`, template: `%s | ${name}` },
    description: s?.description,
  };
}

// Navbar/Footer live in app/(site)/layout.js; the admin panel has its own layout.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
