import connectDB from '@/lib/db';
import Enquiry from '@/models/Enquiry';
import { ok, handle, isAdmin, unauthorized, readJson, fail } from '@/lib/http';

export const dynamic = 'force-dynamic';

// PATCH /api/enquiries/:id -> update status: new | contacted | closed (admin)
export const PATCH = handle(async (request, { params }) => {
  if (!isAdmin(request)) return unauthorized();
  const { id } = await params;
  const body = (await readJson(request)) || {};
  await connectDB();
  const data = await Enquiry.findByIdAndUpdate(id, { status: body.status }, { new: true, runValidators: true });
  if (!data) return fail('Enquiry not found', 404);
  return ok({ data });
});

// DELETE /api/enquiries/:id (admin)
export const DELETE = handle(async (request, { params }) => {
  if (!isAdmin(request)) return unauthorized();
  const { id } = await params;
  await connectDB();
  const data = await Enquiry.findByIdAndDelete(id);
  if (!data) return fail('Enquiry not found', 404);
  return ok({ message: 'Enquiry deleted' });
});
