import connectDB from '@/lib/db';
import Setting from '@/models/Setting';
import { findSettings } from '@/lib/queries';
import { ok, handle, isAdmin, unauthorized, readJson, fail } from '@/lib/http';

export const dynamic = 'force-dynamic';

// GET /api/settings -> company info
export const GET = handle(async () => ok({ data: await findSettings() }));

// PUT /api/settings -> update company info (admin)
export const PUT = handle(async (request) => {
  if (!isAdmin(request)) return unauthorized();
  const body = await readJson(request);
  if (!body) return fail('Invalid JSON body');
  await connectDB();
  const data = await Setting.findOneAndUpdate({}, body, { new: true, upsert: true, runValidators: true });
  return ok({ data });
});
