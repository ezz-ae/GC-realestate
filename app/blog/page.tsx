import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getBlogPosts } from "@/lib/entrestate"
import Image from "next/image"
import Link from "next/link"

export default async function BlogPage() {
  const posts = await getBlogPosts(100, 0)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-background to-muted py-16">
          <div className="container text-center">
            <Badge className="mb-4 gold-gradient" variant="secondary">
              Blog
            </Badge>
            <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Gold Century Insights
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Market updates, investment guides, and expert commentary on Dubai real estate.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="relative aspect-[4/3] bg-muted">
                    {post.hero_image && (
                      <Image src={post.hero_image} alt={post.title} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {post.category && (
                        <span className="rounded-full border border-border px-2 py-1 text-foreground">
                          {post.category}
                        </span>
                      )}
                      {post.published_at && (
                        <span>
                          {new Date(post.published_at).toLocaleDateString("en-AE", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                      {post.read_time && <span>{post.read_time} min read</span>}
                    </div>
                    <h2 className="mt-4 font-serif text-xl font-semibold">{post.title}</h2>
                    {post.excerpt && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="mt-6">
                      <Button variant="outline" asChild>
                        <Link href={`/blog/${post.slug}`}>Read Article</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
