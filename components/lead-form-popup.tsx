"use client"

import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { LeadForm } from "@/components/lead-form"
import { Sparkles } from "lucide-react"

interface LeadFormPopupProps {
  buttonLabel?: string
  buttonClassName?: string
  buttonSize?: "sm" | "md" | "lg" | "icon"
}

export function LeadFormPopup({
  buttonLabel = "Request a Consultation",
  buttonClassName,
  buttonSize = "lg",
}: LeadFormPopupProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className={cn("gold-gradient flex items-center justify-center", buttonClassName)}
          size={buttonSize}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {buttonLabel}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="w-[min(720px,92vw)] max-w-[720px] border-none p-0 shadow-2xl">
        <div className="relative rounded-3xl bg-card p-6">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Personalized market intelligence
            </p>
            <h2 className="font-serif text-2xl font-bold">Tell us what you need</h2>
            <p className="text-sm text-muted-foreground">
              A Gold Century consultant will reply within one business day with tailored Dubai insights.
            </p>
          </div>
          <LeadForm />
        </div>
      </SheetContent>
    </Sheet>
  )
}
