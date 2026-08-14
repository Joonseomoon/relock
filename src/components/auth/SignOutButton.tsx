'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleSignOut}
      className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900 hover:bg-black/[0.04] rounded-lg transition-all duration-200 active:scale-[0.97] cursor-pointer"
    >
      Sign out
    </button>
  )
}
