import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { RealtimeTaskList } from '@/components/realtime-task-list'
import { TaskForm } from '@/components/task-form'
import { getTasks, getProjects, getCurrentUser } from '@/lib/actions'

interface TasksPageProps {
  searchParams: Promise<{ project?: string }>
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const params = await searchParams
  const projectId = params.project
  
  const [tasks, projects] = await Promise.all([
    getTasks(projectId),
    getProjects(),
  ])

  const currentProject = projectId 
    ? projects.find(p => p.id === projectId) 
    : null

  return (
    <DashboardLayout projects={projects} user={user}>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {currentProject ? currentProject.name : 'All Tasks'}
            </h1>
            <p className="text-muted-foreground">
              {currentProject 
                ? currentProject.description || 'Manage tasks for this project'
                : 'View and manage all your tasks across projects'
              }
            </p>
          </div>
          <TaskForm projects={projects} />
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
          <RealtimeTaskList initialTasks={tasks} userId={user.id} />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
