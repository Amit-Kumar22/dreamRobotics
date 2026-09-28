import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { ok, handle, isAdmin, unauthorized, fail } from '@/lib/http';

export const dynamic = 'force-dynamic';

// DELETE /api/admins/:id (admin) — you cannot delete yourself or the last admin
export const DELETE = handle(async (request, { params }) => {
  if (!isAdmin(request)) return unauthorized();
  const { id } = await params;
  const me = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (me?.id === id) return fail('You cannot delete your own account', 400);

  await connectDB();
  if ((await Admin.countDocuments()) <= 1) return fail('At least one admin is required', 400);
  const data = await Admin.findByIdAndDelete(id);
  if (!data) return fail('Admin not found', 404);
  return ok({ message: 'Admin deleted' });
});
