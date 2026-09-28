import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Icon from '@/components/Icon';
import { SectionHeader, FeatureCard, CtaBanner, ApiNotice, HeroImage } from '@/components/ui';
import { getPage, getItems, getSettings } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [{ page, s }, items, settings] = await Promise.all([
    getPage('home'),
    getItems(['what-we-do', 'journey', 'product', 'project']),
    getSettings(),
  ]);

  const hero = s.hero || {};

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink-950 pb-16 pt-28 sm:pt-32 lg:pb-20">
        <HeroImage src={hero.image} />
        <div className="absolute inset-0 bg-grid bg-grid [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-spark-500/10 blur-3xl" />

        <div className="container-x relative grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {hero.eyebrow && (
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-slate-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
                {hero.eyebrow}
              </p>
            )}
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              {hero.title || settings?.tagline}
            </h1>
            {hero.subtitle && <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">{hero.subtitle}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={hero.ctaLink || '/contact'} className="btn-primary">
                {hero.ctaText || 'Start Your Project'} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#products" className="btn-ghost">
                Explore Our Products
              </Link>
            </div>
            {hero.body && <p className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.3em] text-brand-400">{hero.body}</p>}
          </div>

          {/* Capability panel */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-white/10 bg-ink-900/90 p-5 shadow-2xl shadow-brand-500/10 backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-spark-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <span className="font-mono text-xs text-slate-500">capabilities.online</span>
              </div>
              <ul className="mt-4 space-y-2">
                {items['what-we-do'].map((it) => (
                  <li key={it._id} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                      <Icon name={it.icon} className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                    </span>
                    <span className="flex-1 text-sm font-medium text-slate-200">{it.title}</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {!page && <ApiNotice />}

      {/* WHAT WE DO */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeader section={s.whatWeDo} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items['what-we-do'].map((it) => (
              <FeatureCard key={it._id} item={it} />
            ))}
            <Link
              href="/services"
              className="group flex h-full flex-col justify-between rounded-2xl bg-brand-500 p-5 text-ink-950 transition hover:bg-brand-400"
            >
              <span className="font-display text-xl font-bold">See all services</span>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                Training, IoT, drones, automation & more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="section relative overflow-hidden bg-ink-950">
        <div className="absolute inset-0 bg-grid bg-grid opacity-50" />
        <div className="container-x relative">
          <SectionHeader section={s.journey} dark />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {items.journey.map((it, idx) => (
              <li key={it._id} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="font-mono text-xs text-brand-400">STEP {String(idx + 1).padStart(2, '0')}</span>
                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                  <Icon name={it.icon} />
                </div>
                <h3 className="mt-3 text-base font-semibold text-white">{it.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{it.description}</p>
                {idx < items.journey.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-brand-500 lg:block" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="section scroll-mt-16 bg-slate-50">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <SectionHeader section={s.products} align="left" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.product.map((it) => (
              <FeatureCard key={it._id} item={it} />
            ))}
          </div>
          {s.products?.body && (
            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-brand-300 bg-white p-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-lg font-semibold text-slate-900">Need a Custom Product?</p>
                <p className="mt-1 text-sm text-slate-600">{s.products.body}</p>
              </div>
              <Link href="/contact" className="btn-dark shrink-0">
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section scroll-mt-16 bg-white">
        <div className="container-x">
          <SectionHeader section={s.projects} />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.project.map((it, idx) => (
              <article key={it._id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="relative flex h-32 items-center justify-center overflow-hidden bg-ink-900">
                  <div className="absolute inset-0 bg-grid bg-grid opacity-70" />
                  <div className="absolute h-32 w-32 rounded-full bg-brand-500/25 blur-2xl transition group-hover:bg-brand-500/40" />
                  <Icon name={it.icon} className="relative h-10 w-10 text-brand-300" strokeWidth={1.25} />
                  <span className="absolute left-4 top-4 font-mono text-xs text-slate-500">PRJ-{String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold sm:text-lg">{it.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{it.description}</p>
                  {it.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {it.tags.map((t) => (
                        <span key={t} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner section={s.cta} settings={settings} />
    </>
  );
}
