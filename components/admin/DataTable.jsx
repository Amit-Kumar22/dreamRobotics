'use client';

import { useMemo, useState, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

/*
  Reusable admin table: search, column sorting, pagination.

  <DataTable
    columns={[{ key: 'name', header: 'Name', sortable: true, render: (row) => ..., className: 'w-40' }]}
    data={rows}
    searchKeys={['name', 'email']}      // fields the search box looks in
    toolbar={<select .../>}             // extra filters, left of the search box
    actions={<button>Add</button>}      // buttons on the right of the toolbar
  />
*/
export default function DataTable({
  columns,
  data = [],
  rowKey = '_id',
  searchKeys = [],
  searchPlaceholder = 'Search…',
  toolbar,
  actions,
  pageSize: initialPageSize = 10,
  emptyTitle = 'No records found',
  emptyText = 'Try changing the search or filters.',
  onRowClick,
  compact = false,
}) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({ key: null, dir: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !searchKeys.length) return data;
    return data.filter((row) =>
      searchKeys.some((k) => {
        const v = row[k];
        return (Array.isArray(v) ? v.join(' ') : String(v ?? '')).toLowerCase().includes(q);
      })
    );
  }, [data, query, searchKeys]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const get = col?.sortValue || ((row) => row[sort.key]);
    return [...filtered].sort((a, b) => {
      const x = get(a) ?? '';
      const y = get(b) ?? '';
      const cmp = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  useEffect(() => setPage((p) => Math.min(p, pageCount)), [pageCount]);
  useEffect(() => setPage(1), [query]);

  const start = (page - 1) * pageSize;
  const rows = sorted.slice(start, start + pageSize);

  const toggleSort = (key) =>
    setSort((s) => (s.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : { key: null, dir: 'asc' }));

  const cell = compact ? 'px-4 py-2.5' : 'px-5 py-3.5';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {(searchKeys.length > 0 || toolbar || actions) && (
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {searchKeys.length > 0 && (
              <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            )}
            {toolbar}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`${cell} whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-slate-500 ${col.className || ''} ${col.align === 'right' ? 'text-right' : ''}`}
                >
                  {col.sortable ? (
                    <button type="button" onClick={() => toggleSort(col.key)} className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-slate-900">
                      {col.header}
                      {sort.key === col.key ? (
                        sort.dir === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, i) => (
              <tr
                key={row[rowKey] ?? i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`transition-colors hover:bg-slate-50/80 ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`${cell} align-middle text-slate-700 ${col.className || ''} ${col.align === 'right' ? 'text-right' : ''}`}>
                    {col.render ? col.render(row, start + i) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-900">{emptyTitle}</p>
            <p className="mt-1 text-sm text-slate-500">{emptyText}</p>
          </div>
        )}
      </div>

      {sorted.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-3">
            <span>
              Showing <span className="font-medium text-slate-900">{start + 1}</span>–
              <span className="font-medium text-slate-900">{Math.min(start + pageSize, sorted.length)}</span> of{' '}
              <span className="font-medium text-slate-900">{sorted.length}</span>
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
              aria-label="Rows per page"
            >
              {[5, 10, 25, 50].map((n) => (
                <option key={n} value={n}>{n} / page</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <PagerButton disabled={page === 1} onClick={() => setPage(page - 1)} label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </PagerButton>
            {pageNumbers(page, pageCount).map((n, idx) =>
              n === '…' ? (
                <span key={`gap${idx}`} className="px-2">…</span>
              ) : (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`h-8 min-w-8 rounded-md px-2 text-sm font-medium ${
                    n === page ? 'bg-ink-950 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {n}
                </button>
              )
            )}
            <PagerButton disabled={page === pageCount} onClick={() => setPage(page + 1)} label="Next page">
              <ChevronRight className="h-4 w-4" />
            </PagerButton>
          </div>
        </div>
      )}
    </div>
  );
}

function PagerButton({ children, label, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"
      {...props}
    >
      {children}
    </button>
  );
}

// 1 … 4 5 6 … 12
function pageNumbers(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const set = [1, page - 1, page, page + 1, count].filter((n) => n >= 1 && n <= count);
  const out = [];
  [...new Set(set)].sort((a, b) => a - b).forEach((n, i, arr) => {
    if (i && n - arr[i - 1] > 1) out.push('…');
    out.push(n);
  });
  return out;
}
