export function safeNum(value: number | null | undefined, fallback = "—"): string {
  if (value === null || value === undefined || value === 0 || Number.isNaN(value)) {
    return fallback
  }
  return value.toLocaleString()
}

export function safePrice(value: number | null | undefined, currency = "AED", fallback = "Price on Request"): string {
  if (value === null || value === undefined || value === 0 || Number.isNaN(value)) {
    return fallback
  }
  const formatter = new Intl.NumberFormat(currency === "AED" ? "en-AE" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  })
  return formatter.format(value)
}

export function safePercent(value: number | null | undefined, fallback = "—"): string {
  if (value === null || value === undefined || value === 0 || Number.isNaN(value)) {
    return fallback
  }
  return `${value.toFixed(1)}%`
}

export function safeScore(value: number | null | undefined, fallback = "—"): string {
  if (value === null || value === undefined || value === 0 || Number.isNaN(value)) {
    return fallback
  }
  return `${Math.round(value)}/100`
}

export function safeROI(value: number | null | undefined, fallback = "—"): string {
  if (value === null || value === undefined || value === 0 || Number.isNaN(value)) {
    return fallback
  }
  return `~${value.toFixed(1)} yr ROI`
}

export function shouldShow(value: any): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === "number") {
    return value !== 0 && !Number.isNaN(value)
  }
  if (typeof value === "string") {
    return value.trim() !== ""
  }
  if (Array.isArray(value)) {
    return value.length > 0
  }
  return true
}
