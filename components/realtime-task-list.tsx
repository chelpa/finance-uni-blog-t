'use client'

import { useEffect, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Calendar, MoreHorizontal, Trash2, ArrowRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { updateTaskStatus, deleteTask } from '@/lib/actions'
import type { Task, TaskStatus } from '@/lib/types'

interface RealtimeTaskListProps {
  initialTasks: Task[]
  userId: string
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  todo: { label: 'To Do', className: 'bg-secondary text-secondary-foreground' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
  review: { label: 'Review', className: 'bg-amber-100 text-amber-800' },
  done: { label: 'Done', className: 'bg-emerald-100 text-emerald-800' },
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: 'Low', className: 'border-muted-foreground/30 text-muted-foreground' },
  medium: { label: 'Medium', className: 'border-blue-300 text-blue-600' },
  high: { label: 'High', className: 'border-amber-300 text-amber-600' },
  urgent: { label: 'Urgent', className: 'border-destructive text-destructive' },
}

const statusOrder: TaskStatus[] = ['todo', 'in_progress', 'review', 'done']

function getNextStatus(current: TaskStatus): TaskStatus {
  const currentIndex = statusOrder.indexOf(current)
  return statusOrder[(currentIndex + 1) % statusOrder.length]
}

function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  // Parse as UTC date to avoid timezone issues between server/client
  const [year, month, day] = dateString.split('T')[0].split('-').map(Number)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[month - 1]} ${day}`
}

function isOverdue(dateString: string | null, status: TaskStatus): boolean {
  if (!dateString || status === 'done') return false
  // Compare dates in UTC to avoid timezone issues
  const dueDate = new Date(dateString.split('T')[0] + 'T00:00:00Z')
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  return dueDate < today
}

export function RealtimeTaskList({ initialTasks, userId }: RealtimeTaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isPending, startTransition] = useTransition()
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the complete task with project data
            const { data } = await supabase
              .from('tasks')
              .select('*, project:projects(*)')
              .eq('id', payload.new.id)
              .single()
            
            if (data) {
              setTasks((current) => [data as Task, ...current])
            }
          } else if (payload.eventType === 'UPDATE') {
            setTasks((current) =>
              current.map((task) =>
                task.id === payload.new.id
                  ? { ...task, ...payload.new }
                  : task
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setTasks((current) =>
              current.filter((task) => task.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    // Optimistic update
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
    
    setPendingTaskId(taskId)
    startTransition(async () => {
      try {
        await updateTaskStatus(taskId, newStatus)
      } catch {
        // Revert on error
        setTasks(initialTasks)
      }
      setPendingTaskId(null)
    })
  }

  const handleDelete = (taskId: string) => {
    // Optimistic update
    setTasks((current) => current.filter((task) => task.id !== taskId))
    
    setPendingTaskId(taskId)
    startTransition(async () => {
      try {
        await deleteTask(taskId)
      } catch {
        // Revert on error
        setTasks(initialTasks)
      }
      setPendingTaskId(null)
    })
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No tasks yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first task to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {isConnected && (
        <div className="flex items-center gap-2 text-xs text-emerald-600 mb-4">
          <RefreshCw className="h-3 w-3 animate-spin" />
          <span>Real-time updates active</span>
        </div>
      )}
      
      {tasks.map((task) => {
        const status = statusConfig[task.status]
        const priority = priorityConfig[task.priority]
        const overdue = isOverdue(task.due_date, task.status)
        const isLoading = isPending && pendingTaskId === task.id

        return (
          <div
            key={task.id}
            className={cn(
              'group flex items-start gap-3 rounded-lg border bg-card p-4 transition-all hover:bg-accent/50',
              isLoading && 'opacity-60',
              task.status === 'done' && 'bg-muted/30'
            )}
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-start gap-2 flex-wrap">
                <h3 className={cn(
                  'font-medium leading-tight',
                  task.status === 'done' && 'line-through text-muted-foreground'
                )}>
                  {task.title}
                </h3>
                {task.project && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ 
                      backgroundColor: `${task.project.color}20`,
                      color: task.project.color 
                    }}
                  >
                    {task.project.name}
                  </span>
                )}
              </div>
              
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <Badge variant="secondary" className={status.className}>
                  {status.label}
                </Badge>
                <Badge variant="outline" className={priority.className}>
                  {priority.label}
                </Badge>
                {task.due_date && (
                  <span className={cn(
                    'flex items-center gap-1 text-xs',
                    overdue ? 'text-destructive' : 'text-muted-foreground'
                  )}>
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.due_date)}
                    {overdue && ' (Overdue)'}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleStatusChange(task.id, getNextStatus(task.status))}
                disabled={isLoading}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Move to next status</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {statusOrder.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => handleStatusChange(task.id, s)}
                      disabled={task.status === s}
                    >
                      Move to {statusConfig[s].label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )
      })}
    </div>
  )
}
