"use client"

import { Button } from "@/components/ui/button"
import { Phone, MessageSquare } from "lucide-react"

export function PropertyContactBar() {
  return (
    <div className="sticky bottom-0 z-50 lg:hidden">
      <div className="grid grid-cols-2 gap-px border-t border-border bg-background">
        <Button
          size="lg"
          variant="ghost"
          className="rounded-none"
          asChild
        >
          <a href="tel:+971507505175">
            <Phone className="mr-2 h-4 w-4" />
            Call Now
          </a>
        </Button>
        <Button
          size="lg"
          className="rounded-none gold-gradient text-black"
          asChild
        >
          <a href="https://wa.me/971507505175" target="_blank" rel="noopener noreferrer">
            <MessageSquare className="mr-2 h-4 w-4" />
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  )
}
