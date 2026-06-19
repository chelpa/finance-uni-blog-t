'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { FolderKanban, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProject } from '@/lib/actions'
import type { Project } from '@/lib/types'

interface SidebarProps {
  projects: Project[]
}

const projectColors = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
]

export function Sidebar({ projects }: SidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentProjectId = searchParams.get('project')
  
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#3b82f6')
  const [isPending, startTransition] = useTransition()

  const handleCreateProject = () => {
    if (!name.trim()) return
    
    startTransition(async () => {
      await createProject(name, description, color)
      setOpen(false)
      setName('')
      setDescription('')
      setColor('#3b82f6')
      router.refresh()
    })
  }

  return (
    <aside className="flex h-full flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center border-b border-border px-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-sidebar-foreground">
          <FolderKanban className="h-4 w-4" />
          Projects
        </h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <Link
            href="/tasks"
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              pathname === '/tasks' && !currentProjectId
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground'
            )}
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: '#6b7280' }}
            />
            All Tasks
          </Link>
          
          {projects.map((project) => {
            const isActive = currentProjectId === project.id
            
            return (
              <Link
                key={project.id}
                href={`/tasks?project=${project.id}`}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground'
                )}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </Link>
            )
          })}
          
          {projects.length === 0 && (
            <p className="px-3 py-4 text-sm text-muted-foreground text-center">
              No projects yet. Create one to get started!
            </p>
          )}
        </div>
      </nav>
      
      <div className="border-t border-border p-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground" size="sm">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add a new project to organize your tasks.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="project-name">Name</Label>
                <Input
                  id="project-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Project name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="project-description">Description (optional)</Label>
                <Input
                  id="project-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description"
                />
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {projectColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        'h-8 w-8 rounded-full transition-transform hover:scale-110',
                        color === c && 'ring-2 ring-offset-2 ring-primary'
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject} disabled={isPending || !name.trim()}>
                {isPending ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  )
}
