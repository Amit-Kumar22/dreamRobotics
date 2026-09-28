'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Trash2, Phone, Mail, MessageCircle, Download } from 'lucide-react';
import DataTable from './DataTable';
import { PageHeader, Badge, Button, Modal, ConfirmDialog, STATUS_TONE } from './ui';
import { useToast } from './Toast';
import { api, formatDate, formatDateTime } from '@/lib/admin-api';
import { ENQUIRY_STATUSES } from '@/lib/admin-nav';

export default function EnquiriesManager({ initial, openId }) {
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState(initial);
  const [status, setStatus] = useState('all');
  const [viewing, setViewing] = useState(() => initial.find((e) => e._id === openId) || null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const counts = ENQUIRY_STATUSES.reduce((acc, s) => ({ ...acc, [s]: rows.filter((r) => r.status === s).length }), {});
  const data = status === 'all' ? rows : rows.filter((r) => r.status === status);

  async function updateStatus(enquiry, next) {
    try {
      await api(`/api/enquiries/${enquiry._id}`, { method: 'PATCH', body: { status: next } });
      setRows((r) => r.map((e) => (e._id === enquiry._id ? { ...e, status: next } : e)));
      setViewing((v) => (v?._id === enquiry._id ? { ...v, status: next } : v));
      toast(`Marked as ${next}`);
      router.refresh(); // update the sidebar badge
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await api(`/api/enquiries/${deleting._id}`, { method: 'DELETE' });
      setRows((r) => r.filter((e) => e._id !== deleting._id));
      if (viewing?._id === deleting._id) setViewing(null);
      toast('Enquiry deleted');
      setDeleting(null);
      router.refresh();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  function exportCsv() {
    const cols = ['name', 'phone', 'email', 'service', 'message', 'status', 'createdAt'];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [cols.join(','), ...data.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `enquiries-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  }

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (e) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
            {e.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{e.name}</p>
            <p className="truncate text-xs text-slate-500">{e.email || 'No email'}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (e) => <span className="whitespace-nowrap">{e.phone}</span> },
    { key: 'service', header: 'Service', sortable: true, render: (e) => e.service || <span className="text-slate-400">—</span> },
    {
      key: 'message',
      header: 'Message',
      className: 'max-w-xs',
      render: (e) => <p className="line-clamp-2 text-slate-600">{e.message}</p>,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (e) => (
        <select
          value={e.status}
          onClick={(ev) => ev.stopPropagation()}
          onChange={(ev) => updateStatus(e, ev.target.value)}
          className="rounded-md border border-slate-200 bg-white py-1 pl-2 pr-7 text-xs font-medium capitalize text-slate-700 focus:border-brand-500 focus:outline-none"
          aria-label="Change status"
        >
          {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ),
    },
    {
      key: 'createdAt',
      header: 'Received',
      sortable: true,
      sortValue: (e) => new Date(e.createdAt).getTime(),
      render: (e) => <span className="whitespace-nowrap text-slate-500">{formatDate(e.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (e) => (
        <div className="flex justify-end gap-1" onClick={(ev) => ev.stopPropagation()}>
          <Button variant="ghost" size="icon" onClick={() => setViewing(e)} aria-label="View enquiry"><Eye className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleting(e)} aria-label="Delete enquiry" className="hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  const tabs = [['all', 'All', rows.length], ...ENQUIRY_STATUSES.map((s) => [s, s[0].toUpperCase() + s.slice(1), counts[s]])];

  return (
    <>
      <PageHeader title="Enquiries" description="Messages sent through the website contact form." />

      <DataTable
        columns={columns}
        data={data}
        searchKeys={['name', 'phone', 'email', 'service', 'message']}
        searchPlaceholder="Search name, phone, email…"
        onRowClick={setViewing}
        emptyTitle="No enquiries found"
        toolbar={
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {tabs.map(([key, label, n]) => (
              <button
                key={key}
                onClick={() => setStatus(key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  status === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {label}
                <span className={`rounded-full px-1.5 text-[10px] ${status === key ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'}`}>{n}</span>
              </button>
            ))}
          </div>
        }
        actions={
          <Button variant="secondary" onClick={exportCsv} disabled={!data.length}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing?.name}
        description={viewing && `Received ${formatDateTime(viewing.createdAt)}`}
        footer={
          viewing && (
            <>
              <Button variant="secondary" className="mr-auto hover:text-red-600" onClick={() => setDeleting(viewing)}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
              {viewing.status !== 'contacted' && <Button variant="secondary" onClick={() => updateStatus(viewing, 'contacted')}>Mark contacted</Button>}
              {viewing.status !== 'closed' && <Button onClick={() => updateStatus(viewing, 'closed')}>Mark closed</Button>}
            </>
          )
        }
      >
        {viewing && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={STATUS_TONE[viewing.status]} dot>{viewing.status}</Badge>
              {viewing.service && <Badge>{viewing.service}</Badge>}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <a href={`tel:${viewing.phone}`} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-brand-400">
                <Phone className="h-4 w-4 text-slate-400" /> {viewing.phone}
              </a>
              <a
                href={`https://wa.me/${viewing.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-brand-400"
              >
                <MessageCircle className="h-4 w-4 text-slate-400" /> WhatsApp
              </a>
              {viewing.email && (
                <a href={`mailto:${viewing.email}`} className="flex items-center gap-2 truncate rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-brand-400">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" /> <span className="truncate">{viewing.email}</span>
                </a>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Message</p>
              <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{viewing.message}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete enquiry?"
        message={deleting && `The enquiry from ${deleting.name} will be permanently deleted. This cannot be undone.`}
        loading={busy}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
