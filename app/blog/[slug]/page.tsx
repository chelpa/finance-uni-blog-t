import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getProjects, getBlogPost, getCurrentUser } from '@/lib/actions'
import type { BlogCategory } from '@/lib/types'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

const categoryConfig: Record<BlogCategory, { label: string; className: string }> = {
  general: { label: 'General', className: 'bg-secondary text-secondary-foreground' },
  markets: { label: 'Markets', className: 'bg-blue-100 text-blue-800' },
  investing: { label: 'Investing', className: 'bg-emerald-100 text-emerald-800' },
  events: { label: 'Events', className: 'bg-amber-100 text-amber-800' },
  tips: { label: 'Tips', className: 'bg-pink-100 text-pink-800' },
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  })
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  
  try {
    const post = await getBlogPost(slug)
    return {
      title: `${post.title} - Finance Club Blog`,
      description: post.excerpt || post.content.substring(0, 160),
    }
  } catch {
    return {
      title: 'Post Not Found - Finance Club Blog',
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const user = await getCurrentUser()
  const projects = await getProjects()
  
  let post
  try {
    post = await getBlogPost(slug)
  } catch {
    notFound()
  }

  const category = categoryConfig[post.category]

  return (
    <DashboardLayout projects={projects} user={user}>
      <article className="p-4 lg:p-6">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/blog" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <header className="space-y-4 mb-8">
            <Badge variant="secondary" className={category.className}>
              <Tag className="h-3 w-3 mr-1" />
              {category.label}
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at)}
              </span>
            </div>
          </header>

          <div className="relative h-64 sm:h-80 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-8">
            <span className="text-8xl font-bold text-primary/20">
              {post.title.charAt(0)}
            </span>
          </div>

          <div className="prose prose-lg max-w-none">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <footer className="mt-12 pt-8 border-t">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {post.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-muted-foreground">Finance Club Member</p>
              </div>
            </div>
          </footer>
        </div>
      </article>
    </DashboardLayout>
  )
}
