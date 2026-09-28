import connectDB from '@/lib/db';
import Item from '@/models/Item';
import { ok, handle, isAdmin, unauthorized, readJson, fail } from '@/lib/http';

export const dynamic = 'force-dynamic';

// GET /api/items/:id
export const GET = handle(async (request, { params }) => {
  const { id } = await params;
  await connectDB();
  const data = await Item.findById(id).lean();
  if (!data) return fail('Item not found', 404);
  return ok({ data });
});

// PUT /api/items/:id (admin)
export const PUT = handle(async (request, { params }) => {
  if (!isAdmin(request)) return unauthorized();
  const { id } = await params;
  const body = await readJson(request);
  if (!body) return fail('Invalid JSON body');
  await connectDB();
  const data = await Item.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!data) return fail('Item not found', 404);
  return ok({ data });
});

// DELETE /api/items/:id (admin)
export const DELETE = handle(async (request, { params }) => {
  if (!isAdmin(request)) return unauthorized();
  const { id } = await params;
  await connectDB();
  const data = await Item.findByIdAndDelete(id);
  if (!data) return fail('Item not found', 404);
  return ok({ message: 'Item deleted' });
});
