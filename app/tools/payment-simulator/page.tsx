"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function PaymentSimulatorPage() {
  const [price, setPrice] = useState(1800000)
  const [downPayment, setDownPayment] = useState(20)
  const [duringConstruction, setDuringConstruction] = useState(50)
  const [onHandover, setOnHandover] = useState(30)
  const [postHandover, setPostHandover] = useState(0)

  const calcAmount = (percent: number) => (price * percent) / 100
  const totalPercent = downPayment + duringConstruction + onHandover + postHandover

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-background to-muted py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <Badge className="mb-4 gold-gradient" variant="secondary">
                Payment Simulator
              </Badge>
              <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">
                Model Off-Plan Payment Plans
              </h1>
              <p className="mt-4 text-muted-foreground">
                Adjust percentages to estimate installment amounts.
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="downPayment">Down Payment (%)</Label>
                    <Input
                      id="downPayment"
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duringConstruction">During Construction (%)</Label>
                    <Input
                      id="duringConstruction"
                      type="number"
                      value={duringConstruction}
                      onChange={(e) => setDuringConstruction(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="onHandover">On Handover (%)</Label>
                    <Input
                      id="onHandover"
                      type="number"
                      value={onHandover}
                      onChange={(e) => setOnHandover(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postHandover">Post Handover (%)</Label>
                    <Input
                      id="postHandover"
                      type="number"
                      value={postHandover}
                      onChange={(e) => setPostHandover(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>
                <Button className="gold-gradient w-full">Update Schedule</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Total Allocation</div>
                  <div className={`font-semibold ${totalPercent === 100 ? "text-green-600" : "text-red-500"}`}>
                    {totalPercent}%
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Down Payment</span>
                    <span className="font-medium">
                      AED {calcAmount(downPayment).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">During Construction</span>
                    <span className="font-medium">
                      AED {calcAmount(duringConstruction).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">On Handover</span>
                    <span className="font-medium">
                      AED {calcAmount(onHandover).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  {postHandover > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Post Handover</span>
                      <span className="font-medium">
                        AED {calcAmount(postHandover).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  Adjust the plan to match the developer schedule or request a tailored installment plan.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/contact">Request Custom Plan</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
