import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/auth/SignOutButton'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-lg">ReLock</span>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-foreground text-muted-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/problems" className="hover:text-foreground text-muted-foreground transition-colors">
              Problems
            </Link>
          </nav>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  )
}
