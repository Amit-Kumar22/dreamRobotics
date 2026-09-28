import { findSettings } from '@/lib/queries';
import SettingsForm from '@/components/admin/SettingsForm';

export const metadata = { title: 'Company Settings' };

export default async function SettingsPage() {
  const settings = (await findSettings()) || {};
  return <SettingsForm initial={settings} />;
}
