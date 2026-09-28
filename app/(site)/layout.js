import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSettings, getItems } from '@/lib/queries';

export default async function SiteLayout({ children }) {
  const [settings, items] = await Promise.all([getSettings(), getItems('service')]);

  return (
    <>
      <Navbar settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} services={items.service} />
    </>
  );
}
