'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    // Supabase fires PASSWORD_RECOVERY when the user arrives via the reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      await supabase.auth.signOut()
      router.push('/login')
    }
  }

  const inputClass = `w-full px-3 py-2.5 rounded-lg text-sm text-slate-900 placeholder-slate-400
    bg-white/70 border border-slate-200
    focus:outline-none focus:border-sky-300/80 focus:ring-2 focus:ring-sky-300/30
    transition-all duration-200`

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
    <div className="glass-strong rounded-2xl p-8 w-full max-w-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Set new password</h2>
      <p className="text-xs text-slate-400 mb-6">Choose a new password for your account.</p>

      {!ready ? (
        <p className="text-xs text-slate-400">Verifying reset link…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
              New password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm" className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-sky-950
              bg-sky-300 hover:bg-sky-200
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 active:scale-[0.97] cursor-pointer
              shadow-[0_2px_16px_rgba(125,211,252,0.55)]"
          >
            {loading ? 'Saving…' : 'Update password'}
          </button>
        </form>
      )}
    </div>
    </main>
  )
}
