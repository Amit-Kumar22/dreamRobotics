import connectDB from '@/lib/db';
import Enquiry from '@/models/Enquiry';
import { ok, handle, isAdmin, unauthorized, readJson, fail, rateLimited } from '@/lib/http';

export const dynamic = 'force-dynamic';

const PHONE_RE = /^[+]?[0-9\s-]{7,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/enquiries -> contact form submission (public)
export const POST = handle(async (request) => {
  if (rateLimited(request)) return fail('Too many requests. Please try again later.', 429);

  const body = (await readJson(request)) || {};
  const { name, phone, email, subject, service, message } = body;
  const errors = [];
  if (!name || !String(name).trim()) errors.push('Name is required');
  if (!phone || !PHONE_RE.test(String(phone).trim())) errors.push('A valid phone number is required');
  if (email && !EMAIL_RE.test(String(email).trim())) errors.push('Email address is not valid');
  if (!message || String(message).trim().length < 10) errors.push('Message must be at least 10 characters');
  if (errors.length) return fail(errors[0], 400, { errors });

  await connectDB();
  const enquiry = await Enquiry.create({ name, phone, email, subject, service, message });
  return ok(
    {
      message: 'Thank you! We have received your enquiry and will contact you soon.',
      data: { id: enquiry._id },
    },
    { status: 201 }
  );
});

// GET /api/enquiries?status=new (admin)
export const GET = handle(async (request) => {
  if (!isAdmin(request)) return unauthorized();
  const status = request.nextUrl.searchParams.get('status');
  await connectDB();
  const data = await Enquiry.find(status ? { status } : {}).sort({ createdAt: -1 }).lean();
  return ok({ count: data.length, data });
});
