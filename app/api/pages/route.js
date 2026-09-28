import connectDB from '@/lib/db';
import Page from '@/models/Page';
import { ok, handle, isAdmin, unauthorized, readJson, fail } from '@/lib/http';

export const dynamic = 'force-dynamic';

// GET /api/pages -> list of pages
export const GET = handle(async () => {
  await connectDB();
  const data = await Page.find().select('slug title metaDescription').lean();
  return ok({ data });
});

// POST /api/pages -> create page (admin)
export const POST = handle(async (request) => {
  if (!isAdmin(request)) return unauthorized();
  const body = await readJson(request);
  if (!body) return fail('Invalid JSON body');
  await connectDB();
  const data = await Page.create(body);
  return ok({ data }, { status: 201 });
});
