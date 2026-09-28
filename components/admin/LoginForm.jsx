'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || 'Login failed');
      router.replace('/admin');
      router.refresh();
    } catch (err) {
      setStatus({ state: 'error', message: err.message || 'Unable to reach the server.' });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" value={form.email} onChange={onChange} className="field" placeholder="admin@dreamrobotics.in" />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" value={form.password} onChange={onChange} className="field" placeholder="••••••••" />
      </div>
      {status.state === 'error' && (
        <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {status.message}
        </p>
      )}
      <button type="submit" disabled={status.state === 'loading'} className="btn-primary w-full disabled:opacity-60">
        {status.state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        Log in
      </button>
    </form>
  );
}
