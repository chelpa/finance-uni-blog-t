import { getProjects, getCurrentUser } from '@/lib/actions'
import { NewBlogPostForm } from './form'

export const metadata = {
  title: 'New Blog Post - TaskFlow',
}

export default async function NewBlogPostPage() {
  const [projects, user] = await Promise.all([getProjects(), getCurrentUser()])
  return <NewBlogPostForm projects={projects} user={user} />
}
