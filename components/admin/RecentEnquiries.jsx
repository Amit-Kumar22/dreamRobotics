'use client';

import { useRouter } from 'next/navigation';
import DataTable from './DataTable';
import { Badge, STATUS_TONE } from './ui';
import { formatDate } from '@/lib/admin-api';

const columns = [
  {
    key: 'name',
    header: 'Customer',
    render: (e) => (
      <div>
        <p className="font-medium text-slate-900">{e.name}</p>
        <p className="text-xs text-slate-500">{e.phone}</p>
      </div>
    ),
  },
  { key: 'service', header: 'Service', render: (e) => <span className="text-slate-600">{e.service || '—'}</span> },
  { key: 'status', header: 'Status', render: (e) => <Badge tone={STATUS_TONE[e.status]} dot>{e.status}</Badge> },
  { key: 'createdAt', header: 'Received', align: 'right', render: (e) => <span className="whitespace-nowrap text-slate-500">{formatDate(e.createdAt)}</span> },
];

export default function RecentEnquiries({ data }) {
  const router = useRouter();
  return (
    <DataTable
      columns={columns}
      data={data}
      pageSize={5}
      compact
      emptyTitle="No enquiries yet"
      emptyText="Contact form submissions will appear here."
      onRowClick={(e) => router.push(`/admin/enquiries?open=${e._id}`)}
    />
  );
}
