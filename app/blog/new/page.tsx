import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { getProjects, getCurrentUser, createBlogPost } from '@/lib/actions'
import type { BlogCategory } from '@/lib/types'

export const metadata = {
  title: 'New Blog Post - TaskFlow',
}

const categories: { value: BlogCategory; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'markets', label: 'Markets' },
  { value: 'investing', label: 'Investing' },
  { value: 'events', label: 'Events' },
  { value: 'tips', label: 'Tips' },
]

export default async function NewBlogPostPage() {
  const user = await getCurrentUser()
  const projects = await getProjects()

  return (
    <DashboardLayout projects={projects} user={user}>
      <div className="p-4 lg:p-6">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/blog" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">New Blog Post</h1>
            <p className="text-muted-foreground mt-1">Write and publish a new post to the Finance Club blog.</p>
          </div>

          <form action={createBlogPost} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <input
                id="title"
                name="title"
                required
                placeholder="Post title"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="author" className="text-sm font-medium">Author</label>
              <input
                id="author"
                name="author"
                required
                placeholder="Your name"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select
                id="category"
                name="category"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="excerpt" className="text-sm font-medium">
                Excerpt <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                placeholder="A short summary shown on the blog listing..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="content" className="text-sm font-medium">Content</label>
              <textarea
                id="content"
                name="content"
                rows={12}
                required
                placeholder="Write your post content here. Separate paragraphs with a blank line."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="publish"
                name="published"
                value="true"
                className="h-4 w-4 rounded border"
              />
              <label htmlFor="publish" className="text-sm font-medium">
                Publish immediately
              </label>
              <span className="text-xs text-muted-foreground">(uncheck to save as draft)</span>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 sm:flex-none">
                Publish Post
              </Button>
              <Button variant="outline" asChild>
                <Link href="/blog">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
