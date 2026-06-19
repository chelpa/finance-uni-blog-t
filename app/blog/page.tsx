import { Suspense } from 'react'
import Link from 'next/link'
import { PenSquare } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { BlogCard } from '@/components/blog-card'
import { Button } from '@/components/ui/button'
import { getProjects, getBlogPosts, getCurrentUser } from '@/lib/actions'

export const metadata = {
  title: 'Finance Club Blog - TaskFlow',
  description: 'Stay updated with the latest finance news, investment tips, and club events.',
}

export default async function BlogPage() {
  const user = await getCurrentUser()
  
  const [projects, posts] = await Promise.all([
    getProjects(),
    getBlogPosts(),
  ])

  return (
    <DashboardLayout projects={projects} user={user}>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight">Finance Club Blog</h1>
            <p className="text-lg text-muted-foreground mt-2 text-pretty">
              Stay updated with the latest finance news, investment tips, market analysis, and upcoming club events from the University Finance Club.
            </p>
          </div>
          <Button asChild className="shrink-0">
            <Link href="/blog/new" className="gap-2">
              <PenSquare className="h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>

        <Suspense 
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 animate-pulse bg-muted rounded-xl" />
              ))}
            </div>
          }
        >
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">No blog posts yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Check back soon for new content from the Finance Club.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
