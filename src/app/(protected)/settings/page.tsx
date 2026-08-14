'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const inputClass = `w-full px-3 py-2.5 rounded-lg text-sm text-slate-900 placeholder-slate-400
  bg-slate-50 border border-slate-200
  focus:outline-none focus:border-sky-300/80 focus:ring-2 focus:ring-sky-300/30
  transition-all duration-200`

const labelClass = 'block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5'

export default function SettingsPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setPassword('')
      setConfirm('')
      setTimeout(() => router.push('/'), 1500)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account</p>
      </div>

      <div className="glass rounded-xl p-6 max-w-md">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Change password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className={labelClass}>New password</label>
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

          <div>
            <label htmlFor="confirm" className={labelClass}>Confirm password</label>
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
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              Password updated — redirecting…
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-sky-950
                bg-sky-300 hover:bg-sky-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 active:scale-[0.97] cursor-pointer
                shadow-[0_2px_12px_rgba(125,211,252,0.55)]"
            >
              {loading ? 'Saving…' : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
