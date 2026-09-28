'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/#products', label: 'Products' },
  { href: '/#projects', label: 'Projects' },
];

export default function Navbar({ settings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const name = settings?.companyName || 'DreamRobotics';
  const isActive = (href) => (href === '/' ? pathname === '/' : !href.includes('#') && pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'border-b border-white/10 bg-ink-950/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${name} home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 font-display text-lg font-bold text-ink-950">
            {name.charAt(0)}
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            {name.replace(/Robotics$/i, '')}
            <span className="text-brand-400">{/Robotics$/i.test(name) ? 'Robotics' : ''}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive(l.href) ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {settings?.phone && (
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
              <Phone className="h-4 w-4 text-brand-400" /> {settings.phone}
            </a>
          )}
          <Link href="/contact" className="btn-primary px-4 py-2">
            Contact Us
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-slate-200 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="container-x pb-6 md:hidden">
          <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-md px-3 py-2.5 text-base font-medium text-slate-200 hover:bg-white/5">
                {l.label}
              </Link>
            ))}
            <Link href="/contact" className="btn-primary mt-3">
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
