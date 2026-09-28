import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { ok, handle, isAdmin, unauthorized, readJson, fail } from '@/lib/http';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/admins (admin)
export const GET = handle(async (request) => {
  if (!isAdmin(request)) return unauthorized();
  await connectDB();
  const data = await Admin.find().sort({ createdAt: 1 }).lean();
  return ok({ count: data.length, data });
});

// POST /api/admins  { name, email, password } (admin)
export const POST = handle(async (request) => {
  if (!isAdmin(request)) return unauthorized();
  const { name, email, password } = (await readJson(request)) || {};
  if (!email || !EMAIL_RE.test(String(email).trim())) return fail('A valid email is required');
  if (!password || String(password).length < 8) return fail('Password must be at least 8 characters');

  await connectDB();
  const admin = new Admin({ name: String(name || '').trim() || 'Admin', email });
  admin.setPassword(password);
  await admin.save();
  const { passwordHash, ...data } = admin.toObject();
  return ok({ data }, { status: 201 });
});
