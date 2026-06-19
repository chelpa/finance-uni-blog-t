export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type BlogCategory = 'general' | 'markets' | 'investing' | 'events' | 'tips'

export interface Project {
  id: string
  name: string
  description: string | null
  color: string
  user_id: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  project_id: string | null
  user_id: string | null
  due_date: string | null
  created_at: string
  updated_at: string
  project?: Project
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  author: string
  category: BlogCategory
  cover_image: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}
