"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function RoiCalculatorPage() {
  const [price, setPrice] = useState(1500000)
  const [annualRent, setAnnualRent] = useState(120000)
  const [annualCosts, setAnnualCosts] = useState(15000)

  const grossYield = price > 0 ? (annualRent / price) * 100 : 0
  const netYield = price > 0 ? ((annualRent - annualCosts) / price) * 100 : 0
  const monthlyCashflow = (annualRent - annualCosts) / 12

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-background to-muted py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <Badge className="mb-4 gold-gradient" variant="secondary">
                ROI Calculator
              </Badge>
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">
                Estimate Rental ROI
              </h1>
              <p className="mt-4 text-muted-foreground">
                Calculate gross and net rental yield for your Dubai investment.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label htmlFor="price">Property Price (AED)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="annualRent">Annual Rent (AED)</Label>
                  <Input
                    id="annualRent"
                    type="number"
                    value={annualRent}
                    onChange={(e) => setAnnualRent(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="annualCosts">Annual Costs (AED)</Label>
                  <Input
                    id="annualCosts"
                    type="number"
                    value={annualCosts}
                    onChange={(e) => setAnnualCosts(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <Button className="gold-gradient w-full">Update Results</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground">Gross Yield</div>
                  <div className="text-3xl font-bold gold-text-gradient">{grossYield.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Net Yield</div>
                  <div className="text-3xl font-bold gold-text-gradient">{netYield.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Monthly Cash Flow</div>
                  <div className="text-3xl font-bold gold-text-gradient">
                    AED {monthlyCashflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use this as a quick benchmark before requesting a full investment analysis from our team.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/contact">Request Full Analysis</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
