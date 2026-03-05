import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SectionShell } from "@/components/lp/section-shell"

interface FaqSectionProps {
  data: Record<string, unknown>
}

export function FaqSection({ data }: FaqSectionProps) {
  const title = (typeof data.title === "string" && data.title) || "Frequently Asked Questions"
  const subtitle =
    (typeof data.subtitle === "string" && data.subtitle) || "Campaign-ready answers for common objections."

  const items = Array.isArray(data.items)
    ? data.items
        .map((item) => (item && typeof item === "object" ? (item as Record<string, unknown>) : null))
        .filter(Boolean)
        .map((item) => ({
          question: typeof item?.question === "string" ? item.question : "",
          answer: typeof item?.answer === "string" ? item.answer : "",
        }))
        .filter((item) => item.question && item.answer)
    : []

  return (
    <SectionShell id="faq" title={title} subtitle={subtitle}>
      <Accordion type="single" collapsible className="rounded-2xl border bg-card px-5">
        {items.map((item, index) => (
          <AccordionItem key={`${item.question}-${index}`} value={`faq-${index}`}>
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionShell>
  )
}
