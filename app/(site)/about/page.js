import { Target, Eye } from 'lucide-react';
import Icon from '@/components/Icon';
import { PageHero, SectionHeader, FeatureCard, CtaBanner, ApiNotice } from '@/components/ui';
import { getPage, getItems, getSettings } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const { page } = await getPage('about');
  return { title: page?.title || 'About Us', description: page?.metaDescription };
}

export default async function AboutPage() {
  const [{ page, s }, items, settings] = await Promise.all([
    getPage('about'),
    getItems(['value', 'tech-area']),
    getSettings(),
  ]);

  return (
    <>
      <PageHero section={s.hero} />
      {!page && <ApiNotice />}

      {/* Story + mission/vision */}
      <section className="section bg-white">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            {s.story?.eyebrow && <p className="eyebrow">{s.story.eyebrow}</p>}
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{s.story?.title}</h2>
            {s.story?.body?.split('\n\n').map((para, idx) => (
              <p key={idx} className="mt-5 text-base leading-relaxed text-slate-600">
                {para}
              </p>
            ))}
          </div>
          <div className="grid gap-6">
            {[
              { sec: s.mission, IconCmp: Target },
              { sec: s.vision, IconCmp: Eye },
            ]
              .filter((x) => x.sec)
              .map(({ sec, IconCmp }) => (
                <div key={sec.key} className="relative overflow-hidden rounded-2xl bg-ink-900 p-8">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/20 blur-2xl" />
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-ink-950">
                      <IconCmp className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">{sec.title}</h3>
                    <p className="mt-3 leading-relaxed text-slate-400">{sec.body}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-slate-50">
        <div className="container-x">
          <SectionHeader section={s.values} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.value.map((it, idx) => (
              <FeatureCard key={it._id} item={it} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Technology areas */}
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeader section={s.techAreas} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {items['tech-area'].map((it) => (
              <div
                key={it._id}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 px-4 py-5 text-center transition hover:border-brand-300 hover:bg-brand-50/40"
              >
                <div className="icon-tile">
                  <Icon name={it.icon} />
                </div>
                <span className="text-sm font-semibold text-slate-800">{it.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner section={s.cta} settings={settings} />
    </>
  );
}
