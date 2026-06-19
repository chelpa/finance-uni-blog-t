import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Task } from '@/lib/types'

interface StatsCardsProps {
  tasks: Task[]
}

export function StatsCards({ tasks }: StatsCardsProps) {
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }

  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      className: 'text-foreground',
    },
    {
      title: 'To Do',
      value: stats.todo,
      icon: AlertCircle,
      className: 'text-muted-foreground',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      className: 'text-blue-600',
    },
    {
      title: 'Completed',
      value: stats.done,
      icon: CheckCircle2,
      className: 'text-emerald-600',
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.className}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.className}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
