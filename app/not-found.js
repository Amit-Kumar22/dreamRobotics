import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSettings, getItems } from '@/lib/queries';

export default async function NotFound() {
  const [settings, items] = await Promise.all([getSettings(), getItems('service')]);

  return (
    <>
      <Navbar settings={settings} />
      <main>
        <section className="flex min-h-[70vh] items-center bg-ink-950 pt-16">
          <div className="container-x text-center">
            <p className="font-mono text-sm text-brand-400">ERROR 404</p>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Page not found</h1>
            <p className="mt-4 text-slate-400">The page you are looking for does not exist.</p>
            <Link href="/" className="btn-primary mt-8">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer settings={settings} services={items.service} />
    </>
  );
}
