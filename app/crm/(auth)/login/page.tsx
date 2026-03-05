"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function DashboardLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Login failed.")
      }
      router.push("/crm/overview")
    } catch (err: any) {
      setError(err?.message || "Login failed.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <section className="rounded-2xl border border-border bg-gradient-to-b from-background to-muted/70 p-6">
        <Badge className="mb-3 gold-gradient" variant="secondary">
          Broker Dashboard
        </Badge>
        <h1 className="font-serif text-3xl font-bold">Sign in to the CRM</h1>
        <p className="text-sm text-muted-foreground">
          Use your Gold Century company email to access the sales portal.
        </p>
      </section>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange("password")}
              required
            />
            {error && <div className="text-xs text-destructive">{error}</div>}
            <Button type="submit" className="w-full gold-gradient" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 text-xs text-muted-foreground">
            Forgot your password?{" "}
            <Link href="/crm/reset" className="text-primary underline-offset-4 hover:underline">
              Reset it here
            </Link>
            .
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
