"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AISearchBarProps {
  placeholder?: string
  showSuggestions?: boolean
}

export function AISearchBar({ 
  placeholder = "Ask me anything about Dubai real estate... e.g., '2BR apartment in Marina with sea view under 2M'",
  showSuggestions = true 
}: AISearchBarProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query)}`)
    } else {
      router.push('/chat')
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    router.push(`/chat?q=${encodeURIComponent(suggestion)}`)
  }

  const suggestions = [
    "Best ROI projects in 2026",
    "Golden Visa eligible properties",
    "Off-plan projects in Downtown Dubai",
    "2BR apartments under AED 2M",
    "Beachfront properties in Dubai Marina"
  ]

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all ${isFocused ? 'ring-2 ring-primary/20' : ''} rounded-full`}>
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="w-full rounded-full border border-border bg-card px-12 py-4 text-sm shadow-sm transition-all focus:border-primary focus:outline-none placeholder:text-muted-foreground/60"
          />
          <Button 
            type="submit"
            size="sm" 
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full gold-gradient gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </form>

      {showSuggestions && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-muted-foreground">Try:</span>
          {suggestions.slice(0, 3).map((suggestion) => (
            <Button 
              key={suggestion}
              variant="outline" 
              size="sm" 
              className="h-7 rounded-full text-xs"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
