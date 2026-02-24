import type { AreaProfile, DeveloperProfile, Project, Property } from "@/lib/types/project"
import { query } from "@/lib/db"

type ProjectRow = {
  id?: string
  slug?: string
  payload: Project
}

type AreaRow = {
  slug: string
  name: string
  area_type: string | null
  avg_score: number | null
  median_price_aed: number | null
  project_count: number | null
  avg_yield: number | null
  image: string | null
  hero_video: string | null
  payload: {
    name?: string
    slug?: string
    image?: string
    areaType?: string
    avgScore?: number
    avgYield?: number
    heroVideo?: string
    whyInvest?: string[]
    description?: string
    projectCount?: number
    medianPriceAed?: number
    nearbyLandmarks?: Array<{ name: string; distance: string }>
  }
}

type DeveloperRow = {
  id: string
  slug: string
  name: string
  tier: string | null
  avg_score: number | null
  honesty_index: number | null
  risk_discount: boolean | null
  logo: string | null
  banner_image: string | null
  payload: {
    id?: string
    logo?: string
    name?: string
    slug?: string
    tier?: string
    awards?: string[]
    avgScore?: number
    bannerImage?: string
    description?: string
    trackRecord?: string
    honestyIndex?: number
    projectCount?: number
    riskDiscount?: boolean
    galleryImages?: string[]
    activeProjects?: number
    completedProjects?: number
    foundedYear?: number | string
    headquarters?: string
    website?: string
  }
}

const USD_RATE = 0.2723

const titleCase = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const parseBedrooms = (unitType: string) => {
  const normalized = unitType.toLowerCase()
  if (normalized.includes("studio")) return 0
  const match = normalized.match(/(\\d+)/)
  return match ? Number(match[1]) : 1
}

export const projectToProperty = (project: Project): Property => {
  const primaryUnit = project.units?.[0]
  const bedrooms = primaryUnit ? parseBedrooms(primaryUnit.type) : 1
  const sizeSqft = primaryUnit?.sizeFrom ?? 900
  const sizeSqm = Math.round(sizeSqft * 0.0929)
  const price = primaryUnit?.priceFrom ?? 1500000

  return {
    id: project.id,
    title: `${project.name} ${primaryUnit?.type || "Residence"}`,
    slug: project.slug,
    type: "off-plan",
    category: "apartment",
    price,
    currency: "AED",
    location: {
      area: project.location.area,
      district: project.location.district || "Dubai",
      city: project.location.city || "Dubai",
      coordinates: project.location.coordinates,
      freehold: project.location.freehold,
    },
    specifications: {
      bedrooms,
      bathrooms: Math.max(1, bedrooms),
      sizeSqft,
      sizeSqm,
      parkingSpaces: bedrooms > 2 ? 2 : 1,
      furnished: false,
      view: project.tagline || "City view",
    },
    images: project.gallery?.length ? project.gallery : [project.heroImage],
    video: project.heroVideo,
    virtualTour: project.virtualTour,
    description: project.description,
    highlights: project.highlights || [],
    amenities: project.amenities || [],
    developer: project.developer,
    project: { id: project.id, name: project.name, slug: project.slug },
    investmentMetrics: {
      roi: project.investmentHighlights.expectedROI,
      rentalYield: project.investmentHighlights.rentalYield,
      appreciationRate: project.investmentHighlights.rentalYield,
      goldenVisaEligible: project.investmentHighlights.goldenVisaEligible,
    },
    paymentPlan: project.paymentPlan,
    completionDate: project.timeline.expectedCompletion,
    handoverDate: project.timeline.handoverDate,
    status: "available",
    featured: project.featured,
    seoTitle: project.seoTitle,
    seoDescription: project.seoDescription,
    seoKeywords: project.seoKeywords,
    nearbyLandmarks: project.location.nearbyLandmarks?.map((landmark) => ({
      name: landmark.name,
      distance: landmark.distance,
    })),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }
}

const normalizeProjectPayload = (row: ProjectRow) => {
  const payload = row.payload || ({} as Project)
  return {
    ...payload,
    id: payload.id || row.id || "",
    slug: payload.slug || row.slug || "",
  }
}

const mapAreaRow = (row: AreaRow): AreaProfile => {
  const payload = row.payload || {}
  const areaType = payload.areaType || row.area_type || "urban"
  const lifestyleTags = [titleCase(areaType)]

  return {
    id: payload.slug || row.slug,
    name: payload.name || row.name,
    slug: payload.slug || row.slug,
    heroImage: payload.image || row.image || "/logo.png",
    heroVideo: payload.heroVideo || row.hero_video || undefined,
    description: payload.description || "Dubai community overview.",
    avgPricePerSqft: Number(payload.medianPriceAed || row.median_price_aed || 0),
    rentalYield: Number(payload.avgYield || row.avg_yield || 0),
    investmentScore: Number(payload.avgScore || row.avg_score || 0),
    freehold: true,
    landmarks:
      payload.nearbyLandmarks?.map((landmark) => ({
        name: landmark.name,
        distance: landmark.distance,
        type: "mall",
      })) || [],
    investmentReasons: payload.whyInvest || [],
    lifestyleTags,
    propertyCount: Number(payload.projectCount || row.project_count || 0),
  }
}

const mapDeveloperRow = (row: DeveloperRow): DeveloperProfile => {
  const payload = row.payload || {}
  return {
    id: payload.id || row.id,
    name: payload.name || row.name,
    slug: payload.slug || row.slug,
    tier: payload.tier || row.tier || undefined,
    logo: payload.logo || row.logo || "/logo.png",
    bannerImage: payload.bannerImage || row.banner_image || "/logo.png",
    galleryImages: payload.galleryImages || [payload.bannerImage || row.banner_image || "/logo.png"],
    description: payload.description || "Developer profile overview.",
    trackRecord: payload.trackRecord || "Strong delivery track record in Dubai.",
    awards: payload.awards || [],
    website: payload.website || undefined,
    foundedYear: payload.foundedYear ? Number(payload.foundedYear) : undefined,
    headquarters: payload.headquarters || undefined,
    activeProjects: payload.activeProjects ? Number(payload.activeProjects) : undefined,
    completedProjects: payload.completedProjects ? Number(payload.completedProjects) : undefined,
    projectCount: payload.projectCount ? Number(payload.projectCount) : undefined,
  }
}

export async function getProjectsForGrid(limit = 50) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects WHERE status = 'selling' ORDER BY market_score DESC LIMIT $1`,
    [limit],
  )
  return rows.map((row) => normalizeProjectPayload(row))
}

export async function getProjectBySlug(slug: string) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects WHERE slug = $1 OR payload->>'slug' = $1 LIMIT 1`,
    [slug],
  )
  return rows[0] ? normalizeProjectPayload(rows[0]) : null
}

export async function getProperties(limit = 12) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects WHERE status = 'selling' ORDER BY market_score DESC LIMIT $1`,
    [limit],
  )
  return rows.map((row) => projectToProperty(normalizeProjectPayload(row)))
}

export async function getFeaturedProperties(limit = 3) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload
     FROM gc_projects
     WHERE status = 'selling'
       AND COALESCE(hero_image, '') <> ''
       AND jsonb_typeof(payload->'gallery') = 'array'
       AND jsonb_array_length(payload->'gallery') >= 4
       AND jsonb_typeof(payload->'units') = 'array'
       AND jsonb_array_length(payload->'units') > 0
       AND (payload->'investmentHighlights'->>'expectedROI')::numeric > 0
     ORDER BY market_score DESC NULLS LAST, rental_yield DESC NULLS LAST
     LIMIT $1`,
    [limit],
  )

  const primary = rows.map((row) => projectToProperty(normalizeProjectPayload(row)))
  if (primary.length >= limit) return primary

  const excludeIds = rows.map((row) => row.id)
  const fillRows = await query<ProjectRow>(
    `SELECT id, slug, payload
     FROM gc_projects
     WHERE status = 'selling'
       AND id <> ALL($1::text[])
     ORDER BY market_score DESC NULLS LAST, rental_yield DESC NULLS LAST
     LIMIT $2`,
    [excludeIds, limit - primary.length],
  )

  return [...primary, ...fillRows.map((row) => projectToProperty(normalizeProjectPayload(row)))]
}

export interface PropertyListingFilters {
  page?: number
  pageSize?: number
  sort?: "newest" | "price-low" | "price-high" | "roi" | "yield"
  areas?: string[]
  developer?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: string[]
  propertyType?: string
  freeholdOnly?: boolean
  goldenVisa?: boolean
}

const buildPropertyListingWhere = (filters: PropertyListingFilters, values: Array<string | number | boolean>) => {
  const where: string[] = []

  if (filters.areas?.length) {
    const areaClauses = filters.areas.map((area) => {
      values.push(`%${area}%`)
      return `area ILIKE $${values.length}`
    })
    where.push(`(${areaClauses.join(" OR ")})`)
  }

  if (filters.developer && filters.developer !== "All Developers") {
    values.push(`%${filters.developer}%`)
    where.push(`developer_name ILIKE $${values.length}`)
  }

  if (typeof filters.minPrice === "number") {
    values.push(filters.minPrice)
    where.push(`price_from_aed >= $${values.length}`)
  }

  if (typeof filters.maxPrice === "number") {
    values.push(filters.maxPrice)
    where.push(`price_to_aed <= $${values.length}`)
  }

  if (filters.goldenVisa) {
    where.push(`golden_visa_eligible = true`)
  }

  if (filters.freeholdOnly) {
    where.push(`(payload->'location'->>'freehold')::boolean = true`)
  }

  if (filters.propertyType && filters.propertyType !== "All Types") {
    values.push(`%${filters.propertyType.toLowerCase()}%`)
    where.push(
      `EXISTS (SELECT 1 FROM jsonb_array_elements(payload->'units') AS unit WHERE lower(unit->>'type') LIKE $${values.length})`,
    )
  }

  if (filters.bedrooms?.length) {
    const bedClauses = filters.bedrooms.map((bed) => {
      if (bed.toLowerCase() === "studio") {
        return `lower(unit->>'type') LIKE '%studio%'`
      }
      if (bed === "5+") {
        return `(unit->>'type') ~ '[5-9]'`
      }
      const bedNumber = Number(bed)
      if (Number.isFinite(bedNumber)) {
        values.push(`%${bedNumber}%`)
        return `unit->>'type' LIKE $${values.length}`
      }
      return "false"
    })
    where.push(
      `EXISTS (SELECT 1 FROM jsonb_array_elements(payload->'units') AS unit WHERE ${bedClauses.join(" OR ")})`,
    )
  }

  where.push(`status = 'selling'`)

  return where
}

export async function getPropertyListing(filters: PropertyListingFilters) {
  const pageSize = Math.max(1, filters.pageSize || 12)
  const page = Math.max(1, filters.page || 1)
  const offset = (page - 1) * pageSize
  const values: Array<string | number | boolean> = []
  const where = buildPropertyListingWhere(filters, values)
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : ""

  let orderBy = "market_score DESC NULLS LAST"
  switch (filters.sort) {
    case "newest":
      orderBy = "created_at DESC NULLS LAST"
      break
    case "price-low":
      orderBy = "price_from_aed ASC NULLS LAST"
      break
    case "price-high":
      orderBy = "price_from_aed DESC NULLS LAST"
      break
    case "roi":
      orderBy = "COALESCE((payload->'investmentHighlights'->>'expectedROI')::numeric, rental_yield) DESC NULLS LAST"
      break
    case "yield":
      orderBy = "rental_yield DESC NULLS LAST"
      break
    default:
      break
  }

  const countRows = await query<{ total: number }>(
    `SELECT COUNT(*)::int AS total FROM gc_projects ${whereClause}`,
    values,
  )
  const total = countRows[0]?.total || 0

  values.push(pageSize, offset)
  const rows = await query<ProjectRow>(
    `SELECT payload FROM gc_projects ${whereClause} ORDER BY ${orderBy} LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  )

  return {
    total,
    properties: rows.map((row) => projectToProperty(row.payload)),
  }
}

export async function getPropertiesByArea(area: string, limit = 12) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects WHERE area ILIKE $1 ORDER BY market_score DESC LIMIT $2`,
    [`%${area}%`, limit],
  )
  return rows.map((row) => projectToProperty(normalizeProjectPayload(row)))
}

export async function getPropertyBySlug(slug: string) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects WHERE slug = $1 OR payload->>'slug' = $1 LIMIT 1`,
    [slug],
  )
  if (!rows[0]?.payload) return null
  return projectToProperty(normalizeProjectPayload(rows[0]))
}

export async function getAreas() {
  const rows = await query<AreaRow>(
    `SELECT slug, name, area_type, avg_score, median_price_aed, project_count, avg_yield, image, hero_video, payload FROM gc_area_profiles ORDER BY avg_yield DESC`,
  )
  return rows.map(mapAreaRow)
}

export async function getAreaBySlug(slug: string) {
  const rows = await query<AreaRow>(
    `SELECT slug, name, area_type, avg_score, median_price_aed, project_count, avg_yield, image, hero_video, payload FROM gc_area_profiles WHERE slug = $1 LIMIT 1`,
    [slug],
  )
  return rows[0] ? mapAreaRow(rows[0]) : null
}

export async function getDevelopers() {
  const rows = await query<DeveloperRow>(
    `SELECT id, slug, name, tier, avg_score, honesty_index, risk_discount, logo, banner_image, payload FROM gc_developer_profiles ORDER BY avg_score DESC`,
  )
  return rows.map(mapDeveloperRow)
}

export async function getDeveloperBySlug(slug: string) {
  const rows = await query<DeveloperRow>(
    `SELECT id, slug, name, tier, avg_score, honesty_index, risk_discount, logo, banner_image, payload FROM gc_developer_profiles WHERE slug = $1 LIMIT 1`,
    [slug],
  )
  return rows[0] ? mapDeveloperRow(rows[0]) : null
}

export async function searchProjects(queryText: string, limit = 5) {
  const q = `%${queryText}%`
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects WHERE name ILIKE $1 OR area ILIKE $1 OR developer_name ILIKE $1 OR slug ILIKE $1 OR payload->>'slug' ILIKE $1 ORDER BY market_score DESC LIMIT $2`,
    [q, limit],
  )
  return rows.map((row) => normalizeProjectPayload(row))
}

export async function getTopROIProjects(limit = 5) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects ORDER BY rental_yield DESC LIMIT $1`,
    [limit],
  )
  return rows.map((row) => normalizeProjectPayload(row))
}

export async function getGoldenVisaProjects(limit = 5) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects WHERE golden_visa_eligible = true ORDER BY market_score DESC LIMIT $1`,
    [limit],
  )
  return rows.map((row) => normalizeProjectPayload(row))
}

export async function getProjectsByArea(area: string, limit = 5) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects WHERE area ILIKE $1 ORDER BY market_score DESC LIMIT $2`,
    [`%${area}%`, limit],
  )
  return rows.map((row) => normalizeProjectPayload(row))
}

export async function getProjectsByDeveloper(developerName: string, limit = 6) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects WHERE developer_name ILIKE $1 ORDER BY market_score DESC LIMIT $2`,
    [`%${developerName}%`, limit],
  )
  return rows.map((row) => normalizeProjectPayload(row))
}

export async function getPropertiesByDeveloper(developerName: string, limit = 6) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects WHERE developer_name ILIKE $1 ORDER BY market_score DESC LIMIT $2`,
    [`%${developerName}%`, limit],
  )
  return rows.map((row) => projectToProperty(normalizeProjectPayload(row)))
}

export async function getProjectsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return []
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects WHERE slug = ANY($1) OR payload->>'slug' = ANY($1)`,
    [slugs],
  )
  return rows.map((row) => normalizeProjectPayload(row))
}

export async function getLlmContextByArea(area: string, limit = 8) {
  const rows = await query<{ llm_context: string }>(
    `SELECT llm_context FROM gc_projects WHERE area ILIKE $1 ORDER BY market_score DESC LIMIT $2`,
    [`%${area}%`, limit],
  )
  return rows.map((row) => row.llm_context).filter(Boolean).join("\n\n")
}

export interface DeveloperStats {
  listings: number
  active: number
  completed: number
  avgYield: number
  avgScore: number
  goldenVisaCount: number
  minPrice: number
  maxPrice: number
  onTimeDeliveryRate: number | null
  firstProjectYear: number | null
  topAreas: Array<{ area: string; count: number }>
  flagshipProjects: Array<{ id: string; slug: string; name: string; marketScore: number | null }>
}

export async function getDeveloperStats(developerName: string): Promise<DeveloperStats> {
  const rows = await query<{
    listings: number
    active: number
    completed: number
    avg_yield: number | null
    avg_score: number | null
    golden_visa_count: number
    min_price: number | null
    max_price: number | null
    on_time_rate: number | null
    first_project_date: string | null
  }>(
    `SELECT
      COUNT(*)::int AS listings,
      COUNT(*) FILTER (WHERE status IN ('selling','launching'))::int AS active,
      COUNT(*) FILTER (WHERE status = 'completed')::int AS completed,
      AVG(rental_yield)::float AS avg_yield,
      AVG(market_score)::float AS avg_score,
      COUNT(*) FILTER (WHERE golden_visa_eligible = true)::int AS golden_visa_count,
      MIN(price_from_aed)::float AS min_price,
      MAX(price_to_aed)::float AS max_price,
      MIN(COALESCE(handover_date, created_at)) AS first_project_date,
      CASE
        WHEN COUNT(*) FILTER (WHERE status = 'completed') = 0 THEN NULL
        ELSE (
          COUNT(*) FILTER (
            WHERE status = 'completed' AND handover_date IS NOT NULL AND handover_date <= CURRENT_DATE
          )::float
          / COUNT(*) FILTER (WHERE status = 'completed')::float
        ) * 100
      END AS on_time_rate
     FROM gc_projects
     WHERE developer_name ILIKE $1`,
    [`%${developerName}%`],
  )

  const stats = rows[0] || {
    listings: 0,
    active: 0,
    completed: 0,
    avg_yield: 0,
    avg_score: 0,
    golden_visa_count: 0,
    min_price: 0,
    max_price: 0,
    on_time_rate: null,
    first_project_date: null,
  }

  const areaRows = await query<{ area: string; count: number }>(
    `SELECT area, COUNT(*)::int AS count
     FROM gc_projects
     WHERE developer_name ILIKE $1 AND area IS NOT NULL
     GROUP BY area
     ORDER BY count DESC
     LIMIT 5`,
    [`%${developerName}%`],
  )

  const flagshipRows = await query<{ id: string; slug: string; name: string; market_score: number | null }>(
    `SELECT id, slug, name, market_score
     FROM gc_projects
     WHERE developer_name ILIKE $1
     ORDER BY market_score DESC NULLS LAST
     LIMIT 3`,
    [`%${developerName}%`],
  )

  const firstProjectYear = stats.first_project_date
    ? new Date(stats.first_project_date).getFullYear()
    : null

  return {
    listings: stats.listings,
    active: stats.active,
    completed: stats.completed,
    avgYield: stats.avg_yield ? Number(stats.avg_yield.toFixed(2)) : 0,
    avgScore: stats.avg_score ? Number(stats.avg_score.toFixed(1)) : 0,
    goldenVisaCount: stats.golden_visa_count,
    minPrice: stats.min_price ? Number(stats.min_price) : 0,
    maxPrice: stats.max_price ? Number(stats.max_price) : 0,
    onTimeDeliveryRate: stats.on_time_rate ? Number(stats.on_time_rate.toFixed(1)) : null,
    firstProjectYear,
    topAreas: areaRows.map((row) => ({ area: row.area, count: row.count })),
    flagshipProjects: flagshipRows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      marketScore: row.market_score,
    })),
  }
}

export interface LeadRecord {
  id: string
  name: string
  phone: string
  email?: string | null
  source?: string | null
  project_slug?: string | null
  assigned_broker_id?: string | null
  created_at: string
}

export interface BlogPostSummary {
  id: string
  slug: string
  title: string
  excerpt: string | null
  hero_image: string | null
  category: string | null
  author: string | null
  published_at: string | null
  read_time: number | null
  featured: boolean | null
}

export interface BlogPost extends BlogPostSummary {
  body: string | null
  tags: unknown
  payload: unknown
}

export async function getBlogPosts(limit = 12, offset = 0) {
  const rows = await query<BlogPostSummary>(
    `SELECT id, slug, title, excerpt, hero_image, category, author, published_at, read_time, featured
     FROM gc_blog_posts
     ORDER BY featured DESC NULLS LAST, published_at DESC NULLS LAST, created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  )
  return rows
}

export async function getFeaturedBlogPosts(limit = 6) {
  const rows = await query<BlogPostSummary>(
    `SELECT id, slug, title, excerpt, hero_image, category, author, published_at, read_time, featured
     FROM gc_blog_posts
     WHERE featured = true
     ORDER BY published_at DESC NULLS LAST, created_at DESC
     LIMIT $1`,
    [limit],
  )
  return rows
}

const HOMEPAGE_BLOG_KEYWORDS = [
  "%market%",
  "%investment%",
  "%investor%",
  "%roi%",
  "%yield%",
  "%rental%",
  "%dubai%",
  "%property%",
  "%real estate%",
  "%off-plan%",
  "%golden visa%",
  "%trend%",
  "%analysis%",
  "%guide%",
  "%finance%",
  "%regulation%",
]

const HOMEPAGE_BLOG_EXCLUDES = [
  "%thanksgiving%",
  "%christmas%",
  "%holiday%",
  "%eid%",
  "%ramadan%",
  "%new year%",
  "%valentine%",
  "%national day%",
]

export async function getHomepageBlogPosts(limit = 6) {
  const primaryRows = await query<BlogPostSummary>(
    `SELECT id, slug, title, excerpt, hero_image, category, author, published_at, read_time, featured
     FROM gc_blog_posts
     WHERE hero_image IS NOT NULL
       AND hero_image <> ''
       AND (
         title ILIKE ANY($1::text[])
         OR excerpt ILIKE ANY($1::text[])
         OR category ILIKE ANY($1::text[])
       )
       AND NOT (
         title ILIKE ANY($2::text[])
         OR excerpt ILIKE ANY($2::text[])
       )
     ORDER BY featured DESC NULLS LAST, published_at DESC NULLS LAST, created_at DESC
     LIMIT $3`,
    [HOMEPAGE_BLOG_KEYWORDS, HOMEPAGE_BLOG_EXCLUDES, limit],
  )

  if (primaryRows.length >= limit) return primaryRows

  const excludeIds = primaryRows.map((row) => row.id)
  const remaining = limit - primaryRows.length
  const fallbackRows = await query<BlogPostSummary>(
    `SELECT id, slug, title, excerpt, hero_image, category, author, published_at, read_time, featured
     FROM gc_blog_posts
     WHERE hero_image IS NOT NULL
       AND hero_image <> ''
       AND NOT (
         title ILIKE ANY($1::text[])
         OR excerpt ILIKE ANY($1::text[])
       )
       AND id <> ALL($2::text[])
     ORDER BY published_at DESC NULLS LAST, created_at DESC
     LIMIT $3`,
    [HOMEPAGE_BLOG_EXCLUDES, excludeIds, remaining],
  )

  return [...primaryRows, ...fallbackRows]
}

export async function getBlogPostBySlug(slug: string) {
  const rows = await query<BlogPost>(
    `SELECT id, slug, title, excerpt, body, hero_image, category, author, published_at, read_time, tags, payload
     FROM gc_blog_posts
     WHERE slug = $1
     LIMIT 1`,
    [slug],
  )
  return rows[0] || null
}

export async function getLeads(role: "admin" | "broker", brokerId?: string) {
  if (role === "broker" && brokerId) {
    return query<LeadRecord>(
      `SELECT id, name, phone, email, source, project_slug, assigned_broker_id, created_at
       FROM gc_leads
       WHERE assigned_broker_id = $1
       ORDER BY created_at DESC`,
      [brokerId],
    )
  }

  return query<LeadRecord>(
    `SELECT id, name, phone, email, source, project_slug, assigned_broker_id, created_at
     FROM gc_leads
     ORDER BY created_at DESC`,
  )
}

export function toUSD(aed: number) {
  return Math.round(aed * USD_RATE)
}
