import connectDB from '@/lib/db';
import Item from '@/models/Item';
import { findItems } from '@/lib/queries';
import { ok, handle, isAdmin, unauthorized, readJson, fail } from '@/lib/http';

export const dynamic = 'force-dynamic';

// GET /api/items?type=service,product&featured=true&all=true
export const GET = handle(async (request) => {
  const q = request.nextUrl.searchParams;
  const data = await findItems({
    types: q.get('type') ? q.get('type').split(',') : undefined,
    featured: q.get('featured') === 'true',
    includeInactive: q.get('all') === 'true',
  });
  return ok({ count: data.length, data });
});

// POST /api/items (admin)
export const POST = handle(async (request) => {
  if (!isAdmin(request)) return unauthorized();
  const body = await readJson(request);
  if (!body) return fail('Invalid JSON body');
  await connectDB();
  const data = await Item.create(body);
  return ok({ data }, { status: 201 });
});
