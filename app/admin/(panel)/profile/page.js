import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import ProfileForm from '@/components/admin/ProfileForm';
import { getAdminSession } from '@/lib/admin-session';

export const metadata = { title: 'My Profile' };

export default async function ProfilePage() {
  const session = await getAdminSession();
  await connectDB();
  const admin = await Admin.findById(session.id).lean();
  return (
    <ProfileForm
      admin={{
        name: admin?.name || session.name,
        email: admin?.email || session.email,
        createdAt: admin?.createdAt?.toISOString(),
        lastLoginAt: admin?.lastLoginAt?.toISOString(),
      }}
    />
  );
}
