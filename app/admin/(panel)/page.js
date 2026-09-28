import Link from 'next/link';
import { Inbox, Sparkles, PhoneCall, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import connectDB from '@/lib/db';
import Item from '@/models/Item';
import Enquiry from '@/models/Enquiry';
import Page from '@/models/Page';
import Icon from '@/components/Icon';
import RecentEnquiries from '@/components/admin/RecentEnquiries';
import { getAdminSession } from '@/lib/admin-session';
import { CONTENT_TYPES } from '@/lib/admin-nav';

export const metadata = { title: 'Dashboard' };

async function loadDashboard() {
  await connectDB();
  const [typeCounts, statusCounts, recent, pages] = await Promise.all([
    Item.aggregate([{ $group: { _id: '$type', count: { $sum: 1 }, active: { $sum: { $cond: ['$active', 1, 0] } } } }]),
    Enquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    Page.countDocuments(),
  ]);
  const byStatus = Object.fromEntries(statusCounts.map((s) => [s._id, s.count]));
  const byType = Object.fromEntries(typeCounts.map((t) => [t._id, t]));
  return { byStatus, byType, recent: JSON.parse(JSON.stringify(recent)), pages };
}

export default async function DashboardPage() {
  const session = await getAdminSession();
  let data;
  let error = null;
  try {
    data = await loadDashboard();
  } catch (err) {
    error = err.message;
    data = { byStatus: {}, byType: {}, recent: [], pages: 0 };
  }

  const { byStatus, byType, recent, pages } = data;
  const totalEnquiries = Object.values(byStatus).reduce((a, b) => a + b, 0);
  const totalItems = Object.values(byType).reduce((a, t) => a + t.count, 0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const stats = [
    { label: 'Total enquiries', value: totalEnquiries, icon: Inbox, tone: 'bg-slate-900 text-white' },
    { label: 'New', value: byStatus.new || 0, icon: Sparkles, tone: 'bg-brand-50 text-brand-600' },
    { label: 'Contacted', value: byStatus.contacted || 0, icon: PhoneCall, tone: 'bg-amber-50 text-amber-600' },
    { label: 'Closed', value: byStatus.closed || 0, icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-ink-950 px-6 py-7 sm:px-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">{greeting},</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white">{session?.name || 'Admin'}</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              You have <span className="font-semibold text-brand-400">{byStatus.new || 0} new enquiries</span> waiting. The website shows{' '}
              {totalItems} content items across {pages} pages.
            </p>
          </div>
          <Link href="/admin/enquiries" className="inline-flex items-center gap-2 self-start rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-ink-950 hover:bg-brand-400 sm:self-auto">
            Review enquiries <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">Database error: {error}</p>}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.tone}`}>
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Recent enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm font-medium text-brand-600 hover:text-brand-700">View all →</Link>
          </div>
          <RecentEnquiries data={recent} />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Website content</h2>
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500"><Layers className="h-4 w-4" /> {totalItems} items</span>
          </div>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {Object.entries(CONTENT_TYPES).map(([type, t]) => (
              <li key={type}>
                <Link href={`/admin/content/${type}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Icon name={t.icon} className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-900">{t.label}</span>
                    <span className="block text-xs text-slate-500">{t.page}</span>
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{byType[type]?.count || 0}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
