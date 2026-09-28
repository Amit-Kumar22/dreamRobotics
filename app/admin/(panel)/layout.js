import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { getAdminSession } from '@/lib/admin-session';
import { getSettings } from '@/lib/queries';
import connectDB from '@/lib/db';
import Enquiry from '@/models/Enquiry';

export const dynamic = 'force-dynamic';
export const metadata = { title: { default: 'Admin', template: '%s | Admin' }, robots: { index: false, follow: false } };

async function countNew() {
  try {
    await connectDB();
    return await Enquiry.countDocuments({ status: 'new' });
  } catch {
    return 0;
  }
}

export default async function AdminPanelLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const [settings, newEnquiries] = await Promise.all([getSettings(), countNew()]);

  return (
    <AdminShell
      admin={{ name: session.name || 'Admin', email: session.email }}
      companyName={settings?.companyName}
      counts={{ newEnquiries }}
    >
      {children}
    </AdminShell>
  );
}
