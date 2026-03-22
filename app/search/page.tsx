import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Calendar, Filter } from "lucide-react"

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-10">
        <div className="mb-8">
          <Badge className="mb-4 gold-gradient">Search Interface</Badge>
          <h1 className="font-serif text-4xl font-bold tracking-tight">Time Table Builder</h1>
          <p className="mt-2 text-muted-foreground">
            Search across 3500+ projects and build your custom investment timeline.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Results Preview
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <div className="h-9 w-full bg-muted rounded pl-8 flex items-center text-xs text-muted-foreground">
                  Quick search...
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Launch</TableHead>
                    <TableHead>Handover</TableHead>
                    <TableHead className="text-right">Price (AED)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium bg-muted/20 animate-pulse h-6 w-32 rounded m-1" />
                      <TableCell className="bg-muted/20 animate-pulse h-6 w-24 rounded m-1" />
                      <TableCell className="bg-muted/20 animate-pulse h-6 w-20 rounded m-1" />
                      <TableCell className="bg-muted/20 animate-pulse h-6 w-20 rounded m-1" />
                      <TableCell className="text-right bg-muted/20 animate-pulse h-6 w-24 rounded m-1" />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
