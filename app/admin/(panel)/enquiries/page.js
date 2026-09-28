import connectDB from '@/lib/db';
import Enquiry from '@/models/Enquiry';
import EnquiriesManager from '@/components/admin/EnquiriesManager';

export const metadata = { title: 'Enquiries' };

export default async function EnquiriesPage({ searchParams }) {
  const { open } = await searchParams;
  await connectDB();
  const data = JSON.parse(JSON.stringify(await Enquiry.find().sort({ createdAt: -1 }).lean()));
  return <EnquiriesManager initial={data} openId={open} />;
}
