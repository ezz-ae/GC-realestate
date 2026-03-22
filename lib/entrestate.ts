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
const DEFAULT_COORDINATES = { lat: 25.2048, lng: 55.2708 }
const DEFAULT_LOCATION: Project["location"] = {
  area: "Dubai",
  district: "Dubai",
  city: "Dubai",
  coordinates: DEFAULT_COORDINATES,
  freehold: true,
  nearbyLandmarks: [],
}

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
  const locationSource = project.location ?? DEFAULT_LOCATION
  const safeCoordinates = locationSource.coordinates ?? DEFAULT_COORDINATES
  const safeLocation = {
    ...DEFAULT_LOCATION,
    ...locationSource,
    coordinates: safeCoordinates,
    nearbyLandmarks: locationSource.nearbyLandmarks ?? [],
  }
  const investmentHighlights = project.investmentHighlights ?? {
    expectedROI: 0,
    rentalYield: 0,
    goldenVisaEligible: false,
    paymentPlanAvailable: false,
  }
  const defaultTimeline = {
    expectedCompletion: "",
    handoverDate: "",
    progressPercentage: 0,
    launchDate: "",
    constructionStart: "",
  }
  const timeline = { ...defaultTimeline, ...(project.timeline || {}) }

  return {
    id: project.id,
    title: `${project.name} ${primaryUnit?.type || "Residence"}`,
    slug: project.slug,
    type: "off-plan",
    category: "apartment",
    price,
    currency: "AED",
    location: {
      area: safeLocation.area,
      district: safeLocation.district,
      city: safeLocation.city,
      coordinates: safeLocation.coordinates,
      freehold: safeLocation.freehold,
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
      roi: investmentHighlights.expectedROI,
      rentalYield: investmentHighlights.rentalYield,
      appreciationRate: investmentHighlights.rentalYield,
      goldenVisaEligible: investmentHighlights.goldenVisaEligible,
    },
    paymentPlan: project.paymentPlan,
    completionDate: timeline.expectedCompletion,
    handoverDate: timeline.handoverDate,
    status: "available",
    featured: project.featured,
    seoTitle: project.seoTitle,
    seoDescription: project.seoDescription,
    seoKeywords: project.seoKeywords,
    nearbyLandmarks: safeLocation.nearbyLandmarks.map((landmark) => ({
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
    description: payload.description || `${payload.name || row.name} is a leading UAE developer.`,
    trackRecord: payload.trackRecord || "Strong delivery track record in Dubai.",
    awards: payload.awards || [],
    website: payload.website || undefined,
    foundedYear: payload.foundedYear ? Number(payload.foundedYear) : undefined,
    headquarters: payload.headquarters || undefined,
    activeProjects: payload.activeProjects ? Number(payload.activeProjects) : undefined,
    completedProjects: payload.completedProjects || Number(row.payload.completedProjects) || 0,
    projectCount: payload.projectCount ? Number(payload.projectCount) : undefined,
    stars: Number(payload.stars || row.avg_score || 0),
    honestyScore: Number(payload.honestyIndex || row.honesty_index || 0),
  }
}

export async function getProjectsForGrid(limit = 50) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload
     FROM gc_projects
     WHERE status = 'selling'
     ORDER BY featured DESC NULLS LAST, market_score DESC NULLS LAST
     LIMIT $1`,
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
       AND featured = true
       AND COALESCE(hero_image, payload->>'heroImage', '') <> ''
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
    `SELECT slug, name, area_type, avg_score, median_price_aed, project_count, avg_yield, image, hero_video, payload 
     FROM gc_area_profiles 
     WHERE (payload->>'projectCount')::int > 0 OR project_count > 0
     ORDER BY (payload->>'projectCount')::int DESC NULLS LAST, avg_yield DESC`,
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
    `SELECT id, slug, name, tier, avg_score, honesty_index, risk_discount, logo, banner_image, payload 
     FROM gc_developer_profiles 
     WHERE (payload->>'projectCount')::int > 0 OR (payload->>'activeProjects')::int > 0
     ORDER BY (payload->>'projectCount')::int DESC NULLS LAST, avg_score DESC`,
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

export interface DashboardKpis {
  todaysLeads: number
  assignedThisWeek: number
  activeInquiries: number
  scheduledViewings: number
  pipelineValue: number
  unassignedLeads: number
}

export interface HotLead extends LeadRecord {
  score: number
}

export interface ProjectPerformance {
  id: string
  slug: string
  name: string
  area: string | null
  marketScore: number | null
  expectedRoi: number | null
  rentalYield: number | null
}

export interface DashboardOverviewData {
  kpis: DashboardKpis
  hotLeads: HotLead[]
  topProjects: ProjectPerformance[]
  recentLeads: LeadRecord[]
}

export interface LeadSourceSummary {
  source: string
  count: number
}

export interface AreaPerformanceSummary {
  area: string
  count: number
}

export interface BrokerPerformanceSummary {
  brokerId: string
  count: number
}

export interface AnalyticsOverview {
  leadSources: LeadSourceSummary[]
  areaPerformance: AreaPerformanceSummary[]
  brokerPerformance: BrokerPerformanceSummary[]
  topProjects: ProjectPerformance[]
  pipelineValue: number
}

export interface DashboardProjectRow {
  id: string
  slug: string
  name: string
  area: string | null
  status: string | null
  developerName: string | null
  priceFrom: number | null
  priceTo: number | null
  marketScore: number | null
  expectedRoi: number | null
  rentalYield: number | null
  unitsAvailable: number
}

export interface DashboardProjectFilters {
  page?: number
  pageSize?: number
  search?: string
  area?: string
  developer?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  minRoi?: number
  sort?: "market" | "price-low" | "price-high" | "roi"
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

const buildLeadFilter = (alias: string, role: "admin" | "broker", brokerId?: string) => {
  if (role === "broker" && brokerId) {
    return { clause: `${alias}.assigned_broker_id = $1`, params: [brokerId] }
  }
  return { clause: "TRUE", params: [] as Array<string | number> }
}

export async function getRecentLeads(limit = 5, role: "admin" | "broker" = "admin", brokerId?: string) {
  const filter = buildLeadFilter("l", role, brokerId)
  const params = [...filter.params, limit]
  return query<LeadRecord>(
    `SELECT l.id, l.name, l.phone, l.email, l.source, l.project_slug, l.assigned_broker_id, l.created_at
     FROM gc_leads l
     WHERE ${filter.clause}
     ORDER BY l.created_at DESC
     LIMIT $${params.length}`,
    params,
  )
}

export async function getDashboardOverviewData(
  role: "admin" | "broker" = "admin",
  brokerId?: string,
): Promise<DashboardOverviewData> {
  const filter = buildLeadFilter("l", role, brokerId)
  const params = filter.params

  const [todays] = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count
     FROM gc_leads l
     WHERE ${filter.clause}
       AND l.created_at >= CURRENT_DATE`,
    params,
  )

  const [assignedThisWeek] = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count
     FROM gc_leads l
     WHERE ${filter.clause}
       AND l.assigned_broker_id IS NOT NULL
       AND l.created_at >= date_trunc('week', now())`,
    params,
  )

  const [activeInquiries] = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count
     FROM gc_leads l
     WHERE ${filter.clause}
       AND l.created_at >= now() - interval '30 days'`,
    params,
  )

  const [scheduledViewings] = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count
     FROM gc_leads l
     WHERE ${filter.clause}
       AND l.source ILIKE ANY(ARRAY['%view%', '%tour%', '%meeting%', '%showing%'])`,
    params,
  )

  const [pipeline] = await query<{ total: number }>(
    `SELECT COALESCE(SUM(p.price_from_aed), 0)::bigint AS total
     FROM gc_leads l
     JOIN gc_projects p ON p.slug = l.project_slug
     WHERE ${filter.clause}
       AND l.created_at >= now() - interval '30 days'`,
    params,
  )

  const [unassigned] = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count
     FROM gc_leads l
     WHERE ${filter.clause}
       AND l.assigned_broker_id IS NULL`,
    params,
  )

  const recentLeads = await getRecentLeads(6, role, brokerId)

  const hotLeadRows = await query<LeadRecord>(
    `SELECT l.id, l.name, l.phone, l.email, l.source, l.project_slug, l.assigned_broker_id, l.created_at
     FROM gc_leads l
     WHERE ${filter.clause}
     ORDER BY l.created_at DESC
     LIMIT 40`,
    params,
  )

  const hotLeads = hotLeadRows
    .map((lead) => {
      let score = 0
      if (lead.email) score += 2
      if (lead.phone) score += 2
      if (lead.project_slug) score += 3
      if (lead.source) score += 1
      if (lead.assigned_broker_id) score += 2
      const createdAt = new Date(lead.created_at)
      if (Date.now() - createdAt.getTime() < 7 * 24 * 60 * 60 * 1000) score += 2
      return { ...lead, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const projectRows = await query<{
    id: string
    slug: string
    name: string
    area: string | null
    market_score: number | null
    rental_yield: number | null
    payload: Project
  }>(
    `SELECT id, slug, name, area, market_score, rental_yield, payload
     FROM gc_projects
     ORDER BY market_score DESC NULLS LAST
     LIMIT 5`,
  )

  const topProjects = projectRows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    area: row.area,
    marketScore: row.market_score,
    expectedRoi: row.payload?.investmentHighlights?.expectedROI ?? null,
    rentalYield: row.rental_yield ?? row.payload?.investmentHighlights?.rentalYield ?? null,
  }))

  return {
    kpis: {
      todaysLeads: todays?.count || 0,
      assignedThisWeek: assignedThisWeek?.count || 0,
      activeInquiries: activeInquiries?.count || 0,
      scheduledViewings: scheduledViewings?.count || 0,
      pipelineValue: pipeline?.total || 0,
      unassignedLeads: unassigned?.count || 0,
    },
    hotLeads,
    topProjects,
    recentLeads,
  }
}

export async function getDashboardAnalyticsData(
  role: "admin" | "broker" = "admin",
  brokerId?: string,
): Promise<AnalyticsOverview> {
  const filter = buildLeadFilter("l", role, brokerId)
  const params = filter.params

  const leadSources = await query<LeadSourceSummary>(
    `SELECT COALESCE(l.source, 'Unknown') AS source, COUNT(*)::int AS count
     FROM gc_leads l
     WHERE ${filter.clause}
     GROUP BY l.source
     ORDER BY count DESC`,
    params,
  )

  const areaPerformance = await query<AreaPerformanceSummary>(
    `SELECT COALESCE(p.area, 'Unknown') AS area, COUNT(*)::int AS count
     FROM gc_leads l
     JOIN gc_projects p ON p.slug = l.project_slug
     WHERE ${filter.clause}
     GROUP BY p.area
     ORDER BY count DESC
     LIMIT 6`,
    params,
  )

  const brokerPerformance = await query<BrokerPerformanceSummary>(
    `SELECT COALESCE(l.assigned_broker_id, 'Unassigned') AS "brokerId", COUNT(*)::int AS count
     FROM gc_leads l
     WHERE ${filter.clause}
     GROUP BY l.assigned_broker_id
     ORDER BY count DESC`,
    params,
  )

  const projectRows = await query<{
    id: string
    slug: string
    name: string
    area: string | null
    market_score: number | null
    rental_yield: number | null
    payload: Project
  }>(
    `SELECT id, slug, name, area, market_score, rental_yield, payload
     FROM gc_projects
     ORDER BY market_score DESC NULLS LAST
     LIMIT 6`,
  )

  const topProjects = projectRows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    area: row.area,
    marketScore: row.market_score,
    expectedRoi: row.payload?.investmentHighlights?.expectedROI ?? null,
    rentalYield: row.rental_yield ?? row.payload?.investmentHighlights?.rentalYield ?? null,
  }))

  const [pipeline] = await query<{ total: number }>(
    `SELECT COALESCE(SUM(p.price_from_aed), 0)::bigint AS total
     FROM gc_leads l
     JOIN gc_projects p ON p.slug = l.project_slug
     WHERE ${filter.clause}
       AND l.created_at >= now() - interval '30 days'`,
    params,
  )

  return {
    leadSources,
    areaPerformance,
    brokerPerformance,
    topProjects,
    pipelineValue: pipeline?.total || 0,
  }
}

const buildProjectFilters = (filters: DashboardProjectFilters, values: Array<string | number>) => {
  const where: string[] = []

  if (filters.search) {
    values.push(`%${filters.search}%`)
    where.push(`(name ILIKE $${values.length} OR slug ILIKE $${values.length})`)
  }

  if (filters.area) {
    values.push(`%${filters.area}%`)
    where.push(`area ILIKE $${values.length}`)
  }

  if (filters.developer) {
    values.push(`%${filters.developer}%`)
    where.push(`developer_name ILIKE $${values.length}`)
  }

  if (filters.status) {
    values.push(filters.status)
    where.push(`status = $${values.length}`)
  }

  if (typeof filters.minPrice === "number") {
    values.push(filters.minPrice)
    where.push(`price_from_aed >= $${values.length}`)
  }

  if (typeof filters.maxPrice === "number") {
    values.push(filters.maxPrice)
    where.push(`price_from_aed <= $${values.length}`)
  }

  if (typeof filters.minRoi === "number") {
    values.push(filters.minRoi)
    where.push(`COALESCE((payload->'investmentHighlights'->>'expectedROI')::numeric, 0) >= $${values.length}`)
  }

  return where
}

export async function getDashboardProjects(filters: DashboardProjectFilters) {
  const pageSize = Math.max(1, filters.pageSize || 20)
  const page = Math.max(1, filters.page || 1)
  const offset = (page - 1) * pageSize
  const values: Array<string | number> = []
  const where = buildProjectFilters(filters, values)
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : ""

  let orderBy = "market_score DESC NULLS LAST"
  switch (filters.sort) {
    case "price-low":
      orderBy = "price_from_aed ASC NULLS LAST"
      break
    case "price-high":
      orderBy = "price_from_aed DESC NULLS LAST"
      break
    case "roi":
      orderBy = "COALESCE((payload->'investmentHighlights'->>'expectedROI')::numeric, rental_yield) DESC NULLS LAST"
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
  const rows = await query<{
    id: string
    slug: string
    name: string
    area: string | null
    status: string | null
    developer_name: string | null
    price_from_aed: number | null
    price_to_aed: number | null
    market_score: number | null
    rental_yield: number | null
    payload: Project
  }>(
    `SELECT id, slug, name, area, status, developer_name, price_from_aed, price_to_aed, market_score, rental_yield, payload
     FROM gc_projects ${whereClause}
     ORDER BY ${orderBy}
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values,
  )

  const projects = rows.map((row) => {
    const units = Array.isArray(row.payload?.units) ? row.payload.units : []
    const unitsAvailable = units.reduce((sum, unit) => sum + (Number.isFinite(unit.available) ? unit.available : 0), 0)
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      area: row.area,
      status: row.status,
      developerName: row.developer_name,
      priceFrom: row.price_from_aed ?? null,
      priceTo: row.price_to_aed ?? null,
      marketScore: row.market_score ?? null,
      expectedRoi: row.payload?.investmentHighlights?.expectedROI ?? null,
      rentalYield: row.rental_yield ?? row.payload?.investmentHighlights?.rentalYield ?? null,
      unitsAvailable,
    }
  })

  return { total, projects }
}

export async function getDashboardProjectFilters() {
  const areas = await query<{ area: string | null }>(
    `SELECT DISTINCT area FROM gc_projects WHERE area IS NOT NULL ORDER BY area ASC LIMIT 30`,
  )
  const developers = await query<{ developer_name: string | null }>(
    `SELECT DISTINCT developer_name FROM gc_projects WHERE developer_name IS NOT NULL ORDER BY developer_name ASC LIMIT 30`,
  )
  return {
    areas: areas.map((row) => row.area).filter(Boolean) as string[],
    developers: developers.map((row) => row.developer_name).filter(Boolean) as string[],
  }
}

export interface UserProfileRecord {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

export async function ensureUsersTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS gc_users (
      id text PRIMARY KEY,
      name text,
      email text UNIQUE,
      role text,
      created_at timestamptz DEFAULT now()
    )
  `)
}

export async function getUserProfileByEmail(email: string) {
  await ensureUsersTable()
  const rows = await query<UserProfileRecord>(
    `SELECT id, name, email, role, created_at
     FROM gc_users
     WHERE email = $1
     LIMIT 1`,
    [email],
  )
  return rows[0] || null
}

export async function upsertUserProfile(profile: {
  id: string
  name: string
  email: string
  role: string
}) {
  await ensureUsersTable()
  const rows = await query<UserProfileRecord>(
    `INSERT INTO gc_users (id, name, email, role)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email)
     DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role
     RETURNING id, name, email, role, created_at`,
    [profile.id, profile.name, profile.email, profile.role],
  )
  return rows[0]
}
