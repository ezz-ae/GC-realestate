import { PropertyFilters } from "@/components/property-filters"
import { MobilePropertyFilters } from "@/components/mobile-property-filters"
import { PropertyCard } from "@/components/property-card"
import { PropertiesToolbar } from "@/components/properties-toolbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getPropertyListing } from "@/lib/entrestate"

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const page = Number(params.page || 1)
  const pageSize = 12
  const sort = typeof params.sort === "string" ? params.sort : "score"
  const viewParam = typeof params.view === "string" ? params.view : "grid"
  const view = viewParam === "list" ? "list" : "grid"
  const areas = typeof params.areas === "string" ? params.areas.split(",").filter(Boolean) : []
  const bedrooms = typeof params.beds === "string" ? params.beds.split(",").filter(Boolean) : []
  const propertyType = typeof params.type === "string" ? params.type : undefined
  const developer = typeof params.developer === "string" ? params.developer : undefined
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
  const freeholdOnly = params.freehold === "true"
  const goldenVisa = params.goldenVisa === "true"

  const { properties, total } = await getPropertyListing({
    page,
    pageSize,
    sort: sort as "score" | "newest" | "price-low" | "price-high" | "roi" | "yield",
    areas,
    bedrooms,
    propertyType,
    developer,
    minPrice,
    maxPrice,
    freeholdOnly,
    goldenVisa,
  })

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const buildPageLink = (nextPage: number) => {
    const q = new URLSearchParams()
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value == null) return
      if (Array.isArray(value)) {
        q.set(key, value.join(","))
      } else {
        q.set(key, value)
      }
    })
    q.set("page", String(nextPage))
    return `/properties?${q.toString()}`
  }

  return (
    <>
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-12">
          <div className="container">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="font-serif text-4xl font-bold">Dubai Properties</h1>
                <p className="mt-2 text-muted-foreground">
                  Browse 3500+ luxury properties across Dubai
                </p>
              </div>
              <Button className="gold-gradient" asChild>
                <Link href="/chat">Ask AI</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="py-8">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
              {/* Filters Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <PropertyFilters collapsible defaultOpen={false} />
                </div>
              </aside>

              {/* Results */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                   <div className="lg:hidden">
                     <MobilePropertyFilters />
                   </div>
                   <div className="flex-1">
                     <PropertiesToolbar total={total} page={page} pageSize={pageSize} sort={sort} view={view} />
                   </div>
                </div>

                {/* Properties Grid */}
                <div
                  className={
                    view === "list"
                      ? "grid gap-6"
                      : "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  }
                >
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                  <Link
                    href={buildPageLink(Math.max(1, page - 1))}
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium transition hover:border-foreground hover:text-foreground",
                      page <= 1 && "pointer-events-none opacity-50"
                    )}
                  >
                    Previous
                  </Link>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, idx) => (
                      <Link
                        key={`${p}-${idx}`}
                        href={buildPageLink(p)}
                        className={cn(
                          "inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium transition",
                          p === page
                            ? "border-secondary bg-secondary text-secondary-foreground"
                            : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                        )}
                        aria-current={p === page ? "page" : undefined}
                      >
                        {p}
                      </Link>
                    ))}
                  <Link
                    href={buildPageLink(Math.min(totalPages, page + 1))}
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium transition hover:border-foreground hover:text-foreground",
                      page >= totalPages && "pointer-events-none opacity-50"
                    )}
                  >
                    Next
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  )
}
