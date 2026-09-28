import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { SESSION_COOKIE, verifySessionToken, createSessionToken, sessionCookie } from '@/lib/auth';
import { ok, handle, readJson, fail, unauthorized } from '@/lib/http';

export const dynamic = 'force-dynamic';

const session = (request) => verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

// GET /api/auth/me -> the logged-in admin
export async function GET(request) {
  const s = session(request);
  if (!s) return unauthorized();
  return ok({ data: { id: s.id, name: s.name, email: s.email } });
}

// PUT /api/auth/me  { name?, currentPassword?, newPassword? } -> update own profile / password
export const PUT = handle(async (request) => {
  const s = session(request);
  if (!s) return unauthorized();
  const { name, currentPassword, newPassword } = (await readJson(request)) || {};

  await connectDB();
  const admin = await Admin.findById(s.id).select('+passwordHash');
  if (!admin) return unauthorized();

  if (name !== undefined) {
    if (!String(name).trim()) return fail('Name is required');
    admin.name = String(name).trim();
  }
  if (newPassword !== undefined) {
    if (!admin.checkPassword(currentPassword || '')) return fail('Current password is incorrect', 400);
    if (String(newPassword).length < 8) return fail('New password must be at least 8 characters');
    admin.setPassword(newPassword);
  }
  await admin.save();

  // Re-issue the cookie so the new name shows in the navbar
  const res = ok({ message: 'Profile updated', data: { id: admin._id, name: admin.name, email: admin.email } });
  res.cookies.set(sessionCookie(createSessionToken(admin)));
  return res;
});
