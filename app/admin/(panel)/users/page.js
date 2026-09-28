import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import AdminUsers from '@/components/admin/AdminUsers';
import { getAdminSession } from '@/lib/admin-session';

export const metadata = { title: 'Admin Users' };

export default async function UsersPage() {
  const session = await getAdminSession();
  await connectDB();
  const data = JSON.parse(JSON.stringify(await Admin.find().sort({ createdAt: 1 }).lean()));
  return <AdminUsers initial={data} currentId={session?.id} />;
}
