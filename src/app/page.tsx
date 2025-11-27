import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export default async function Home() {
  const session = await auth()

  // Redirect based on user role
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin')
  } else if (session?.user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
