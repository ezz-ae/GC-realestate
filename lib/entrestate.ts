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

const normalizeSlug = (value?: string) => {
  if (!value) return ""
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const parseBedrooms = (unitType?: string) => {
  if (!unitType) return 1
  const normalized = unitType.toLowerCase()
  if (normalized.includes("studio")) return 0
  const match = normalized.match(/(\\d+)/)
  return match ? Number(match[1]) : 1
}

const SORT_SCORE_ORDER =
  "COALESCE(market_score, NULLIF(payload->>'sortScore', '')::numeric) DESC NULLS LAST"

export const projectToProperty = (project: Project): Property => {
  const primaryUnit = project.units?.[0]
  const safeLocation = project.location || ({} as Project["location"])
  const safeDeveloper = project.developer || ({} as Project["developer"])
  const safeInvestment = project.investmentHighlights || ({} as Project["investmentHighlights"])
  const safeTimeline = project.timeline || ({} as Project["timeline"])
  const area = safeLocation.area || "Dubai"
  const district = safeLocation.district || "Dubai"
  const city = safeLocation.city || "Dubai"
  const coordinates = safeLocation.coordinates || { lat: 0, lng: 0 }
  const freehold = typeof safeLocation.freehold === "boolean" ? safeLocation.freehold : true
  const developerId = safeDeveloper.id || project.id || "developer"
  const developerName = safeDeveloper.name || "Gold Century"
  const developerSlug = safeDeveloper.slug || normalizeSlug(developerName) || "gold-century"
  const developerLogo = safeDeveloper.pfLogo || safeDeveloper.logo || "/logo.png"
  const bedrooms =
    typeof primaryUnit?.bedrooms === "number"
      ? primaryUnit.bedrooms
      : parseBedrooms(primaryUnit?.type)
  const unitBaths =
    typeof primaryUnit?.baths === "number"
      ? primaryUnit.baths
      : typeof primaryUnit?.bathrooms === "number"
        ? primaryUnit.bathrooms
        : undefined
  const bathrooms = typeof unitBaths === "number" ? unitBaths : Math.max(1, bedrooms)
  const sizeSqft = primaryUnit?.sizeFrom ?? 900
  const sizeSqm = Math.round(sizeSqft * 0.0929)
  const price = primaryUnit?.priceFrom ?? 1500000
  const heroImage = project.mediaSource?.heroImage || project.heroImage
  const gallery =
    Array.isArray(project.mediaSource?.gallery) && project.mediaSource?.gallery?.length
      ? project.mediaSource?.gallery
      : project.gallery

  return {
    id: project.id || project.slug || normalizeSlug(project.name) || "property",
    title: `${project.name || "Property"} ${primaryUnit?.type || "Residence"}`,
    slug: project.slug || normalizeSlug(project.name) || "property",
    type: "off-plan",
    category: "apartment",
    price,
    currency: "AED",
    location: {
      area,
      district,
      city,
      coordinates,
      freehold,
    },
    specifications: {
      bedrooms,
      bathrooms,
      sizeSqft,
      sizeSqm,
      parkingSpaces: bedrooms > 2 ? 2 : 1,
      furnished: false,
      view: project.tagline || "City view",
    },
    images: gallery?.length ? gallery : heroImage ? [heroImage] : [],
    video: project.heroVideo,
    virtualTour: project.virtualTour,
    description: project.description || `${project.name || "Property"} in ${area}, Dubai.`,
    highlights: project.highlights || [],
    amenities: project.amenities || [],
    developer: {
      ...safeDeveloper,
      id: safeDeveloper.id || developerId,
      name: safeDeveloper.name || developerName,
      slug: safeDeveloper.slug || developerSlug,
      logo: developerLogo,
    },
    project: {
      id: project.id || project.slug || normalizeSlug(project.name) || "property",
      name: project.name || "Property",
      slug: project.slug || normalizeSlug(project.name) || "property",
    },
    investmentMetrics: {
      roi: safeInvestment.expectedROI ?? 0,
      rentalYield: safeInvestment.rentalYield ?? 0,
      appreciationRate: safeInvestment.rentalYield ?? 0,
      goldenVisaEligible: safeInvestment.goldenVisaEligible ?? false,
    },
    paymentPlan: project.paymentPlan,
    completionDate: safeTimeline.expectedCompletion,
    handoverDate: safeTimeline.handoverDate,
    status: "available",
    featured: project.featured,
    seoTitle: project.seoTitle || project.name || "Property",
    seoDescription: project.seoDescription || project.description || `${project.name || "Property"} in Dubai.`,
    seoKeywords: project.seoKeywords || [],
    nearbyLandmarks: safeLocation.nearbyLandmarks?.map((landmark) => ({
      name: landmark.name,
      distance: landmark.distance,
    })),
    createdAt: project.createdAt || new Date().toISOString(),
    updatedAt: project.updatedAt || new Date().toISOString(),
  }
}

const normalizeProjectPayload = (row: ProjectRow) => {
  const payload = row.payload || ({} as Project)
  const mediaHero = payload.mediaSource?.heroImage
  const mediaGallery =
    Array.isArray(payload.mediaSource?.gallery) && payload.mediaSource?.gallery.length
      ? payload.mediaSource.gallery
      : undefined
  return {
    ...payload,
    id: payload.id || row.id || "",
    slug: payload.slug || row.slug || "",
    heroImage: payload.heroImage || mediaHero || "",
    gallery: mediaGallery || payload.gallery,
  }
}

const mapAreaRow = (row: AreaRow): AreaProfile => {
  const payload = row.payload || {}
  const rawSlug = payload.slug || row.slug || payload.name || row.name || ""
  const slug = normalizeSlug(rawSlug)
  const areaType = payload.areaType || row.area_type || "urban"
  const lifestyleTags = [titleCase(areaType)]

  return {
    id: slug || payload.slug || row.slug,
    name: payload.name || row.name,
    slug: slug || payload.slug || row.slug,
    image: row.image || payload.image || "/logo.png",
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
  const rawDeveloperSlug = payload.slug || row.slug || payload.name || row.name || ""
  const normalizedDeveloperSlug = normalizeSlug(rawDeveloperSlug)
  const finalSlug = normalizedDeveloperSlug || (payload.slug || row.slug || rawDeveloperSlug)
  return {
    id: payload.id || row.id,
    name: payload.name || row.name,
    slug: finalSlug,
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
    `SELECT id, slug, payload
     FROM gc_projects
     WHERE status = 'selling'
     ORDER BY ${SORT_SCORE_ORDER}
     LIMIT $1`,
    [limit],
  )
  return rows.map((row) => normalizeProjectPayload(row))
}

export async function getAdjacentProjectSlugs(slug: string) {
  const rows = await query<{ prev_slug: string | null; next_slug: string | null }>(
    `
      WITH ordered AS (
        SELECT slug,
               payload->>'slug' AS payload_slug,
               lag(slug) OVER (ORDER BY ${SORT_SCORE_ORDER}) AS prev_slug,
               lead(slug) OVER (ORDER BY ${SORT_SCORE_ORDER}) AS next_slug,
               row_number() OVER (ORDER BY ${SORT_SCORE_ORDER}) AS idx
        FROM gc_projects
        WHERE status = 'selling'
      )
      SELECT prev_slug, next_slug
      FROM ordered
      WHERE slug = $1 OR payload_slug = $1
      LIMIT 1
    `,
    [slug],
  )
  return rows[0] || { prev_slug: null, next_slug: null }
}

export async function getProjectBySlug(slug: string) {
  const cleanSlug = slug.trim().toLowerCase()
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload
     FROM gc_projects
     WHERE lower(slug) = $1
        OR lower(payload->>'slug') = $1
        OR lower(payload->>'slugified') = $1
        OR lower(payload->>'pfSlug') = $1
     LIMIT 1`,
    [cleanSlug],
  )
  return rows[0] ? normalizeProjectPayload(rows[0]) : null
}

export async function getProperties(limit = 12) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload
     FROM gc_projects
     WHERE status = 'selling'
     ORDER BY ${SORT_SCORE_ORDER}
     LIMIT $1`,
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
     ORDER BY ${SORT_SCORE_ORDER}
     LIMIT $1`,
    [limit],
  )

  return rows.map((row) => projectToProperty(normalizeProjectPayload(row)))
}

export interface PropertyListingFilters {
  page?: number
  pageSize?: number
  sort?: "score" | "newest" | "price-low" | "price-high" | "roi" | "yield"
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
        return `(unit->>'bedrooms')::int = 0`
      }
      if (bed === "5+") {
        return `(unit->>'bedrooms')::int >= 5`
      }
      const bedNumber = Number(bed)
      if (Number.isFinite(bedNumber)) {
        values.push(bedNumber)
        return `(unit->>'bedrooms')::int = $${values.length}`
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
  const hasActiveFilters =
    Boolean(filters.areas?.length) ||
    Boolean(filters.developer) ||
    Boolean(filters.bedrooms?.length) ||
    Boolean(filters.propertyType) ||
    filters.minPrice != null ||
    filters.maxPrice != null ||
    filters.freeholdOnly ||
    filters.goldenVisa

  const usesFeaturedFirstPage =
    page === 1 && !hasActiveFilters && (!filters.sort || filters.sort === "score")

  if (usesFeaturedFirstPage) {
    const rows = await query<ProjectRow>(
      `SELECT id, slug, payload
       FROM gc_projects
       WHERE featured = true
       ORDER BY ${SORT_SCORE_ORDER}
       LIMIT $1`,
      [pageSize],
    )
    const countRows = await query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM gc_projects WHERE featured = true`,
    )
    const total = countRows[0]?.total ?? rows.length
    return {
      total,
      properties: rows.map((row) => projectToProperty(normalizeProjectPayload(row))),
    }
  }

  const values: Array<string | number | boolean> = []
  const where = buildPropertyListingWhere(filters, values)
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : ""

  let orderBy = SORT_SCORE_ORDER
  switch (filters.sort) {
    case "score":
      orderBy = SORT_SCORE_ORDER
      break
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
    `SELECT id, slug, payload
     FROM gc_projects
     WHERE area ILIKE $1
     ORDER BY ${SORT_SCORE_ORDER}
     LIMIT $2`,
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
  const cleanSlug = normalizeSlug(slug)
  if (!cleanSlug) return null
  const rows = await query<AreaRow>(
    `SELECT slug, name, area_type, avg_score, median_price_aed, project_count, avg_yield, image, hero_video, payload
     FROM gc_area_profiles
     WHERE lower(slug) = $1
        OR lower(payload->>'slug') = $1
        OR lower(REGEXP_REPLACE(payload->>'slug', '[^a-z0-9]+', '-', 'g')) = $1
        OR lower(REGEXP_REPLACE(payload->>'name', '[^a-z0-9]+', '-', 'g')) = $1
        OR lower(REGEXP_REPLACE(name, '[^a-z0-9]+', '-', 'g')) = $1
     LIMIT 1`,
    [cleanSlug],
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
  const cleanSlug = normalizeSlug(slug)
  if (!cleanSlug) return null
  const rows = await query<DeveloperRow>(
    `SELECT id, slug, name, tier, avg_score, honesty_index, risk_discount, logo, banner_image, payload
     FROM gc_developer_profiles
     WHERE lower(slug) = $1
        OR lower(payload->>'slug') = $1
        OR lower(REGEXP_REPLACE(payload->>'slug', '[^a-z0-9]+', '-', 'g')) = $1
        OR lower(REGEXP_REPLACE(payload->>'name', '[^a-z0-9]+', '-', 'g')) = $1
        OR lower(REGEXP_REPLACE(name, '[^a-z0-9]+', '-', 'g')) = $1
     LIMIT 1`,
    [cleanSlug],
  )
  return rows[0] ? mapDeveloperRow(rows[0]) : null
}

export async function searchProjects(queryText: string, limit = 5) {
  const q = `%${queryText}%`
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload
     FROM gc_projects
     WHERE name ILIKE $1 OR area ILIKE $1 OR developer_name ILIKE $1 OR slug ILIKE $1 OR payload->>'slug' ILIKE $1
     ORDER BY ${SORT_SCORE_ORDER}
     LIMIT $2`,
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
    `SELECT id, slug, payload
     FROM gc_projects
     WHERE golden_visa_eligible = true
     ORDER BY ${SORT_SCORE_ORDER}
     LIMIT $1`,
    [limit],
  )
  return rows.map((row) => normalizeProjectPayload(row))
}

export async function getProjectsByArea(area: string, limit = 5) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload
     FROM gc_projects
     WHERE area ILIKE $1
     ORDER BY ${SORT_SCORE_ORDER}
     LIMIT $2`,
    [`%${area}%`, limit],
  )
  return rows.map((row) => normalizeProjectPayload(row))
}

export async function getProjectsByDeveloper(developerName: string, limit = 6) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload
     FROM gc_projects
     WHERE developer_name ILIKE $1
     ORDER BY ${SORT_SCORE_ORDER}
     LIMIT $2`,
    [`%${developerName}%`, limit],
  )
  return rows.map((row) => normalizeProjectPayload(row))
}

export async function getPropertiesByDeveloper(developerName: string, limit = 6) {
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload
     FROM gc_projects
     WHERE developer_name ILIKE $1
     ORDER BY ${SORT_SCORE_ORDER}
     LIMIT $2`,
    [`%${developerName}%`, limit],
  )
  return rows.map((row) => projectToProperty(normalizeProjectPayload(row)))
}

export async function getProjectsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return []
  const rows = await query<ProjectRow>(
    `SELECT id, slug, payload FROM gc_projects WHERE slug = ANY($1::text[]) OR payload->>'slug' = ANY($1::text[])`,
    [slugs],
  )
  return rows.map((row) => normalizeProjectPayload(row))
}

export async function getLlmContextByArea(area: string, limit = 8) {
  const rows = await query<{ llm_context: string }>(
    `SELECT llm_context
     FROM gc_projects
     WHERE area ILIKE $1
     ORDER BY ${SORT_SCORE_ORDER}
     LIMIT $2`,
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
      MIN(COALESCE(handover_date, created_at::timestamptz)) AS first_project_date,
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
  status?: string | null
  priority?: string | null
  last_contact_at?: string | null
  country?: string | null
  budget_aed?: number | null
  interest?: string | null
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
         title ILIKE ANY($1)
         OR excerpt ILIKE ANY($1)
         OR category ILIKE ANY($1)
       )
       AND NOT (
         title ILIKE ANY($2)
         OR excerpt ILIKE ANY($2)
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
         title ILIKE ANY($1)
         OR excerpt ILIKE ANY($1)
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

export async function ensureLeadsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS gc_leads (
      id text PRIMARY KEY,
      name text,
      phone text,
      email text,
      source text,
      project_slug text,
      assigned_broker_id text,
      created_at timestamptz DEFAULT now()
    )
  `)
  await query(`
    ALTER TABLE gc_leads
      ADD COLUMN IF NOT EXISTS status text,
      ADD COLUMN IF NOT EXISTS priority text,
      ADD COLUMN IF NOT EXISTS last_contact_at timestamptz,
      ADD COLUMN IF NOT EXISTS country text,
      ADD COLUMN IF NOT EXISTS budget_aed numeric,
      ADD COLUMN IF NOT EXISTS interest text
  `)
}

export interface LeadActivityRecord {
  id: string
  lead_id: string
  activity_type: string
  description: string | null
  created_by: string | null
  created_at: string
}

export async function ensureLeadActivityTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS gc_lead_activity (
      id text PRIMARY KEY,
      lead_id text REFERENCES gc_leads(id) ON DELETE CASCADE,
      activity_type text,
      description text,
      created_by text,
      created_at timestamptz DEFAULT now()
    )
  `)
}

const scoreLead = (lead: LeadRecord) => {
  let score = 0
  if (lead.email) score += 2
  if (lead.phone) score += 2
  if (lead.project_slug) score += 3
  if (lead.source) score += 1
  if (lead.assigned_broker_id) score += 2
  if (lead.budget_aed && lead.budget_aed > 2000000) score += 2
  const createdAt = new Date(lead.created_at)
  if (Date.now() - createdAt.getTime() < 7 * 24 * 60 * 60 * 1000) score += 2
  return score
}

const priorityFromScore = (score: number) => {
  if (score >= 8) return "hot"
  if (score >= 5) return "warm"
  return "cold"
}

const applyLeadDefaults = (lead: LeadRecord): LeadRecord => {
  const status = lead.status || (lead.assigned_broker_id ? "contacted" : "new")
  const score = scoreLead({ ...lead, status })
  return {
    ...lead,
    status,
    priority: lead.priority || priorityFromScore(score),
  }
}

export async function getLeadById(id: string) {
  await ensureLeadsTable()
  const rows = await query<LeadRecord>(
    `SELECT id, name, phone, email, source, project_slug, assigned_broker_id, status, priority,
            last_contact_at, country, budget_aed, interest, created_at
     FROM gc_leads
     WHERE id = $1
     LIMIT 1`,
    [id],
  )
  return rows[0] ? applyLeadDefaults(rows[0]) : null
}

export async function getLeadActivity(leadId: string) {
  await ensureLeadActivityTable()
  return query<LeadActivityRecord>(
    `SELECT id, lead_id, activity_type, description, created_by, created_at
     FROM gc_lead_activity
     WHERE lead_id = $1
     ORDER BY created_at DESC`,
    [leadId],
  )
}

export async function getLeads(role: "admin" | "broker", brokerId?: string) {
  await ensureLeadsTable()
  if (role === "broker" && brokerId) {
    const rows = await query<LeadRecord>(
      `SELECT id, name, phone, email, source, project_slug, assigned_broker_id, status, priority,
              last_contact_at, country, budget_aed, interest, created_at
       FROM gc_leads
       WHERE assigned_broker_id = $1
       ORDER BY created_at DESC`,
      [brokerId],
    )
    return rows.map(applyLeadDefaults)
  }

  const rows = await query<LeadRecord>(
    `SELECT id, name, phone, email, source, project_slug, assigned_broker_id, status, priority,
            last_contact_at, country, budget_aed, interest, created_at
     FROM gc_leads
     ORDER BY created_at DESC`,
  )
  return rows.map(applyLeadDefaults)
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

export type AccessRole = "admin" | "broker"

export const resolveAccessRole = (role?: string | null): AccessRole => {
  const normalized = String(role || "").toLowerCase()
  return normalized === "broker" ? "broker" : "admin"
}

export async function getRecentLeads(limit = 5, role: "admin" | "broker" = "admin", brokerId?: string) {
  await ensureLeadsTable()
  const filter = buildLeadFilter("l", role, brokerId)
  const params = [...filter.params, limit]
  const rows = await query<LeadRecord>(
    `SELECT l.id, l.name, l.phone, l.email, l.source, l.project_slug, l.assigned_broker_id, l.status, l.priority,
            l.last_contact_at, l.country, l.budget_aed, l.interest, l.created_at
     FROM gc_leads l
     WHERE ${filter.clause}
     ORDER BY l.created_at DESC
     LIMIT $${params.length}`,
    params,
  )
  return rows.map(applyLeadDefaults)
}

export async function getDashboardOverviewData(
  role: "admin" | "broker" = "admin",
  brokerId?: string,
): Promise<DashboardOverviewData> {
  await ensureLeadsTable()
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
    `SELECT l.id, l.name, l.phone, l.email, l.source, l.project_slug, l.assigned_broker_id, l.status, l.priority,
            l.last_contact_at, l.country, l.budget_aed, l.interest, l.created_at
     FROM gc_leads l
     WHERE ${filter.clause}
     ORDER BY l.created_at DESC
     LIMIT 40`,
    params,
  )

  const hotLeads = hotLeadRows
    .map((lead) => {
      const normalized = applyLeadDefaults(lead)
      const score = scoreLead(normalized)
      return { ...normalized, score }
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
  await ensureLeadsTable()
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
  phone?: string | null
  commission_rate?: number | null
  language?: string | null
  ai_tone?: string | null
  ai_verbosity?: string | null
  notifications?: Record<string, boolean> | null
  last_login_at?: string | null
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
  await query(`
    ALTER TABLE gc_users
      ADD COLUMN IF NOT EXISTS phone text,
      ADD COLUMN IF NOT EXISTS commission_rate numeric,
      ADD COLUMN IF NOT EXISTS language text,
      ADD COLUMN IF NOT EXISTS ai_tone text,
      ADD COLUMN IF NOT EXISTS ai_verbosity text,
      ADD COLUMN IF NOT EXISTS notifications jsonb,
      ADD COLUMN IF NOT EXISTS password_hash text,
      ADD COLUMN IF NOT EXISTS password_reset_token_hash text,
      ADD COLUMN IF NOT EXISTS password_reset_expires timestamptz,
      ADD COLUMN IF NOT EXISTS last_login_at timestamptz,
      ADD COLUMN IF NOT EXISTS ai_access boolean DEFAULT false
  `)
}

export async function getUserProfileByEmail(email: string) {
  await ensureUsersTable()
  const rows = await query<UserProfileRecord>(
    `SELECT id, name, email, role, phone, commission_rate, language, ai_tone, ai_verbosity,
            notifications, last_login_at, created_at
     FROM gc_users
     WHERE email = $1
     LIMIT 1`,
    [email],
  )
  return rows[0] || null
}

export interface UserAccessRecord {
  id: string
  name: string | null
  email: string
  role: string
  ai_access: boolean
}

export async function getUserAccessList() {
  await ensureUsersTable()
  return query<UserAccessRecord>(
    `SELECT id, name, email, role, ai_access
     FROM gc_users
     ORDER BY created_at DESC`,
  )
}

export async function setUserAiAccess(id: string, aiAccess: boolean) {
  await ensureUsersTable()
  const rows = await query<UserAccessRecord>(
    `UPDATE gc_users
     SET ai_access = $2
     WHERE id = $1
     RETURNING id, name, email, role, ai_access`,
    [id, aiAccess],
  )
  return rows[0] || null
}

export interface BrokerPerformanceSnapshot {
  totalLeads: number
  hotLeads: number
  pipelineValue: number
  lastLeadAt: string | null
  lastContactAt: string | null
}

export async function getBrokerPerformanceSummary(brokerId: string): Promise<BrokerPerformanceSnapshot> {
  await ensureLeadsTable()
  const [total] = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count
     FROM gc_leads
     WHERE assigned_broker_id = $1`,
    [brokerId],
  )

  const [pipeline] = await query<{ total: number }>(
    `SELECT COALESCE(SUM(p.price_from_aed), 0)::bigint AS total
     FROM gc_leads l
     JOIN gc_projects p ON p.slug = l.project_slug
     WHERE l.assigned_broker_id = $1`,
    [brokerId],
  )

  const [lastLead] = await query<{ last: string | null }>(
    `SELECT MAX(created_at) AS last
     FROM gc_leads
     WHERE assigned_broker_id = $1`,
    [brokerId],
  )

  const [lastContact] = await query<{ last: string | null }>(
    `SELECT MAX(last_contact_at) AS last
     FROM gc_leads
     WHERE assigned_broker_id = $1`,
    [brokerId],
  )

  const recentLeads = await query<LeadRecord>(
    `SELECT id, name, phone, email, source, project_slug, assigned_broker_id, status, priority,
            last_contact_at, country, budget_aed, interest, created_at
     FROM gc_leads
     WHERE assigned_broker_id = $1
     ORDER BY created_at DESC
     LIMIT 200`,
    [brokerId],
  )

  const hotLeads = recentLeads
    .map(applyLeadDefaults)
    .filter((lead) => lead.priority === "hot").length

  return {
    totalLeads: total?.count || 0,
    hotLeads,
    pipelineValue: pipeline?.total || 0,
    lastLeadAt: lastLead?.last || null,
    lastContactAt: lastContact?.last || null,
  }
}

export async function upsertUserProfile(profile: {
  id: string
  name: string
  email: string
  role: string
  phone?: string | null
  commission_rate?: number | null
  language?: string | null
  ai_tone?: string | null
  ai_verbosity?: string | null
  notifications?: Record<string, boolean> | null
  password_hash?: string | null
}) {
  await ensureUsersTable()
  const rows = await query<UserProfileRecord>(
    `INSERT INTO gc_users (id, name, email, role, phone, commission_rate, language, ai_tone, ai_verbosity, notifications, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (email)
     DO UPDATE SET
       name = EXCLUDED.name,
       role = EXCLUDED.role,
       phone = EXCLUDED.phone,
       commission_rate = EXCLUDED.commission_rate,
       language = EXCLUDED.language,
       ai_tone = EXCLUDED.ai_tone,
       ai_verbosity = EXCLUDED.ai_verbosity,
       notifications = EXCLUDED.notifications,
       password_hash = COALESCE(EXCLUDED.password_hash, gc_users.password_hash)
     RETURNING id, name, email, role, phone, commission_rate, language, ai_tone, ai_verbosity,
               notifications, last_login_at, created_at`,
    [
      profile.id,
      profile.name,
      profile.email,
      profile.role,
      profile.phone || null,
      typeof profile.commission_rate === "number" ? profile.commission_rate : null,
      profile.language || null,
      profile.ai_tone || null,
      profile.ai_verbosity || null,
      profile.notifications || null,
      profile.password_hash || null,
    ].map(p => (typeof p === 'object' && p !== null) ? JSON.stringify(p) : p),
  )
  return rows[0]
}
