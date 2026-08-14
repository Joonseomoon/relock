import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/auth/SignOutButton'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 inset-x-4 z-50">
        <nav className="glass-nav rounded-xl px-5 h-12 flex items-center justify-between max-w-5xl mx-auto">
          <Link href="/" className="font-bold text-sm tracking-tight">
            <span className="text-gradient">ReLock</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900 hover:bg-black/[0.04] rounded-lg transition-all duration-200 active:scale-[0.97] cursor-pointer"
            >
              Dashboard
            </Link>
            <Link
              href="/problems"
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900 hover:bg-black/[0.04] rounded-lg transition-all duration-200 active:scale-[0.97] cursor-pointer"
            >
              Problems
            </Link>
            <Link
              href="/settings"
              className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900 hover:bg-black/[0.04] rounded-lg transition-all duration-200 active:scale-[0.97] cursor-pointer"
            >
              Settings
            </Link>
          </div>

          <SignOutButton />
        </nav>
      </div>

      <main className="max-w-5xl mx-auto w-full px-4 pt-24 pb-12">
        {children}
      </main>
    </div>
  )
}
