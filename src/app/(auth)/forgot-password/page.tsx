'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  const inputClass = `w-full px-3 py-2.5 rounded-lg text-sm text-slate-900 placeholder-slate-400
    bg-white/70 border border-slate-200
    focus:outline-none focus:border-sky-300/80 focus:ring-2 focus:ring-sky-300/30
    transition-all duration-200`

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
    <div className="glass-strong rounded-2xl p-8 w-full max-w-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Reset password</h2>
      <p className="text-xs text-slate-400 mb-6">We&apos;ll send you a link to reset your password.</p>

      {sent ? (
        <div className="space-y-4">
          <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            Check your email for a reset link.
          </p>
          <Link href="/login" className="block text-center text-xs text-sky-500 hover:text-sky-400 transition-colors">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
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
              transition-all duration-200 cursor-pointer
              shadow-[0_2px_16px_rgba(125,211,252,0.55)]"
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>

          <p className="text-center text-xs text-slate-400 pt-1">
            <Link href="/login" className="text-sky-500 hover:text-sky-400 transition-colors">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </div>
    </main>
  )
}
