import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { createSessionToken, sessionCookie } from '@/lib/auth';
import { ok, handle, readJson, fail, rateLimited } from '@/lib/http';

export const dynamic = 'force-dynamic';

// POST /api/auth/login  { email, password } -> sets the admin session cookie
export const POST = handle(async (request) => {
  if (rateLimited(request, { limit: 10 })) return fail('Too many login attempts. Please try again later.', 429);

  const { email, password } = (await readJson(request)) || {};
  if (!email || !password) return fail('Email and password are required');

  await connectDB();
  const admin = await Admin.findOne({ email: String(email).trim().toLowerCase() }).select('+passwordHash');
  if (!admin || !admin.checkPassword(password)) return fail('Invalid email or password', 401);

  admin.lastLoginAt = new Date();
  await admin.save();

  const res = ok({ message: 'Logged in', data: { name: admin.name, email: admin.email } });
  res.cookies.set(sessionCookie(createSessionToken(admin)));
  return res;
});
