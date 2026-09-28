import { sessionCookie } from '@/lib/auth';
import { ok } from '@/lib/http';

export const dynamic = 'force-dynamic';

// POST /api/auth/logout -> clears the admin session cookie
export async function POST() {
  const res = ok({ message: 'Logged out' });
  res.cookies.set(sessionCookie(''));
  return res;
}
