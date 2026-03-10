import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  Users,
  Rocket,
  BarChart3,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  ArrowRight,
  Shield,
  Crown,
  Briefcase,
  UserCheck,
  Zap,
  Target,
  TrendingUp,
  Clock,
  BookOpen,
  Star,
  AlertCircle,
  PlusCircle,
  Settings,
  PhoneCall,
  CircleDollarSign,
  CalendarCheck,
  Flame,
  FileSpreadsheet,
  Pin,
  Filter,
  SortAsc,
  Globe,
  Key,
  RefreshCw,
  Eye,
  Edit2,
  Info,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function Section({
  id,
  label,
  title,
  subtitle,
  children,
}: {
  id: string
  label: string
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">{label}</p>
        <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#C9A961]/20 bg-[#C9A961]/5 px-6 py-5 space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#C9A961]">{title}</p>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  )
}

function FieldRow({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
      <code className="shrink-0 rounded bg-muted px-2 py-0.5 text-xs font-mono text-foreground">{label}</code>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

function StepRow({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
        {n}
      </div>
      <div className="pt-1 space-y-0.5">
        <p className="font-semibold text-sm text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function PlaybookPage() {
  const TOC = [
    { id: "overview-module", label: "Overview" },
    { id: "ai-assistant-module", label: "AI Assistant" },
    { id: "inventory-module", label: "Inventory" },
    { id: "add-project-module", label: "Add Project" },
    { id: "landing-pages-module", label: "Landing Pages" },
    { id: "leads-module", label: "Leads" },
    { id: "analytics-module", label: "Analytics" },
    { id: "profile-module", label: "Profile" },
    { id: "whatsapp-flow", label: "WhatsApp Flow" },
    { id: "lead-workflow", label: "Lead Workflow" },
    { id: "roles-access", label: "Roles" },
    { id: "data-flow", label: "Data Flow" },
    { id: "faq", label: "FAQ" },
  ]

  return (
    <div className="space-y-20">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-[2rem] border border-[#C9A961]/25 bg-[radial-gradient(ellipse_at_top_left,rgba(201,169,97,0.18),transparent_55%),linear-gradient(135deg,#0f172a,#111827)] p-10 text-white md:p-14">
        <div className="absolute right-8 top-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C9A961]/30 bg-[#C9A961]/10">
          <BookOpen className="h-7 w-7 text-[#C9A961]" />
        </div>
        <Badge className="mb-6 border-[#C9A961]/40 bg-[#C9A961]/15 text-[#C9A961] text-[10px] uppercase tracking-[0.2em]">
          Gold Century CRM · Complete Playbook
        </Badge>
        <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
          Every feature.<br />Every screen.<br />Explained.
        </h1>
        <p className="mt-4 max-w-xl text-base text-white/60 leading-relaxed">
          The definitive reference for every member of the Gold Century team — from first login through closing a deal.
        </p>
        <div className="mt-8 flex flex-wrap gap-2 text-sm text-white/50">
          {TOC.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs transition-colors hover:border-[#C9A961]/40 hover:text-[#C9A961]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════ */}
      {/* 01 OVERVIEW */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="overview-module"
        label="Module 01"
        title="Overview — Your Daily Command Centre"
        subtitle="The first page you see after login. Opens at /crm/overview."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { icon: Users, label: "Today's Leads", desc: "Total new leads captured since midnight (Dubai time). Resets at 00:00." },
            { icon: CalendarCheck, label: "Assigned This Week", desc: "Leads assigned to a broker in the current Mon–Sun window." },
            { icon: PhoneCall, label: "Active Inquiries (30d)", desc: "Leads with at least one activity log in the last 30 days." },
            { icon: TrendingUp, label: "Scheduled Viewings", desc: "Leads with status 'viewing' in the pipeline." },
            { icon: CircleDollarSign, label: "Revenue Pipeline", desc: "Sum of budget_aed across all active leads assigned to you (or everyone, for admin)." },
            { icon: Flame, label: "Hot Leads Alert", desc: "AI-scored leads: recency + budget + contact completeness. Score shown as a number out of 10." },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card/80 p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mt-2">
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-4">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Suggested Tasks
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Three AI-generated tasks appear here each day based on live data: the hottest uncontacted lead, the count of unassigned leads, and the top project to promote. Tasks update on page refresh.
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-4">
            <p className="font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Project Performance Leaderboard
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Shows your top projects ranked by market score (1–10). Each row shows area, score, and expected ROI %. Use this to decide which projects to push in campaigns.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Admin-only sections on Overview</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">AI Training Card</strong> — Submit natural-language knowledge updates (e.g. "The Marina Heights handover moved to Q4 2026") that get saved as training signals for the AI.</p>
            <p><strong className="text-foreground">Admin Control Panel</strong> — Grant or revoke AI control access for any team member. Toggle on/off per user.</p>
            <p><strong className="text-foreground">AI Project Update Panel</strong> — Push a structured update to any project in inventory (price change, availability, handover date). The change writes to the database and refreshes the AI context.</p>
            <p><strong className="text-foreground">Learning Conversations</strong> — View all pinned AI conversations that have been marked as learning signals.</p>
          </div>
        </div>

        <InfoBox title="Best practice">
          Check Overview every morning before your first call. The KPIs, hot leads, and suggested tasks give you a 30-second brief on where to focus. Then open AI Assistant for deeper analysis.
        </InfoBox>
      </Section>

      {/* ══════════════════════════════════════════ */}
      {/* 02 AI ASSISTANT */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="ai-assistant-module"
        label="Module 02"
        title="AI Assistant — Broker Intelligence Command"
        subtitle="Full-page AI chat at /crm/ai-assistant. Powered by Google Gemini with access to your CRM data."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { prompt: '"Show me my hottest leads today"', result: "Scores all your assigned leads by recency, budget, phone/email completeness. Returns top 8 with a scored reason for each." },
            { prompt: '"List projects with 8%+ ROI"', result: "Live inventory query. Returns matching projects with area, developer, price range, and ROI." },
            { prompt: '"Draft a WhatsApp follow-up for Ahmed who viewed Marina Heights"', result: "Pulls lead data + project data, writes a personalised ready-to-send WhatsApp message." },
            { prompt: '"Show unassigned leads from the last 7 days"', result: "Filters the pipeline and returns all leads with no assigned_broker_id in the date range." },
            { prompt: '"What projects are in Business Bay under AED 1.5M?"', result: "Budget + area filtered inventory search." },
            { prompt: '"Create listing: GC Marina Edge, area: Dubai Marina, roi: 8.4"', result: "Starts an AI-assisted project creation and writes it to the inventory database." },
          ].map(({ prompt, result }) => (
            <div key={prompt} className="rounded-2xl border border-border/60 bg-card/80 p-5 space-y-2">
              <p className="text-sm font-semibold text-foreground">{prompt}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{result}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 divide-y divide-border/40">
          <div className="px-6 py-4">
            <p className="font-semibold text-foreground mb-3 flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-primary" /> Export & Share panel</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Export latest results to CSV</strong> — After any query that returns leads or projects, this downloads a spreadsheet with all returned rows.</p>
              <p><strong className="text-foreground">Download shortlist summary</strong> — Downloads a plain-text formatted summary of the last result set, ready to paste into an email or WhatsApp broadcast.</p>
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="font-semibold text-foreground mb-3 flex items-center gap-2"><Pin className="h-4 w-4 text-primary" /> Conversation History panel</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Every AI session is saved automatically. The panel on the right shows your recent conversations with their auto-generated title.</p>
              <p><strong className="text-foreground">Pin</strong> — Marks the conversation as a learning signal for the AI model.</p>
              <p><strong className="text-foreground">Share</strong> — Copies the conversation title to clipboard for sharing context with colleagues.</p>
            </div>
          </div>
        </div>

        <InfoBox title="How context works">
          The AI remembers your conversation within a session. If you ask for projects and then say "draft a WhatsApp for the lead who was interested in the first one" — it connects the dots automatically. Start a new page load for a fresh session.
        </InfoBox>
      </Section>

      {/* ══════════════════════════════════════════ */}
      {/* 03 INVENTORY */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="inventory-module"
        label="Module 03"
        title="Inventory — Project Database"
        subtitle="Browse and filter all 3,500+ Dubai projects at /crm/inventory."
      >
        <div className="rounded-2xl border border-border/60 bg-card/80 divide-y divide-border/40">
          <div className="px-6 py-4">
            <p className="font-semibold text-foreground mb-3 flex items-center gap-2"><Filter className="h-4 w-4 text-primary" /> Filter bar</p>
            <div className="space-y-2">
              <FieldRow label="Search" desc="Free-text search on project name. Partial matches work." />
              <FieldRow label="Area" desc="Dropdown of all distinct areas in the database (Dubai Marina, Downtown, Palm, etc.)." />
              <FieldRow label="Developer" desc="Dropdown of all distinct developer names." />
              <FieldRow label="Status" desc="Selling / Sold Out / Coming Soon." />
              <FieldRow label="Min / Max AED" desc="Price range filter on priceFrom field." />
              <FieldRow label="Sort" desc="Market score (default) / ROI / Price low / Price high." />
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="font-semibold text-foreground mb-3 flex items-center gap-2"><SortAsc className="h-4 w-4 text-primary" /> Table columns</p>
            <div className="space-y-2">
              <FieldRow label="Project" desc="Name + developer. Click Edit to modify fields." />
              <FieldRow label="Area" desc="Primary area from the database." />
              <FieldRow label="Status" desc="Current selling status." />
              <FieldRow label="Price Range" desc="priceFrom – priceTo in AED." />
              <FieldRow label="ROI" desc="Expected ROI % from investmentHighlights." />
              <FieldRow label="Units" desc="Available units count." />
              <FieldRow label="Actions" desc="Edit · Create LP · View (opens public project page)." />
            </div>
          </div>
          <div className="px-6 py-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary shrink-0" />
              <span><strong className="text-foreground">Export button</strong> — Downloads the current filtered page as a CSV. Use for sending shortlists to a client.</span>
            </div>
          </div>
        </div>
        <InfoBox title="Quick action">
          To create a landing page for any project, click <strong>Create LP</strong> in that project's row. It pre-fills the project slug on the landing page creator.
        </InfoBox>
      </Section>

      {/* ══════════════════════════════════════════ */}
      {/* 04 ADD / EDIT PROJECT */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="add-project-module"
        label="Module 04"
        title="Add / Edit Project"
        subtitle="Manually add off-market or exclusive listings at /crm/projects/add. Edit existing projects via the Inventory table."
      >
        <div className="rounded-2xl border border-border/60 bg-card/80 px-6 py-5 space-y-3">
          <p className="font-semibold text-foreground">Key fields</p>
          <div className="space-y-1">
            <FieldRow label="Slug" desc="URL-safe identifier (auto-generated from name). Must be unique. Used in /projects/[slug] and /lp/[slug]." />
            <FieldRow label="Name" desc="Full display name of the project." />
            <FieldRow label="Area" desc="Primary Dubai area (matches the dropdown in Inventory)." />
            <FieldRow label="Developer" desc="Developer company name." />
            <FieldRow label="Price From / To" desc="AED price range for the available units." />
            <FieldRow label="Expected ROI %" desc="Projected annual return — shown in inventory, landing pages, and AI responses." />
            <FieldRow label="Status" desc="selling / sold-out / coming-soon." />
            <FieldRow label="Handover Date" desc="Expected completion date. Shown on the project page and landing page." />
            <FieldRow label="Units Available" desc="Number of unsold units." />
            <FieldRow label="Payment Plan" desc="Down % / During construction % / On handover % / Post handover %. Must add to 100." />
            <FieldRow label="Description" desc="Project narrative shown on the public project page." />
          </div>
        </div>
        <InfoBox title="AI enrichment on save">
          After saving, the system runs an AI enrichment pass: it generates an investment summary, market intelligence bullets, and area context from the Entrestate database. These appear on the project&apos;s landing page under the Market Intelligence section.
        </InfoBox>
      </Section>

      {/* ══════════════════════════════════════════ */}
      {/* 05 LANDING PAGES */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="landing-pages-module"
        label="Module 05"
        title="Landing Pages — Campaign Advertising"
        subtitle="Generate and manage shareable project ad pages at /crm/landing-pages. Admin access only."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Globe, label: "Total Campaign Pages", desc: "All landing pages in the system, across all statuses." },
            { icon: CheckCircle2, label: "Published", desc: "Pages with status published / active / live — publicly accessible." },
            { icon: Users, label: "Leads / Views", desc: "Total leads submitted through LP forms + total page view events tracked." },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-2xl border border-border/60 bg-card/80 p-5 flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 divide-y divide-border/40">
          <div className="px-6 py-4 space-y-2">
            <p className="font-semibold text-foreground">Table columns</p>
            <FieldRow label="Campaign" desc="Headline text + slug URL (/lp/[slug])." />
            <FieldRow label="Project" desc="Linked project slug from inventory." />
            <FieldRow label="Status" desc="draft (not public) / published (live) / active / live. Green = public, amber = draft." />
            <FieldRow label="Views" desc="Page view events recorded by the tracking middleware." />
            <FieldRow label="Leads" desc="Form submissions linked to this landing page slug." />
            <FieldRow label="Window" desc="publishFrom → publishTo dates. Page is only public within this window." />
            <FieldRow label="Open" desc="Opens the live landing page in a new tab. Use this link to share with clients." />
          </div>
          <div className="px-6 py-4 space-y-3">
            <p className="font-semibold text-foreground">What a landing page contains</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
              {[
                ["Hero section", "Project image, headline, urgency ribbon, investment chips, lead capture form"],
                ["ROI section", "Expected ROI, rental yield, starting price — pulled from project data"],
                ["Key Facts", "Area, developer, handover, units, bedroom types — auto-populated"],
                ["Payment Plan", "Visual timeline showing down payment, construction, handover, post-handover %"],
                ["Market Intelligence", "AI-generated investment narrative and bullet insights"],
                ["AI Concierge", "Pre-populated question links that open the public AI chat"],
              ].map(([name, desc]) => (
                <div key={name} className="rounded-xl border border-border/40 bg-background/60 px-4 py-3">
                  <p className="font-semibold text-xs text-foreground">{name}</p>
                  <p className="text-xs mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <InfoBox title="How to share a landing page">
          Copy the URL from the <strong>Open</strong> button (<code>/lp/[slug]</code>) and paste it into a WhatsApp message, Instagram bio, email, or paid ad. Every lead who fills the form on that page is automatically tagged with the landing page slug and attributed to it in Analytics.
        </InfoBox>
      </Section>

      {/* ══════════════════════════════════════════ */}
      {/* 06 LEADS */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="leads-module"
        label="Module 06"
        title="Leads — Full Pipeline Management"
        subtitle="View, filter, assign, and work every lead at /crm/leads."
      >
        {/* Status definitions */}
        <div className="rounded-2xl border border-border/60 bg-card/80 px-6 py-5 space-y-3">
          <p className="font-semibold text-foreground">Lead statuses — what they mean</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { status: "new", color: "bg-blue-400/10 text-blue-500", desc: "Just captured. Not yet contacted by any broker." },
              { status: "contacted", color: "bg-amber-400/10 text-amber-600", desc: "Broker has made at least one outreach (call, WhatsApp, email)." },
              { status: "qualified", color: "bg-purple-400/10 text-purple-500", desc: "Broker confirmed budget, timeline, and intent. Real buyer." },
              { status: "viewing", color: "bg-orange-400/10 text-orange-500", desc: "Site visit or virtual viewing scheduled or completed." },
              { status: "offer", color: "bg-emerald-400/10 text-emerald-600", desc: "Offer submitted or under negotiation." },
              { status: "converted", color: "bg-green-500/15 text-green-600", desc: "Deal closed. Reservation form signed." },
              { status: "lost", color: "bg-rose-400/10 text-rose-500", desc: "Lead dropped out. Keep the record — recycle in 6–12 months." },
            ].map(({ status, color, desc }) => (
              <div key={status} className="flex items-start gap-3">
                <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${color}`}>{status}</span>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lead detail */}
        <div className="rounded-2xl border border-border/60 bg-card/80 divide-y divide-border/40">
          <div className="px-6 py-4 space-y-2">
            <p className="font-semibold text-foreground">Lead Detail page fields</p>
            <FieldRow label="Name" desc="Full name as submitted on the lead form." />
            <FieldRow label="Phone" desc="WhatsApp/mobile. Used for Call button (tel:) and WhatsApp button (wa.me/)." />
            <FieldRow label="Email" desc="Used for the Open Email button which pre-fills subject + body from the AI draft." />
            <FieldRow label="Status" desc="Current pipeline stage. Can be updated from the Add Update card." />
            <FieldRow label="Assigned Broker" desc="The broker ID assigned to this lead. Admins can re-assign." />
            <FieldRow label="Source" desc="Where the lead came from: website, landing-page, whatsapp, referral, etc." />
            <FieldRow label="Last Contact" desc="Auto-updated when 'Mark as contacted' is checked or a WhatsApp is sent." />
            <FieldRow label="Budget" desc="budget_aed as entered by the lead on the form." />
            <FieldRow label="Priority" desc="1–5 score set by the system at capture based on budget and completeness." />
          </div>
          <div className="px-6 py-4 space-y-2">
            <p className="font-semibold text-foreground">Activity Timeline — activity types</p>
            <FieldRow label="note" desc="Manual note added by a broker from the Add Update card." />
            <FieldRow label="status_update" desc="Auto-logged when the broker changes lead status." />
            <FieldRow label="whatsapp_sent" desc="Auto-logged when broker clicks Send on WhatsApp. Includes the first 120 chars of the message." />
          </div>
          <div className="px-6 py-4 space-y-2">
            <p className="font-semibold text-foreground flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI Follow-Up Composer</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Auto-generates on page load. Three tabs:
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground ml-2">
              <li className="flex items-start gap-2"><ArrowRight className="h-3 w-3 mt-1 shrink-0 text-primary" /><span><strong className="text-foreground">WhatsApp</strong> — Editable draft. Click &ldquo;Send on WhatsApp&rdquo; to open WhatsApp Web pre-filled. Activity is logged automatically.</span></li>
              <li className="flex items-start gap-2"><ArrowRight className="h-3 w-3 mt-1 shrink-0 text-primary" /><span><strong className="text-foreground">Email</strong> — Subject + body draft. &ldquo;Open in Mail&rdquo; opens your default mail client with the draft pre-loaded.</span></li>
              <li className="flex items-start gap-2"><ArrowRight className="h-3 w-3 mt-1 shrink-0 text-primary" /><span><strong className="text-foreground">Next Steps</strong> — 3–5 AI-recommended actions ranked by conversion probability.</span></li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════ */}
      {/* 07 ANALYTICS */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="analytics-module"
        label="Module 07"
        title="Analytics — Sales & Market Intelligence"
        subtitle="Performance data at /crm/analytics. Brokers see only their data; admins see all."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Pipeline Value (30d)",
              desc: "Sum of budget_aed for all active leads in the last 30 days. For brokers: only their leads. For admins: all leads. Use this as a directional revenue indicator, not a guaranteed number.",
            },
            {
              title: "Lead Source Performance",
              desc: "Bar chart of lead count by source (website, landing-page, whatsapp, referral, instagram, etc.). The source with the most leads sets the 100% bar. Use this to identify your best-performing acquisition channel.",
            },
            {
              title: "Broker Performance",
              desc: "Lead count per assigned broker ID. Admins use this to identify who is under-loaded and redistribute. Sales managers see their team only.",
            },
            {
              title: "Demand by Area",
              desc: "Lead count grouped by the project_slug area field. Shows where buyer interest is concentrated — useful for deciding which areas to promote in campaigns.",
            },
            {
              title: "Top Projects",
              desc: "Highest market-scored projects with their expected ROI. Cross-reference with Demand by Area to find projects in high-interest areas.",
            },
            {
              title: "Lead Sources count",
              desc: "Total distinct sources active in the pipeline. A higher number means more diversified acquisition — good. A single dominant source is a concentration risk.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="rounded-2xl border border-border/60 bg-card/80 p-5 space-y-2">
              <p className="font-semibold text-sm text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <InfoBox title="When to use Analytics">
          Review Analytics every Monday morning. Check which sources are producing and which brokers are behind. Use the AI Assistant to drill deeper: &ldquo;Which of my leads from Instagram haven&apos;t been contacted in 7 days?&rdquo;
        </InfoBox>
      </Section>

      {/* ══════════════════════════════════════════ */}
      {/* 08 PROFILE */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="profile-module"
        label="Module 08"
        title="Profile — Personal Settings & Team"
        subtitle="Manage your account and view performance at /crm/profile."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2"><Settings className="h-4 w-4 text-primary" /> Your profile</p>
            <div className="space-y-1">
              <FieldRow label="Name" desc="Display name shown in the sidebar and on lead assignments." />
              <FieldRow label="Email" desc="Login email. Cannot be changed without admin access." />
              <FieldRow label="Password" desc="Update via the profile form. Min 8 characters." />
              <FieldRow label="Role" desc="Your access level. Only admins and managers can change roles." />
              <FieldRow label="Commission Rate" desc="Your commission % used to estimate earnings from pipeline value." />
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 space-y-3">
            <p className="font-semibold text-foreground flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Performance snapshot</p>
            <div className="space-y-1">
              <FieldRow label="Assigned Leads" desc="Total leads currently assigned to your account." />
              <FieldRow label="Hot Leads" desc="Your leads scored above the hot threshold." />
              <FieldRow label="Pipeline Value" desc="Sum of budget_aed across your active leads." />
              <FieldRow label="Commission Est." desc="Pipeline Value × Commission Rate. Directional only." />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Admin / Manager: Team Accounts panel</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>View all team members with their role and email. From here you can:</p>
            <ul className="space-y-1 ml-2">
              <li className="flex items-start gap-2"><ArrowRight className="h-3 w-3 mt-1 shrink-0 text-amber-500" /><span><strong className="text-foreground">View any broker&apos;s profile</strong> — append <code>?email=broker@company.com</code> to the profile URL.</span></li>
              <li className="flex items-start gap-2"><ArrowRight className="h-3 w-3 mt-1 shrink-0 text-amber-500" /><span><strong className="text-foreground">Delete a user account</strong> — Only users with delete permission (CEO / full admin).</span></li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/80 px-6 py-5 space-y-3">
          <p className="font-semibold text-foreground flex items-center gap-2"><Key className="h-4 w-4 text-primary" /> Password reset flow</p>
          <div className="space-y-2">
            <StepRow n={1} title="Go to /crm/login" body="Click 'Forgot password?' below the login form." />
            <StepRow n={2} title="Enter your email" body="A reset link is generated and shown on-screen (or sent if email is configured)." />
            <StepRow n={3} title="Open /crm/reset/[token]" body="Enter your new password. The token expires after 1 hour." />
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════ */}
      {/* 09 WHATSAPP FLOW */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="whatsapp-flow"
        label="Section 09"
        title="WhatsApp Send Flow — No API Needed"
        subtitle="How to send AI-drafted messages to leads directly from the CRM using wa.me links."
      >
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/80">
          <div className="grid gap-0 divide-y divide-border/40 md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="p-8 space-y-5">
              <p className="font-semibold text-foreground">Step-by-step</p>
              {[
                { n: 1, title: "Open a lead", body: "Go to Leads → click any lead name to open the detail page." },
                { n: 2, title: "Scroll to AI Follow-Up Composer", body: "The WhatsApp draft generates automatically when the page loads. No button click needed." },
                { n: 3, title: "Read and edit the draft", body: "The textarea is editable. Adjust the name, project, price, or tone as needed." },
                { n: 4, title: "Click 'Send on WhatsApp'", body: "WhatsApp Web opens in a new tab with the lead's number pre-filled and the message loaded in the chat box." },
                { n: 5, title: "Press Send in WhatsApp", body: "The broker reviews once more and hits Send. The CRM immediately logs a whatsapp_sent activity and marks last_contact_at." },
              ].map((s) => <StepRow key={s.n} {...s} />)}
            </div>
            <div className="p-8 space-y-4">
              <p className="font-semibold text-foreground">Why this works without Meta API</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                WhatsApp&apos;s standard <code className="rounded bg-muted px-1 py-0.5 text-xs">wa.me/[phone]?text=[message]</code> deep-link opens WhatsApp Web or the desktop app with the number and text pre-populated. No developer accounts, no template approvals, no API registration.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  "Works with any personal or business WhatsApp number",
                  "No Meta Business Manager required",
                  "No message template approvals",
                  "Broker reviews before every send — human in the loop",
                  "Every send is logged in the Activity Timeline",
                  "Lead is marked contacted automatically",
                  "Draft can be regenerated with one click",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════════ */}
      {/* 10 LEAD WORKFLOW */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="lead-workflow"
        label="Section 10"
        title="Lead Lifecycle — End to End"
        subtitle="How a lead moves through the system from capture to close."
      >
        <div className="relative mx-auto max-w-2xl">
          {[
            { icon: Target, n: "01", title: "Lead arrives", body: "A prospect submits the form on a landing page (/lp/[slug]) or the website. The CRM captures: name, phone, email, budget_aed, message, source, project_slug, landing_slug, UTM parameters (utm_source, utm_medium, utm_campaign), device type, and HTTP referrer. All stored in gc_leads." },
            { icon: UserCheck, n: "02", title: "Admin assigns the lead", body: "In the Leads tab, an admin or sales manager assigns the lead to a broker. The broker can now see the lead in their filtered view. Unassigned leads appear in the Overview KPI and AI hot-leads scoring." },
            { icon: Sparkles, n: "03", title: "AI drafts the first message", body: "The broker opens the lead page. The AI Follow-Up Composer auto-generates a personalised WhatsApp message, email draft, and 3–5 next-step recommendations. The draft uses the lead's name, project interest, and budget." },
            { icon: Send, n: "04", title: "Broker sends on WhatsApp", body: "Broker edits the draft if needed → clicks 'Send on WhatsApp' → WhatsApp Web opens with message pre-filled → broker presses Send. The CRM logs a whatsapp_sent activity and updates last_contact_at." },
            { icon: Edit2, n: "05", title: "Log every interaction", body: "After each call or meeting, add a note via the 'Add Update' card. Change the status as the deal progresses: new → contacted → qualified → viewing → offer → converted (or lost)." },
            { icon: PhoneCall, n: "06", title: "Follow up on schedule", body: "Ask the AI Assistant: 'Which of my leads haven't been contacted in 3 days?' to get a list. Use that to plan your daily call list." },
            { icon: TrendingUp, n: "07", title: "Convert or recycle", body: "Converted: mark as 'converted' — the deal is won. Lost: mark as 'lost' but NEVER delete. Lost leads often convert 6–12 months later when the market or their budget changes." },
          ].map((step, idx, arr) => {
            const Icon = step.icon
            const isLast = idx === arr.length - 1
            return (
              <div key={step.n} className="relative flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-primary/40 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {!isLast && <div className="mt-1 w-px flex-1 bg-gradient-to-b from-primary/30 to-primary/5 min-h-[2rem]" />}
                </div>
                <div className={`flex-1 pb-10 ${isLast ? "pb-0" : ""}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/50">Step {step.n}</p>
                  <p className="mt-1 font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* ══════════════════════════════════════════ */}
      {/* 11 ROLES */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="roles-access"
        label="Section 11"
        title="Roles & Access Levels"
        subtitle="What each role can see and do. Roles are set in the Profile page by admin/manager."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: Crown, role: "CEO", color: "text-[#C9A961]", bg: "bg-[#C9A961]/10 border-[#C9A961]/25",
              can: [
                "Full read/write on all modules",
                "View all brokers' leads and pipeline",
                "Access all admin sections on Overview",
                "View and edit any user profile via ?email=",
                "Delete user accounts",
                "Change any user's role",
                "Access AI Training and AI Project Update panels",
              ],
              cannot: [],
            },
            {
              icon: Shield, role: "Admin", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/25",
              can: [
                "Assign and reassign leads to any broker",
                "Create and edit projects and landing pages",
                "View all team leads and analytics",
                "Access admin control panel (grant/revoke AI access)",
                "View and switch between any broker profile",
              ],
              cannot: ["Cannot delete user accounts (CEO only)"],
            },
            {
              icon: Briefcase, role: "Sales Manager", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/25",
              can: [
                "View all leads for their team",
                "Re-assign leads within their team",
                "See analytics for their brokers",
                "View broker profiles via ?email=",
              ],
              cannot: ["Cannot create/edit inventory or landing pages", "Cannot access admin control panel"],
            },
            {
              icon: UserCheck, role: "Broker", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/25",
              can: [
                "View only their own assigned leads",
                "Update lead status and add notes",
                "Use AI Assistant fully",
                "Send WhatsApp and email via AI Composer",
                "View their own performance on Profile",
              ],
              cannot: ["Cannot see other brokers' leads", "Cannot create landing pages", "Cannot assign leads"],
            },
          ].map(({ icon: Icon, role, color, bg, can, cannot }) => (
            <div key={role} className={`rounded-2xl border p-6 space-y-4 ${bg}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <p className={`font-serif text-xl font-bold ${color}`}>{role}</p>
              </div>
              <div className="space-y-1">
                {can.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    {item}
                  </div>
                ))}
                {cannot.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════════ */}
      {/* 12 DATA FLOW */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="data-flow"
        label="Section 12"
        title="Data Flow — How the System Connects"
        subtitle="Understanding where data comes from, where it goes, and how it's used."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: Globe,
              title: "Lead sources",
              items: [
                "Landing pages (/lp/[slug]) — form submission → gc_leads with landing_slug tag",
                "Website chat (/chat) — lead capture after AI conversation",
                "Website contact forms — direct POST to /api/leads",
                "Manual entry — broker adds lead via the AI Assistant ('Create a lead for Ahmed...')",
              ],
            },
            {
              icon: FolderKanban,
              title: "Inventory sources",
              items: [
                "Entrestate database sync — 3,500+ projects imported from the market intelligence feed",
                "Manual add — broker or admin creates via Add Project form",
                "AI update — admin submits an AI Project Update, which patches the database record",
              ],
            },
            {
              icon: RefreshCw,
              title: "AI context sources",
              items: [
                "BROKER_SYSTEM_PROMPT — hardcoded CRM knowledge (this playbook content)",
                "data.md — public market knowledge file loaded at server start",
                "Live DB queries — leads, projects, areas fetched per request",
                "Pinned conversations — learning signals stored in gc_ai_conversations",
              ],
            },
            {
              icon: Eye,
              title: "Tracking & attribution",
              items: [
                "Landing page views — tracked via middleware, stored per slug",
                "Lead source — utm_source or HTTP referrer captured on form submit",
                "WhatsApp sends — logged in gc_lead_activity as whatsapp_sent",
                "Broker activity — all lead updates logged with broker ID and timestamp",
              ],
            },
          ].map(({ icon: Icon, title, items }) => (
            <div key={title} className="rounded-2xl border border-border/60 bg-card/80 p-5 space-y-3">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" /> {title}
              </p>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <ArrowRight className="h-3 w-3 mt-0.5 shrink-0 text-primary/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════════ */}
      {/* 13 FAQ */}
      {/* ══════════════════════════════════════════ */}
      <Section
        id="faq"
        label="Section 13"
        title="Frequently Asked Questions"
      >
        <div className="space-y-3">
          {[
            {
              q: "How do I add a new team member?",
              a: "Go to Profile → Team Accounts panel → their account needs to be created by an admin. Currently accounts are created by adding a row to gc_users via the Admin Control Panel or directly via the database. Ask your system admin.",
            },
            {
              q: "Can I reassign a lead from myself to another broker?",
              a: "Only admins and sales managers can reassign leads. If you're a broker and need a lead reassigned, ask your manager or message them in the AI Assistant: 'Reassign lead [name] to [broker email]'.",
            },
            {
              q: "How does the AI know about my leads?",
              a: "Every broker chat request queries the database live for your leads. The AI doesn't cache leads — it fetches fresh data for every question so the answer is always current.",
            },
            {
              q: "Can two brokers see the same lead?",
              a: "No. Leads are assigned exclusively. A broker only sees leads with assigned_broker_id matching their user ID. Admins and managers can see all leads.",
            },
            {
              q: "What happens if I accidentally mark a lead as 'lost'?",
              a: "Change it back. Open the lead → Add Update card → change status to the correct stage. All status changes are logged in the Activity Timeline with a timestamp.",
            },
            {
              q: "The AI draft doesn't sound right. What do I do?",
              a: "Edit the draft directly in the textarea — it's fully editable. Or click 'Regenerate' to get a fresh draft. If the project data is wrong, update the project in Inventory first, then regenerate.",
            },
            {
              q: "Can I use the CRM on mobile?",
              a: "Yes. The CRM is fully responsive. The chat input uses a 44px touch target and prevents double-tap zoom. WhatsApp send opens the WhatsApp mobile app directly if installed.",
            },
            {
              q: "How long does a login session last?",
              a: "Sessions expire after 7 days of inactivity. You'll be redirected to /crm/login. Your data is never deleted — just log back in.",
            },
            {
              q: "Can I export my leads?",
              a: "Yes. In the AI Assistant, ask 'Show me all my leads' or any filtered query, then click 'Export latest results to CSV' in the Export & Share panel.",
            },
            {
              q: "How do I know if a landing page is live?",
              a: "In Landing Pages, the status badge shows green (published/active/live) or amber (draft). Also check the publishFrom → publishTo window — the page is only public within that date range.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="rounded-2xl border border-border/60 bg-card/80 px-6 py-5 space-y-2">
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <p className="font-semibold text-sm text-foreground">{q}</p>
              </div>
              <p className="pl-7 text-sm text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Footer CTA ── */}
      <section className="rounded-[2rem] border border-primary/20 bg-primary/5 px-8 py-10 text-center space-y-4">
        <p className="font-serif text-2xl font-bold text-foreground">Ready? Start with the AI.</p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Type <em>&ldquo;show me my hottest leads today&rdquo;</em> and let the system tell you where to focus first.
        </p>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <a href="/crm/ai-assistant" className="inline-flex items-center gap-2 rounded-xl gold-gradient px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-opacity hover:opacity-90">
            <Bot className="h-4 w-4" /> Open AI Assistant
          </a>
          <a href="/crm/leads" className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            <Users className="h-4 w-4" /> View Leads
          </a>
          <a href="/crm/overview" className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
            <LayoutDashboard className="h-4 w-4" /> Go to Overview
          </a>
        </div>
      </section>

    </div>
  )
}
