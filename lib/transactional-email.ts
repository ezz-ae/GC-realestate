interface ShortProjectEmailItem {
  slug: string
  name: string
  area?: string | null
  priceFrom?: number | null
  roi?: number | null
  brochureUrl?: string | null
  projectUrl?: string | null
}

interface LeadAckEmailInput {
  to: string
  name?: string | null
  inquiry?: string
  projects?: ShortProjectEmailItem[]
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim() || "https://goldcentury.ae"
const resendApiKey = process.env.RESEND_API_KEY?.trim() || ""
const fromEmail =
  process.env.LEADS_FROM_EMAIL?.trim() ||
  process.env.NOTIFICATIONS_FROM_EMAIL?.trim() ||
  "Gold Century <hello@goldcentury.ae>"

const formatAed = (value: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value)

export async function sendLeadAcknowledgementEmail(input: LeadAckEmailInput) {
  if (!resendApiKey || !input.to) {
    return { sent: false, reason: "missing-config" as const }
  }

  const greeting = input.name?.trim() ? `Hi ${input.name.trim()},` : "Hi,"
  const projects = Array.isArray(input.projects) ? input.projects.slice(0, 3) : []
  const projectText = projects.length
    ? projects
        .map((project) => {
          const priceText =
            typeof project.priceFrom === "number" && project.priceFrom > 0
              ? ` from ${formatAed(project.priceFrom)}`
              : ""
          const roiText =
            typeof project.roi === "number" && Number.isFinite(project.roi)
              ? ` • ${project.roi.toFixed(1)}% ROI`
              : ""
          const links = [project.projectUrl ? `Page: ${project.projectUrl}` : "", project.brochureUrl ? `Brochure: ${project.brochureUrl}` : ""]
            .filter(Boolean)
            .join(" | ")
          return `- ${project.name}${project.area ? ` (${project.area})` : ""}${priceText}${roiText}${links ? ` | ${links}` : ""}`
        })
        .join("\n")
    : "- A senior consultant will share the most relevant projects shortly."

  const projectHtml = projects.length
    ? `<ul>${projects
        .map((project) => {
          const priceText =
            typeof project.priceFrom === "number" && project.priceFrom > 0
              ? ` from ${formatAed(project.priceFrom)}`
              : ""
          const roiText =
            typeof project.roi === "number" && Number.isFinite(project.roi)
              ? ` • ${project.roi.toFixed(1)}% ROI`
              : ""
          const projectLink = project.projectUrl
            ? ` <a href="${project.projectUrl}">Project page</a>`
            : ""
          const brochureLink = project.brochureUrl
            ? ` <a href="${project.brochureUrl}">Brochure</a>`
            : ""
          return `<li><strong>${project.name}</strong>${project.area ? ` (${project.area})` : ""}${priceText}${roiText}${projectLink}${brochureLink ? ` · ${brochureLink}` : ""}</li>`
        })
        .join("")}</ul>`
    : "<p>A senior consultant will share the most relevant projects shortly.</p>"

  const text = `${greeting}

Thank you for contacting Gold Century. Your request has been received and one of our consultants will contact you shortly.

${input.inquiry ? `Your request: ${input.inquiry}\n` : ""}Shortlist:
${projectText}

You can also continue the conversation here: ${baseUrl}/chat

Gold Century Real Estate`

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <p>${greeting}</p>
      <p>Thank you for contacting <strong>Gold Century</strong>. Your request has been received and one of our consultants will contact you shortly.</p>
      ${input.inquiry ? `<p><strong>Your request:</strong> ${input.inquiry}</p>` : ""}
      <p><strong>Shortlist</strong></p>
      ${projectHtml}
      <p><a href="${baseUrl}/chat">Continue with the AI assistant</a></p>
      <p>Gold Century Real Estate</p>
    </div>
  `

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [input.to],
      subject: "Gold Century received your inquiry",
      text,
      html,
    }),
  })

  if (!response.ok) {
    const payload = await response.text().catch(() => "")
    console.error("[email] resend error", payload)
    return { sent: false, reason: "provider-error" as const }
  }

  return { sent: true as const }
}

export async function sendInternalLeadAlertEmail(input: {
  to: string[]
  lead: {
    name?: string | null
    email?: string | null
    phone?: string | null
    source?: string | null
    projectSlug?: string | null
    message?: string | null
  }
  projects?: ShortProjectEmailItem[]
}) {
  if (!resendApiKey || !input.to.length) {
    return { sent: false, reason: "missing-config" as const }
  }

  const projectLines = (input.projects || [])
    .slice(0, 3)
    .map((project) => {
      const page = project.projectUrl ? ` | ${project.projectUrl}` : ""
      return `- ${project.name}${project.area ? ` (${project.area})` : ""}${page}`
    })
    .join("\n")

  const text = `New AI lead captured

Name: ${input.lead.name || "Unknown"}
Phone: ${input.lead.phone || "—"}
Email: ${input.lead.email || "—"}
Source: ${input.lead.source || "ai-chat"}
Project: ${input.lead.projectSlug || "—"}
Message: ${input.lead.message || "—"}

Shortlist:
${projectLines || "- No shortlist attached"}
`

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <p><strong>New AI lead captured</strong></p>
      <p>Name: ${input.lead.name || "Unknown"}<br/>
      Phone: ${input.lead.phone || "—"}<br/>
      Email: ${input.lead.email || "—"}<br/>
      Source: ${input.lead.source || "ai-chat"}<br/>
      Project: ${input.lead.projectSlug || "—"}</p>
      <p><strong>Message</strong><br/>${input.lead.message || "—"}</p>
      <p><strong>Shortlist</strong></p>
      <ul>${(input.projects || [])
        .slice(0, 3)
        .map(
          (project) =>
            `<li>${project.name}${project.area ? ` (${project.area})` : ""}${project.projectUrl ? ` · <a href="${project.projectUrl}">Project page</a>` : ""}</li>`,
        )
        .join("")}</ul>
    </div>
  `

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: input.to,
      subject: "New AI lead captured",
      text,
      html,
    }),
  })

  if (!response.ok) {
    const payload = await response.text().catch(() => "")
    console.error("[email] internal resend error", payload)
    return { sent: false, reason: "provider-error" as const }
  }

  return { sent: true as const }
}
