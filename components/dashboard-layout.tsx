import { Suspense } from 'react'
import { TopBar } from '@/components/top-bar'
import { Sidebar } from '@/components/sidebar'
import type { Project } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

interface DashboardLayoutProps {
  children: React.ReactNode
  projects: Project[]
  user: User | null
}

export function DashboardLayout({ children, projects, user }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar projects={projects} user={user} />
      <div className="flex flex-1">
        <div className="hidden w-64 shrink-0 lg:block">
          <Suspense fallback={<div className="h-full border-r bg-sidebar" />}>
            <Sidebar projects={projects} />
          </Suspense>
        </div>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
