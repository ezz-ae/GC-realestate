import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PropertyFilters } from "@/components/property-filters"
import { PropertyCard } from "@/components/property-card"
import { PropertiesToolbar } from "@/components/properties-toolbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getPropertyListing } from "@/lib/entrestate"

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const page = Number(searchParams.page || 1)
  const pageSize = 12
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest"
  const viewParam = typeof searchParams.view === "string" ? searchParams.view : "grid"
  const view = viewParam === "list" ? "list" : "grid"
  const areas =
    typeof searchParams.areas === "string" ? searchParams.areas.split(",").filter(Boolean) : []
  const bedrooms =
    typeof searchParams.beds === "string" ? searchParams.beds.split(",").filter(Boolean) : []
  const propertyType = typeof searchParams.type === "string" ? searchParams.type : undefined
  const developer = typeof searchParams.developer === "string" ? searchParams.developer : undefined
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
  const freeholdOnly = searchParams.freehold === "true"
  const goldenVisa = searchParams.goldenVisa === "true"

  const { properties, total } = await getPropertyListing({
    page,
    pageSize,
    sort: sort as "newest" | "price-low" | "price-high" | "roi" | "yield",
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
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value == null) return
      if (Array.isArray(value)) {
        params.set(key, value.join(","))
      } else {
        params.set(key, value)
      }
    })
    params.set("page", String(nextPage))
    return `/properties?${params.toString()}`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
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
            <div className="flex gap-8">
              {/* Filters Sidebar */}
              <aside className="hidden w-80 shrink-0 lg:block">
                <div className="sticky top-20">
                  <PropertyFilters />
                </div>
              </aside>

              {/* Results */}
              <div className="flex-1">
                <PropertiesToolbar total={total} page={page} pageSize={pageSize} sort={sort} view={view} />

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
                <div className="mt-12 flex items-center justify-center gap-2">
                  <Button variant="outline" asChild disabled={page <= 1}>
                    <Link href={buildPageLink(Math.max(1, page - 1))}>Previous</Link>
                  </Button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => (
                      <Button
                        key={`${p}-${idx}`}
                        variant={p === page ? "secondary" : "outline"}
                        className={p === page ? "gold-gradient" : ""}
                        asChild
                      >
                        <Link href={buildPageLink(p)}>{p}</Link>
                      </Button>
                    ))}
                  <Button variant="outline" asChild disabled={page >= totalPages}>
                    <Link href={buildPageLink(Math.min(totalPages, page + 1))}>Next</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
