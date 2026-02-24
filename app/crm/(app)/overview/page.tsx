import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardAIWidget } from "@/components/dashboard-ai-widget"
import { AdminUserAccessPanel } from "@/components/admin-user-access-panel"
import { AiProjectUpdatePanel } from "@/components/ai-project-update-panel"
import { AiTrainingCard } from "@/components/ai-training-card"
import { getDashboardOverviewData, resolveAccessRole, getUserAccessList } from "@/lib/entrestate"
import { getAiProjectUpdates } from "@/lib/ai-project-updates"
import { getAiTrainingRequests } from "@/lib/ai-training"
import { getSessionUser } from "@/lib/auth"
import { listConversations } from "@/lib/ai-conversations"
import Link from "next/link"
import { SmallLeadForm } from "@/components/small-lead-form"
import {
  CalendarCheck,
  TrendingUp,
  Users,
  PhoneCall,
  CircleDollarSign,
  Flame,
  ArrowUpRight,
} from "lucide-react"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value)

export default async function DashboardOverview() {
  const user = await getSessionUser()
  const accessRole = resolveAccessRole(user?.role)
  const brokerId = accessRole === "broker" ? user?.id : undefined
  const data = await getDashboardOverviewData(accessRole, brokerId)
  const trainingRequests = accessRole === "admin" ? await getAiTrainingRequests(6) : []
  const projectUpdates = accessRole === "admin" ? await getAiProjectUpdates(6) : []
  const conversations = user ? await listConversations(user.id, 3) : []
  const userAccessList = accessRole === "admin" ? await getUserAccessList() : []
  const projectOptions = data.topProjects.map((project) => ({
    slug: project.slug,
    name: project.name,
    area: project.area,
  }))

  const dailyTasks = [
    data.hotLeads[0] ? `Follow up with ${data.hotLeads[0].name} (hot lead)` : null,
    data.kpis.unassignedLeads > 0
      ? `Assign ${data.kpis.unassignedLeads} unassigned leads`
      : null,
    data.topProjects[0] ? `Promote ${data.topProjects[0].name} this week` : null,
  ].filter(Boolean) as string[]

  const kpis = [
    {
      label: "Today's Leads",
      value: data.kpis.todaysLeads,
      icon: Users,
    },
    {
      label: "Assigned This Week",
      value: data.kpis.assignedThisWeek,
      icon: CalendarCheck,
    },
    {
      label: "Active Inquiries (30d)",
      value: data.kpis.activeInquiries,
      icon: PhoneCall,
    },
    {
      label: "Scheduled Viewings",
      value: data.kpis.scheduledViewings,
      icon: TrendingUp,
    },
    {
      label: "Revenue Pipeline",
      value: formatCurrency(data.kpis.pipelineValue),
      icon: CircleDollarSign,
    },
  ]

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-card to-muted/40 p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <Badge className="mb-2 gold-gradient border-none px-3" variant="secondary">
              Live Intelligence
            </Badge>
            <h1 className="font-serif text-4xl font-bold tracking-tight">Sales Executive Hub</h1>
            <p className="text-sm text-muted-foreground max-w-lg">
              {accessRole === "admin"
                ? "Oversee company-wide property inventory, lead acquisition metrics, and AI training models."
                : `Active Sales Pipeline for ${user?.name || "Broker"}. Tracking engagement and high-intent signals.`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-xl h-11 border-border/60 hover:bg-muted" asChild>
              <Link href="/crm/leads">View All Leads</Link>
            </Button>
            <Button className="gold-gradient rounded-xl h-11 px-6 font-bold shadow-lg shadow-primary/20" asChild>
              <Link href="/crm/ai-assistant">Launch AI Assistant</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className="rounded-2xl border-border/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
                      {kpi.label}
                    </div>
                    <div className="text-2xl font-bold tracking-tight text-foreground">
                      {kpi.value}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <DashboardAIWidget />

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-xl font-bold">Hot Leads Alert</CardTitle>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Priority engagement signals
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.hotLeads.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground bg-muted/20">
                  No priority leads detected.
                </div>
              ) : (
                data.hotLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3 hover:border-primary/30 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm">{lead.name}</div>
                      <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                        {lead.project_slug || "General Inquiry"} · {lead.phone}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-600">
                      <Flame className="h-3 w-3" />
                      Score {lead.score}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <p className="text-xs text-muted-foreground">
                Latest lead interactions captured in the CRM.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.recentLeads.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                  No recent leads yet.
                </div>
              ) : (
                data.recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {lead.source || "Website"} · {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {lead.project_slug || "No project"}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-xl font-bold">Suggested Tasks</CardTitle>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                AI-curated focus points
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {dailyTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground bg-muted/20">
                  All tasks completed.
                </div>
              ) : (
                dailyTasks.map((task) => (
                  <div key={task} className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm font-medium hover:border-primary/30 transition-colors">
                    {task}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent AI Conversations</CardTitle>
              <p className="text-xs text-muted-foreground">
                Last broker AI sessions.
              </p>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {conversations.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                  No AI conversations yet.
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div key={conversation.id} className="rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                    <div className="font-medium">{conversation.title || "AI Conversation"}</div>
                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(conversation.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request a Consultation</CardTitle>
              <p className="text-xs text-muted-foreground">
                Share your inquiry and our team will call you back within minutes.
              </p>
            </CardHeader>
            <CardContent>
              <SmallLeadForm
                className="space-y-2"
                title="Get a free consultation"
                caption="Drop your name & WhatsApp and the broker team will respond shortly."
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {accessRole === "admin" && (
        <>
          <section>
            <AiTrainingCard projects={data.topProjects} requests={trainingRequests} />
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Learning Conversations</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Track the AI conversations that teach Gemini about buyer intent and project updates.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {conversations.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    No learning conversations captured yet.
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="rounded-2xl border border-border/70 bg-background/60 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{conv.title || "AI conversation"}</div>
                          <div className="text-xs text-muted-foreground">
                            Updated {new Date(conv.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant={conv.pinned ? "secondary" : "outline"}>Learning</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{conv.summary || "AI session"}</p>
                    </div>
                  ))
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/crm/ai-assistant">Start a learning conversation</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admin Control Panel</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Grant or revoke AI control access for any team member.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <AdminUserAccessPanel users={userAccessList} />
              </CardContent>
            </Card>
          </section>

          <section>
            <AiProjectUpdatePanel projects={projectOptions} updates={projectUpdates} />
          </section>
        </>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-xl font-bold">Project Performance</CardTitle>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Market score leaderboard
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.topProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 hover:bg-muted/40 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-sm">{project.name}</div>
                    <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                      {project.area || "Dubai"} · Score {project.marketScore ?? "—"}/10
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-green-600">{project.expectedRoi ?? "—"}% ROI</div>
                    <div className="text-[9px] uppercase tracking-tighter text-muted-foreground">Target Yield</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-primary/20 shadow-sm bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-xl font-bold text-primary">Quick Actions</CardTitle>
              <p className="text-[10px] uppercase font-bold tracking-widest text-primary/60">Execution shortcuts</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between rounded-xl h-11 border-primary/10 bg-card hover:bg-muted font-semibold text-xs" asChild>
                <Link href="/crm/projects/add">
                  Add New Project
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between rounded-xl h-11 border-primary/10 bg-card hover:bg-muted font-semibold text-xs" asChild>
                <Link href="/crm/leads">
                  Assign Leads ({data.kpis.unassignedLeads})
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between rounded-xl h-11 border-primary/10 bg-card hover:bg-muted font-semibold text-xs" asChild>
                <Link href="/crm/analytics">
                  Performance Report
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </Link>
              </Button>
            </CardContent>
          </Card>
      </section>
    </div>
  )
}
