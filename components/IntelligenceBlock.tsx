// ─────────────────────────────────────────────────────────────────
// components/IntelligenceBlock.tsx
// Homepage intelligence block — 3 panels + pulse strip
// ─────────────────────────────────────────────────────────────────
import Link  from "next/link"

type Props = { data: Awaited<ReturnType<typeof import("@/lib/intelligence-block").getIntelligenceBlockData>> }

export function IntelligenceBlock({ data }: Props) {
  const { trending, best_areas, pulse, below_market } = data

  return (
    <section className="w-full bg-[#1C1C1E] text-white py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-[#C9A961] uppercase tracking-widest mb-1">
              Live Market Intelligence
            </p>
            <h2 className="text-3xl font-bold font-['Playfair_Display'] text-white">
              What Moves Dubai Right Now
            </h2>
          </div>
          <span className="text-xs text-zinc-500">
            Data: Entrestate Intelligence · Updated every 10 min
          </span>
        </div>

        {/* ── Pulse strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border border-zinc-800 rounded-2xl p-5 bg-zinc-900/50">
          {[
            { label: "Off-Plan Projects",   value: Number(pulse.total_projects).toLocaleString() },
            { label: "Avg Rental Yield",    value: `${pulse.avg_yield}%` },
            { label: "Golden Visa Eligible",value: Number(pulse.gv_count).toLocaleString() },
            { label: "Areas Covered",       value: Number(pulse.area_count).toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-[#C9A961]">{value}</p>
              <p className="text-xs text-zinc-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* ── 3-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Panel 1 — Trending Projects */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-semibold text-[#C9A961] uppercase tracking-widest">
              🔥 Trending Now
            </h3>
            {trending.slice(0, 4).map((p: any) => (
              <Link href={`/projects/${p.slug}`} key={p.slug}
                className="flex gap-3 items-center p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition group">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <Image src={p.hero_image} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate group-hover:text-[#C9A961] transition">
                    {p.name}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">{p.area}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-emerald-400">{Number(p.rental_yield).toFixed(1)}% yield</span>
                    {p.golden_visa_eligible && (
                      <span className="text-xs text-[#C9A961]">Golden Visa</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-zinc-500 shrink-0">
                  AED {(p.price_from_aed / 1e6).toFixed(1)}M
                </p>
              </Link>
            ))}
          </div>

          {/* Panel 2 — Best Yield Areas */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-semibold text-[#C9A961] uppercase tracking-widest">
              💰 Best Yield Areas
            </h3>
          {best_areas.map((a: any) => (
            <Link
              href={`/areas/${a.slug}`}
              key={a.slug}
              className="flex flex-col gap-2 rounded-xl border border-border bg-zinc-900/70 p-4 transition hover:border-[#C9A961]"
            >
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs">{a.project_count} projects</div>
              </div>
              <div className="text-2xl font-bold text-[#C9A961]">{Number(a.avg_yield).toFixed(1)}%</div>
              <div className="text-xs uppercase tracking-widest text-zinc-400">average yield</div>
            </Link>
          ))}
          </div>

          {/* Panel 3 — Below Market */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-semibold text-[#C9A961] uppercase tracking-widest">
              📉 Below Market Price
            </h3>
            {below_market.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4">No active below-market listings.</p>
            ) : below_market.map((p: any) => (
              <Link href={`/projects/${p.slug}`} key={p.slug}
                className="flex gap-3 items-center p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition group">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <Image src={p.hero_image} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate group-hover:text-[#C9A961] transition">
                    {p.name}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">{p.area}</p>
                  <span className="inline-block mt-1 text-xs bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-full">
                    {Math.abs(p.vs_cohort).toFixed(0)}% below cohort
                  </span>
                </div>
                <p className="text-xs text-zinc-500 shrink-0">
                  AED {(p.price_from_aed / 1e6).toFixed(1)}M
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center pt-4">
          <Link href="/search"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A961] to-[#B8860B]
                       text-black font-semibold px-8 py-3 rounded-full hover:opacity-90 transition">
            Explore All 3,500+ Projects →
          </Link>
        </div>

      </div>
    </section>
  )
}
