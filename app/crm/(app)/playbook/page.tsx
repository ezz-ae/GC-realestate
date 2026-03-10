import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  Users,
  Rocket,
  BarChart3,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

const MODULES = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: "/crm/overview",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    desc: "Your daily command centre. See today's leads, revenue pipeline, top ROI projects, and AI-generated market pulse — all in one glance.",
    tips: ["Check this first every morning", "Pipeline value updates in real time"],
  },
  {
    icon: Bot,
    label: "AI Assistant",
    href: "/crm/ai-assistant",
    color: "text-[#C9A961]",
    bg: "bg-[#C9A961]/10 border-[#C9A961]/20",
    desc: "Your AI sales co-pilot. Ask about leads, draft WhatsApp messages, find 8%+ ROI projects, or get a ranked hot-leads list with scoring reasons.",
    tips: ["Type naturally — it understands intent", "Use quick-action chips to start fast"],
  },
  {
    icon: FolderKanban,
    label: "Inventory",
    href: "/crm/inventory",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
    desc: "Browse and search 3,500+ Dubai projects pulled live from the Entrestate database. Filter by area, ROI, handover date, developer, or price.",
    tips: ["Sort by ROI to find investment pitches", "Each project links to its landing page"],
  },
  {
    icon: PlusCircle,
    label: "Add Project",
    href: "/crm/projects/add",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    desc: "Add off-market or exclusive listings manually. The AI auto-fills area context, developer profile, and investment narrative from what you enter.",
    tips: ["Slug auto-generates from the project name", "AI enrichment runs on save"],
  },
  {
    icon: Rocket,
    label: "Landing Pages",
    href: "/crm/landing-pages",
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
    desc: "Generate branded advertising pages for any project in seconds. Share the link in WhatsApp, Instagram bio, or email — leads fill the form directly.",
    tips: ["One URL per project, fully shareable", "Lead submissions land in the Leads tab instantly"],
  },
  {
    icon: Users,
    label: "Leads",
    href: "/crm/leads",
    color: "text-rose-400",
    bg: "bg-rose-400/10 border-rose-400/20",
    desc: "Full lead pipeline with status, priority, budget, source, and contact history. Open any lead to draft and send WhatsApp messages with one click.",
    tips: ["Filter by status to work your pipeline", "AI auto-drafts follow-ups on each lead page"],
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "/crm/analytics",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10 border-cyan-400/20",
    desc: "Lead conversion rates, source attribution, broker performance, and pipeline velocity. Use this weekly to identify what's working.",
    tips: ["Compare lead source quality", "Track which landing pages convert best"],
  },
]

const LEAD_STEPS = [
  {
    n: "01",
    title: "Lead arrives",
    body: "A prospect fills the form on a landing page or the website. The CRM captures name, phone, email, budget, project interest, UTM source, and device — automatically.",
    icon: Target,
  },
  {
    n: "02",
    title: "Broker is assigned",
    body: "An admin or sales manager assigns the lead from the Leads tab. The broker immediately sees it in their filtered view.",
    icon: UserCheck,
  },
  {
    n: "03",
    title: "AI drafts the first message",
    body: "Open the lead. The AI Follow-Up Composer auto-generates a personalised WhatsApp message, email draft, and next-step recommendations based on the lead's project interest and budget.",
    icon: Sparkles,
  },
  {
    n: "04",
    title: "Send on WhatsApp",
    body: "Edit the draft if needed, then hit \"Send on WhatsApp\". WhatsApp Web opens with the message pre-filled — broker just presses Send. The CRM logs the outreach automatically.",
    icon: Send,
  },
  {
    n: "05",
    title: "Update & log",
    body: "Add a note after every call or meeting via the \"Add Update\" card. Change status (new → contacted → qualified → converted) as the deal progresses.",
    icon: CheckCircle2,
  },
  {
    n: "06",
    title: "Convert or recycle",
    body: "Converted leads move to a won state. Unqualified leads stay in the pipeline for future campaigns — never delete, always recycle.",
    icon: TrendingUp,
  },
]

const AI_ACTIONS = [
  { prompt: "Show me my hottest leads today", what: "Scores all your leads by recency, budget, and contact data — returns top 8 with a reason for each." },
  { prompt: "List projects with 8% or more ROI", what: "Queries live inventory and returns matching projects with area, price, and ROI." },
  { prompt: "Draft a WhatsApp follow-up for [lead name]", what: "Pulls lead and project data, writes a personalised ready-to-send message." },
  { prompt: "Show me all unassigned leads from the last 7 days", what: "Filters the pipeline so managers can redistribute quickly." },
  { prompt: "What projects are available in Business Bay under AED 1.5M?", what: "Live inventory search with budget and area filters applied." },
  { prompt: "Create a project listing for [project name]", what: "Starts an AI-assisted project creation with auto-filled fields." },
]

const ROLES = [
  {
    icon: Crown,
    role: "CEO",
    color: "text-[#C9A961]",
    bg: "bg-[#C9A961]/10 border-[#C9A961]/25",
    access: ["Full read/write across all modules", "View all brokers' leads and performance", "Analytics and pipeline reports", "User and role management"],
  },
  {
    icon: Shield,
    role: "Admin",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/25",
    access: ["Assign and reassign leads", "Create and edit projects", "Manage landing pages", "View all team activity"],
  },
  {
    icon: Briefcase,
    role: "Sales Manager",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/25",
    access: ["View all team leads", "Re-assign within their team", "Analytics for their brokers", "Cannot edit inventory"],
  },
  {
    icon: UserCheck,
    role: "Broker",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/25",
    access: ["View only their assigned leads", "Update lead status and notes", "Use AI assistant fully", "Cannot see other brokers' leads"],
  },
]

const TIPS = [
  { icon: Clock, tip: "Start each day on the Overview page — the AI Pulse gives you the market read before your first call." },
  { icon: Zap, tip: "Use the AI Assistant quick chips in the morning to get your hot leads ranked without typing anything." },
  { icon: MessageSquare, tip: "Always draft your WhatsApp message in the lead page — it logs the outreach automatically." },
  { icon: Rocket, tip: "Share landing page links in WhatsApp broadcasts instead of sending PDFs — they load fast and capture data." },
  { icon: Star, tip: "Never close a lead as lost without adding a note. Lost leads often convert 6–12 months later." },
  { icon: AlertCircle, tip: "If a lead has no phone number, use the email draft and log the send as a note." },
]

// ─────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────

function Section({ id, label, title, children }: { id: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">{label}</p>
        <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
      </div>
      {children}
    </section>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function PlaybookPage() {
  return (
    <div className="space-y-20">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-[2rem] border border-[#C9A961]/25 bg-[radial-gradient(ellipse_at_top_left,rgba(201,169,97,0.18),transparent_55%),linear-gradient(135deg,#0f172a,#111827)] p-10 text-white md:p-14">
        <div className="absolute right-8 top-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C9A961]/30 bg-[#C9A961]/10">
          <BookOpen className="h-7 w-7 text-[#C9A961]" />
        </div>
        <Badge className="mb-6 border-[#C9A961]/40 bg-[#C9A961]/15 text-[#C9A961] text-[10px] uppercase tracking-[0.2em]">
          Gold Century CRM · Playbook
        </Badge>
        <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
          Your complete guide<br />to the CRM.
        </h1>
        <p className="mt-4 max-w-xl text-base text-white/60 leading-relaxed">
          Everything your team needs to manage leads, use AI, run campaigns, and close deals — from first login to first conversion.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/50">
          {["Overview", "Lead Workflow", "AI Assistant", "WhatsApp Flow", "Roles", "Pro Tips"].map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 transition-colors hover:border-[#C9A961]/40 hover:text-[#C9A961]"
            >
              {s}
            </a>
          ))}
        </div>
      </section>

      {/* ── Modules ── */}
      <Section id="overview" label="Section 01" title="What each module does">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MODULES.map(({ icon: Icon, label, href, color, bg, desc, tips }) => (
            <div
              key={label}
              className="group relative flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/80 p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="font-semibold text-foreground">{label}</p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
              <ul className="space-y-1 border-t border-border/40 pt-3">
                {tips.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-primary/60" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Lead Workflow ── */}
      <Section id="lead-workflow" label="Section 02" title="Lead lifecycle — step by step">
        <div className="relative mx-auto max-w-2xl">
          {LEAD_STEPS.map((step, idx) => {
            const Icon = step.icon
            const isLast = idx === LEAD_STEPS.length - 1
            return (
              <div key={step.n} className="relative flex gap-6">
                {/* Stem */}
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-primary/40 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {!isLast && <div className="mt-1 w-px flex-1 bg-gradient-to-b from-primary/30 to-primary/5 min-h-[2rem]" />}
                </div>
                {/* Content */}
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

      {/* ── AI Assistant ── */}
      <Section id="ai-assistant" label="Section 03" title="What you can ask the AI">
        <p className="text-sm text-muted-foreground max-w-xl">
          The AI Assistant understands natural language. You don&apos;t need to memorise commands — just describe what you need. Here are the most valuable things to ask:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {AI_ACTIONS.map(({ prompt, what }) => (
            <div
              key={prompt}
              className="rounded-2xl border border-border/60 bg-card/80 p-5 space-y-2 transition-all hover:border-primary/30"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A961]" />
                <p className="text-sm font-semibold text-foreground">&ldquo;{prompt}&rdquo;</p>
              </div>
              <p className="pl-7 text-xs text-muted-foreground leading-relaxed">{what}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-[#C9A961]/20 bg-[#C9A961]/5 px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#C9A961] mb-2">Pro tip</p>
          <p className="text-sm text-muted-foreground">
            The AI remembers the context of your conversation. If it shows you a project, you can follow up with &ldquo;draft a WhatsApp for the lead who asked about this&rdquo; — it connects the dots.
          </p>
        </div>
      </Section>

      {/* ── WhatsApp Flow ── */}
      <Section id="whatsapp-flow" label="Section 04" title="WhatsApp send flow — no API needed">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/80">
          <div className="border-b border-border/60 px-8 py-5 flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-[#C9A961]" />
            <p className="font-semibold text-foreground">How to send a WhatsApp message from any lead</p>
          </div>
          <div className="grid gap-0 divide-y divide-border/40 md:grid-cols-2 md:divide-x md:divide-y-0">
            {/* Steps */}
            <div className="p-8 space-y-5">
              {[
                { n: 1, icon: Users, text: "Open a lead from the Leads tab." },
                { n: 2, icon: Sparkles, text: "Scroll to the AI Follow-Up Composer — the draft generates automatically." },
                { n: 3, icon: MessageSquare, text: "Read the draft. Edit any detail — the name, project, price, or tone." },
                { n: 4, icon: Send, text: "Click \"Send on WhatsApp\" — WhatsApp Web opens with the message pre-filled in the lead's chat." },
                { n: 5, icon: CheckCircle2, text: "Press Send in WhatsApp. The CRM logs the outreach and marks the lead as contacted." },
              ].map(({ n, icon: Icon, text }) => (
                <div key={n} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                    {n}
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Why no API */}
            <div className="p-8 space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Why this works without Meta API</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The CRM uses WhatsApp&apos;s standard <code className="rounded bg-muted px-1 py-0.5 text-xs">wa.me</code> deep-link protocol. When you click &ldquo;Send on WhatsApp&rdquo;, the browser opens WhatsApp Web with the lead&apos;s number and the AI-drafted message pre-loaded.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The broker reviews and hits Send — keeping a human in the loop, which is both best practice and WhatsApp-compliant.
              </p>
              <div className="space-y-2 pt-2">
                {[
                  "No Meta Business Manager required",
                  "No message template approvals",
                  "Works with any WhatsApp number",
                  "Every send is logged in the activity timeline",
                  "Lead is automatically marked as last-contacted",
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

      {/* ── Roles ── */}
      <Section id="roles" label="Section 05" title="Roles & access levels">
        <div className="grid gap-4 sm:grid-cols-2">
          {ROLES.map(({ icon: Icon, role, color, bg, access }) => (
            <div key={role} className={`rounded-2xl border p-6 space-y-4 ${bg}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <p className={`font-serif text-xl font-bold ${color}`}>{role}</p>
              </div>
              <ul className="space-y-2">
                {access.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/30" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Pro Tips ── */}
      <Section id="pro-tips" label="Section 06" title="Pro tips from the field">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {TIPS.map(({ icon: Icon, tip }) => (
            <div
              key={tip}
              className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card/80 p-5 transition-all hover:border-primary/30"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Footer CTA ── */}
      <section className="rounded-[2rem] border border-primary/20 bg-primary/5 px-8 py-10 text-center space-y-4">
        <p className="font-serif text-2xl font-bold text-foreground">Ready to run your first day?</p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Start with the AI Assistant — type &ldquo;show me my hottest leads today&rdquo; and let the system surface where to focus.
        </p>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <a
            href="/crm/ai-assistant"
            className="inline-flex items-center gap-2 rounded-xl gold-gradient px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-opacity hover:opacity-90"
          >
            <Bot className="h-4 w-4" /> Open AI Assistant
          </a>
          <a
            href="/crm/leads"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Users className="h-4 w-4" /> View Leads
          </a>
        </div>
      </section>

    </div>
  )
}
