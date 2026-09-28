import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import LoginForm from '@/components/admin/LoginForm';
import { getAdminSession } from '@/lib/admin-session';
import { getSettings } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin Login', robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect('/admin');
  const settings = await getSettings();
  const name = settings?.companyName || 'DreamRobotics';

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero-about.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/30" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 font-display text-lg font-bold text-ink-950">{name.charAt(0)}</span>
            <span className="font-display text-xl font-bold text-white">{name}</span>
          </Link>
          <div>
            <p className="font-display text-3xl font-bold leading-tight text-white">Manage your website,<br />enquiries and content.</p>
            <p className="mt-4 max-w-md text-slate-400">{settings?.tagline || 'Turning Ideas Into Technology'}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col px-6 py-10 sm:px-12">
        <Link href="/" className="inline-flex items-center gap-1.5 self-start text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Back to website
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to the {name} admin console.</p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
        <p className="text-center text-xs text-slate-400">© {new Date().getFullYear()} {name}. Authorised personnel only.</p>
      </div>
    </div>
  );
}
