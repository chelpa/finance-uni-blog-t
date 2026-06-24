import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { StatsCards } from '@/components/stats-cards'
import { RealtimeTaskList } from '@/components/realtime-task-list'
import { TaskForm } from '@/components/task-form'
import { Button } from '@/components/ui/button'
import { getTasks, getProjects, getBlogPosts, getCurrentUser } from '@/lib/actions'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    // redirect('/auth/login')
    redirect('/landing')
  }

  const [tasks, projects, blogPosts] = await Promise.all([
    getTasks(),
    getProjects(),
    getBlogPosts(),
  ])

  const recentTasks = tasks.slice(0, 5)
  const recentPosts = blogPosts.slice(0, 3)

  return (
    <DashboardLayout projects={projects} user={user}>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s an overview of your tasks and latest updates.
            </p>
          </div>
          <TaskForm projects={projects} />
        </div>

        <StatsCards tasks={tasks} />

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Tasks</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/tasks" className="gap-1">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
              <RealtimeTaskList initialTasks={recentTasks} userId={user.id} />
            </Suspense>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Finance Club Blog</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/blog" className="gap-1">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <article key={post.id} className="flex gap-4 p-4 rounded-lg border bg-card">
                  <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                    <span className="text-2xl font-bold text-primary/30">
                      {post.title.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-medium hover:text-primary hover:underline line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      By {post.author}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
