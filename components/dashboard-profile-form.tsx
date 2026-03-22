"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface ProfileFormProps {
  initialProfile?: {
    id?: string
    name?: string
    email?: string
    role?: string
  } | null
}

const roles = ["CEO", "Sales Manager", "Broker", "Admin"]

export function DashboardProfileForm({ initialProfile }: ProfileFormProps) {
  const [form, setForm] = useState({
    id: initialProfile?.id || "",
    name: initialProfile?.name || "",
    email: initialProfile?.email || "",
    role: initialProfile?.role || "Broker",
  })
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [message, setMessage] = useState<string>("")

  const handleChange = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus("saving")
    setMessage("")
    try {
      const response = await fetch("/api/dashboard/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Failed to save profile")
      }
      setForm({
        id: data.profile.id,
        name: data.profile.name,
        email: data.profile.email,
        role: data.profile.role,
      })
      setStatus("saved")
      setMessage("Profile saved.")
    } catch (error: any) {
      setStatus("error")
      setMessage(error?.message || "Failed to save profile.")
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Full Name" value={form.name} onChange={handleChange("name")} required />
            <Input placeholder="Email" type="email" value={form.email} onChange={handleChange("email")} required />
            <select
              value={form.role}
              onChange={handleChange("role")}
              className="h-10 rounded-md border border-border bg-background px-3 text-sm"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <Input placeholder="User ID" value={form.id} onChange={handleChange("id")} />
          </div>
          <Button type="submit" className="gold-gradient" disabled={status === "saving"}>
            {status === "saving" ? "Saving..." : "Save Profile"}
          </Button>
          {message && (
            <div className={`text-xs ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}>
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
