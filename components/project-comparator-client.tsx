"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/types/project"

interface ProjectComparatorClientProps {
  projects: Project[]
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value)

const getPriceRange = (project?: Project) => {
  if (!project) return "-"
  const prices = project.units.flatMap((unit) => [unit.priceFrom, unit.priceTo])
  if (!prices.length) return "Pricing on request"
  return `${formatPrice(Math.min(...prices))} - ${formatPrice(Math.max(...prices))}`
}

export function ProjectComparatorClient({ projects }: ProjectComparatorClientProps) {
  const [leftId, setLeftId] = useState(projects[0]?.id || "")
  const [rightId, setRightId] = useState(projects[1]?.id || projects[0]?.id || "")
  const [loading, setLoading] = useState(false)

  const leftProject = useMemo(
    () => projects.find((project) => project.id === leftId),
    [leftId, projects],
  )
  const rightProject = useMemo(
    () => projects.find((project) => project.id === rightId),
    [rightId, projects],
  )

  const handleDownload = async () => {
    if (!leftProject || !rightProject) return
    setLoading(true)
    try {
      const response = await fetch("/api/pdf/comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: [leftProject.slug, rightProject.slug] }),
      })
      if (!response.ok) throw new Error("PDF download failed")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "project-comparison.pdf"
      link.click()
      window.URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <Badge className="mb-4 gold-gradient" variant="secondary">
          Project Comparator
        </Badge>
        <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">
          Compare Dubai Projects
        </h1>
        <p className="mt-4 text-muted-foreground">
          Select two projects to compare key investment metrics side by side.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-sm text-muted-foreground">Project A</div>
            <Select value={leftId} onValueChange={setLeftId}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-sm text-muted-foreground">Project B</div>
            <Select value={rightId} onValueChange={setRightId}>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 flex items-center justify-end">
        <Button className="gold-gradient" disabled={loading || !leftProject || !rightProject} onClick={handleDownload}>
          {loading ? "Preparing PDF..." : "Download Comparison PDF"}
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {[leftProject, rightProject].map((project, index) => (
          <Card key={project?.id || index}>
            <CardContent className="p-6 space-y-4">
              <div className="font-serif text-2xl font-bold">{project?.name || "Select a project"}</div>
              <div className="text-sm text-muted-foreground">{project?.tagline}</div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Area</span>
                  <span className="font-medium">{project?.location.area || "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price Range</span>
                  <span className="font-medium">{getPriceRange(project)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expected ROI</span>
                  <span className="font-medium">
                    {project ? `${project.investmentHighlights.expectedROI}%` : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rental Yield</span>
                  <span className="font-medium">
                    {project ? `${project.investmentHighlights.rentalYield}%` : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Down Payment</span>
                  <span className="font-medium">
                    {project ? `${project.paymentPlan.downPayment}%` : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Handover</span>
                  <span className="font-medium">{project?.timeline.handoverDate || "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
