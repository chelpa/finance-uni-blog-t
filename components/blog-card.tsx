import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { BlogPost, BlogCategory } from '@/lib/types'

interface BlogCardProps {
  post: BlogPost
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

export function BlogCard({ post }: BlogCardProps) {
  const category = categoryConfig[post.category]

  return (
    <article className="group flex flex-col rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
        <div className="text-6xl font-bold text-primary/20">
          {post.title.charAt(0)}
        </div>
      </div>
      
      <div className="flex-1 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={category.className}>
            {category.label}
          </Badge>
        </div>
        
        <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors text-balance">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.published_at)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-5 pb-5">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Read more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}
