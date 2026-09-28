import Icon from '@/components/Icon';
import { PageHero, SectionHeader, FeatureCard, CtaBanner, ApiNotice } from '@/components/ui';
import { getPage, getItems, getSettings } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const { page } = await getPage('services');
  return { title: page?.title || 'Services', description: page?.metaDescription };
}

export default async function ServicesPage() {
  const [{ page, s }, items, settings] = await Promise.all([
    getPage('services'),
    getItems(['service', 'why-us', 'printing-service', 'printing-step']),
    getSettings(),
  ]);

  return (
    <>
      <PageHero section={s.hero} />
      {!page && <ApiNotice />}

      {/* Services */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeader section={s.services} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.service.map((it) => (
              <FeatureCard key={it._id} item={it} />
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section bg-slate-50">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          <div>
            <SectionHeader section={s.whyUs} align="left" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
            {items['why-us'].map((it) => (
              <div key={it._id} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <div className="icon-tile shrink-0">
                  <Icon name={it.icon} />
                </div>
                <div>
                  <h3 className="font-semibold">{it.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{it.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Printing */}
      <section id="3d-printing" className="section relative scroll-mt-16 overflow-hidden bg-ink-950">
        <div className="absolute inset-0 bg-grid bg-grid opacity-50" />
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="container-x relative">
          <SectionHeader section={s.printing} dark align="left" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items['printing-service'].map((it) => (
              <div key={it._id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-brand-500/50">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                  <Icon name={it.icon} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{it.description}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-20">
            <div className="mb-10">
              {s.printingSteps?.eyebrow && <p className="eyebrow text-brand-400">{s.printingSteps.eyebrow}</p>}
              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{s.printingSteps?.title}</h3>
            </div>
            <ol className="relative grid gap-8 md:grid-cols-5 md:gap-4">
              <div className="absolute left-5 top-5 hidden h-px w-[calc(100%-2.5rem)] bg-gradient-to-r from-brand-500 via-brand-500/40 to-brand-500/10 md:block" />
              {items['printing-step'].map((it, idx) => (
                <li key={it._id} className="relative flex gap-4 md:flex-col">
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 font-display text-sm font-bold text-ink-950 ring-4 ring-ink-950">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-white">{it.title}</h4>
                    <p className="mt-1 text-sm text-slate-400">{it.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <CtaBanner section={s.cta} settings={settings} />
    </>
  );
}
