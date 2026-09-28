'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown, LogOut, UserCog, ExternalLink, Bell } from 'lucide-react';
import Icon from '@/components/Icon';
import { ADMIN_NAV } from '@/lib/admin-nav';
import { ToastProvider } from './Toast';

const isActive = (pathname, href) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

export default function AdminShell({ admin, companyName = 'DreamRobotics', counts = {}, children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => setSidebarOpen(false), [pathname]);

  useEffect(() => {
    // While logged in, the browser Back button must not leave the admin panel
    // (e.g. back to the public page or login page visited before signing in).
    const onPopState = () => {
      const path = window.location.pathname;
      if (!path.startsWith('/admin') || path.startsWith('/admin/login')) window.history.go(1);
    };
    // After logout, Back could restore an admin page from the browser's page cache: reload it so the
    // server checks the session again.
    const onPageShow = (e) => e.persisted && window.location.reload();
    window.addEventListener('popstate', onPopState);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  const current = ADMIN_NAV.flatMap((g) => g.links).filter((l) => isActive(pathname, l.href)).sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50">
        {/* Mobile backdrop */}
        {sidebarOpen && <div className="fixed inset-0 z-40 bg-ink-950/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-ink-950 transition-transform duration-200 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 font-display text-lg font-bold text-ink-950">
                {companyName.charAt(0)}
              </span>
              <span className="leading-tight">
                <span className="block font-display text-base font-bold text-white">{companyName}</span>
                <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-500">Admin Console</span>
              </span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="rounded-md p-1 text-slate-400 hover:text-white lg:hidden" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5 [scrollbar-width:thin]">
            {ADMIN_NAV.map((group) => (
              <div key={group.title}>
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{group.title}</p>
                <ul className="space-y-0.5">
                  {group.links.map((link) => {
                    const active = current?.href === link.href;
                    const badge = link.badge ? counts[link.badge] : 0;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                            active ? 'bg-brand-500/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
                              active ? 'bg-brand-500 text-ink-950' : 'bg-white/5 text-slate-400 group-hover:text-white'
                            }`}
                          >
                            <Icon name={link.icon} className="h-4 w-4" />
                          </span>
                          <span className="flex-1 truncate">{link.label}</span>
                          {badge > 0 && (
                            <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-semibold text-ink-950">{badge}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 hover:border-white/30 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" /> View website
            </Link>
          </div>
        </aside>

        {/* Main column */}
        <div className="lg:pl-72">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>

            <nav className="flex min-w-0 flex-1 items-center gap-2 text-sm" aria-label="Breadcrumb">
              <Link href="/admin" className="hidden text-slate-500 hover:text-slate-900 sm:inline">Admin</Link>
              {current && current.href !== '/admin' && (
                <>
                  <span className="hidden text-slate-300 sm:inline">/</span>
                  <span className="truncate font-medium text-slate-900">{current.label}</span>
                </>
              )}
              {current?.href === '/admin' && <><span className="hidden text-slate-300 sm:inline">/</span><span className="font-medium text-slate-900">Dashboard</span></>}
            </nav>

            <Link
              href="/admin/enquiries"
              className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label={`${counts.newEnquiries || 0} new enquiries`}
            >
              <Bell className="h-5 w-5" />
              {counts.newEnquiries > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
            </Link>

            <ProfileMenu admin={admin} />
          </header>

          <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}

function ProfileMenu({ admin }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function logout() {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    // Full page load (not client navigation) so no cached admin pages survive the logout
    window.location.replace('/');
  }

  const initials = (admin.name || admin.email).split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-slate-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm font-semibold text-slate-900">{admin.name}</span>
          <span className="block text-xs text-slate-500">Administrator</span>
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{admin.name}</p>
              <p className="truncate text-xs text-slate-500">{admin.email}</p>
            </div>
          </div>
          <div className="p-1.5">
            <MenuLink href="/admin/profile" onClick={() => setOpen(false)} icon={UserCog}>My profile</MenuLink>
            <MenuLink href="/" target="_blank" onClick={() => setOpen(false)} icon={ExternalLink}>View website</MenuLink>
          </div>
          <div className="border-t border-slate-100 p-1.5">
            <button
              role="menuitem"
              onClick={logout}
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" /> {loggingOut ? 'Logging out…' : 'Log out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({ icon: IconCmp, children, ...props }) {
  return (
    <Link role="menuitem" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" {...props}>
      <IconCmp className="h-4 w-4 text-slate-400" /> {children}
    </Link>
  );
}
