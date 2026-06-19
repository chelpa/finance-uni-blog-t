'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { TaskStatus, TaskPriority } from '@/lib/types'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getTasks(projectId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []
  
  let query = supabase
    .from('tasks')
    .select('*, project:projects(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (projectId) {
    query = query.eq('project_id', projectId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export async function getProjects() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })
  
  if (error) throw error
  return data
}

export async function createProject(name: string, description?: string, color?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name,
      description: description || null,
      color: color || '#3b82f6',
      user_id: user.id,
    })
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/', 'max')
  revalidatePath('/tasks', 'max')
  return data
}

export async function createTask(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const status = (formData.get('status') as TaskStatus) || 'todo'
  const priority = (formData.get('priority') as TaskPriority) || 'medium'
  const project_id = formData.get('project_id') as string || null
  const due_date = formData.get('due_date') as string || null
  
  const { error } = await supabase.from('tasks').insert({
    title,
    description: description || null,
    status,
    priority,
    project_id: project_id || null,
    due_date: due_date || null,
    user_id: user.id,
  })
  
  if (error) throw error
  
  revalidatePath('/', 'max')
  revalidatePath('/tasks', 'max')
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('user_id', user.id)
  
  if (error) throw error
  
  revalidatePath('/', 'max')
  revalidatePath('/tasks', 'max')
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', user.id)
  
  if (error) throw error
  
  revalidatePath('/', 'max')
  revalidatePath('/tasks', 'max')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export async function getBlogPosts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getBlogPost(slug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  
  if (error) throw error
  return data
}

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string || null
  const author = formData.get('author') as string
  const category = formData.get('category') as string
  const published = formData.get('published') === 'true'

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-') + '-' + Date.now()

  const { error } = await supabase.from('blog_posts').insert({
    title,
    slug,
    content,
    excerpt,
    author,
    category,
    published,
    published_at: published ? new Date().toISOString() : null,
  })

  if (error) return { error: error.message }

  revalidatePath('/blog')
  redirect('/blog')
}
