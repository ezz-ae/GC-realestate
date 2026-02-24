export type PropertyType = "off-plan" | "secondary" | "commercial"
export type PropertyCategory =
  | "apartment"
  | "villa"
  | "townhouse"
  | "penthouse"
  | "office"
  | "retail"
  | "warehouse"
export type PropertyStatus = "available" | "reserved" | "sold"
export type ProjectStatus = "launching" | "selling" | "sold-out" | "completed"
export type LandmarkType = "airport" | "metro" | "mall" | "beach" | "school" | "hospital"

export interface Coordinates {
  lat: number
  lng: number
}

export interface DeveloperSummary {
  id: string
  name: string
  slug: string
  logo: string
}

export interface PropertyLandmark {
  name: string
  distance: string
}

export interface PaymentPlanInstallment {
  percentage: number
  amount: number
  date: string
  description: string
}

export interface PaymentPlan {
  downPayment: number
  duringConstruction: number
  onHandover: number
  postHandover: number
  installments?: PaymentPlanInstallment[]
}

export interface Property {
  id: string
  title: string
  slug: string
  type: PropertyType
  category: PropertyCategory
  price: number
  currency: "AED" | "USD"
  location: {
    area: string
    district: string
    city: string
    coordinates: Coordinates
    freehold: boolean
  }
  specifications: {
    bedrooms: number
    bathrooms: number
    sizeSqft: number
    sizeSqm: number
    parkingSpaces: number
    furnished: boolean
    view: string
  }
  images: string[]
  video?: string
  virtualTour?: string
  description: string
  highlights: string[]
  amenities: string[]
  developer: DeveloperSummary
  project?: {
    id: string
    name: string
    slug: string
  }
  investmentMetrics: {
    roi: number
    rentalYield: number
    appreciationRate: number
    goldenVisaEligible: boolean
  }
  paymentPlan?: PaymentPlan
  completionDate?: string
  handoverDate?: string
  status: PropertyStatus
  featured: boolean
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  nearbyLandmarks?: PropertyLandmark[]
  createdAt: string
  updatedAt: string
}

export interface ProjectLandmark {
  name: string
  distance: string
  type?: LandmarkType
}

export interface ProjectDeveloper extends DeveloperSummary {
  description: string
  trackRecord: string
}

export interface ProjectUnitConfig {
  type: string
  priceFrom: number
  priceTo: number
  sizeFrom: number
  sizeTo: number
  available: number
  floorPlan: string
  interiorImage?: string
}

export interface ConstructionUpdate {
  date: string
  description: string
  images: string[]
}

export interface Project {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  longDescription: string
  heroImage: string
  heroVideo?: string
  virtualTour?: string
  gallery: string[]
  developer: ProjectDeveloper
  location: {
    area: string
    district: string
    city: string
    coordinates: Coordinates
    freehold: boolean
    nearbyLandmarks: ProjectLandmark[]
  }
  units: ProjectUnitConfig[]
  amenities: string[]
  highlights: string[]
  investmentHighlights: {
    expectedROI: number
    rentalYield: number
    goldenVisaEligible: boolean
    paymentPlanAvailable: boolean
  }
  paymentPlan: PaymentPlan
  timeline: {
    launchDate: string
    constructionStart: string
    expectedCompletion: string
    handoverDate: string
    progressPercentage: number
  }
  constructionUpdates: ConstructionUpdate[]
  masterplan: string
  specifications: string
  brochure: string
  testimonials: Array<{
    name: string
    country: string
    quote: string
    image?: string
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  ogImage: string
  status: ProjectStatus
  featured: boolean
  scarcityMessage?: string
  urgencyMessage?: string
  createdAt: string
  updatedAt: string
}

export interface AreaLandmark {
  name: string
  type: LandmarkType
  distance: string
}

export interface AreaProfile {
  id: string
  name: string
  slug: string
  heroImage: string
  heroVideo?: string
  description: string
  avgPricePerSqft: number
  rentalYield: number
  investmentScore: number
  freehold: boolean
  landmarks: AreaLandmark[]
  investmentReasons: string[]
  lifestyleTags: string[]
  propertyCount: number
}

export interface DeveloperProfile {
  id: string
  name: string
  slug: string
  tier?: string
  logo: string
  bannerImage: string
  galleryImages: string[]
  description: string
  trackRecord: string
  awards: string[]
  website?: string
  foundedYear?: number
  headquarters?: string
  activeProjects?: number
  completedProjects?: number
  projectCount?: number
}
