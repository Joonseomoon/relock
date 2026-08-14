'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const supabase = createClient()

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email to confirm your account.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/')
      }
    }

    setLoading(false)
  }

  return (
    <div className="glass-strong rounded-2xl p-8 w-full max-w-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">
        {mode === 'signin' ? 'Welcome back' : 'Create account'}
      </h2>

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
            className="w-full px-3 py-2.5 rounded-lg text-sm text-slate-900 placeholder-slate-400
              bg-white/70 border border-slate-200
              focus:outline-none focus:border-sky-300/80 focus:ring-2 focus:ring-sky-300/30
              transition-all duration-200"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder="••••••••"
            className="w-full px-3 py-2.5 rounded-lg text-sm text-slate-900 placeholder-slate-400
              bg-white/70 border border-slate-200
              focus:outline-none focus:border-sky-300/80 focus:ring-2 focus:ring-sky-300/30
              transition-all duration-200"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {message && (
          <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white
            bg-sky-300 hover:bg-sky-200 text-sky-950
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 active:scale-[0.97] cursor-pointer
            shadow-[0_2px_16px_rgba(125,211,252,0.55)]"
        >
          {loading ? 'Loading…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
        </button>

        <p className="text-center text-xs text-slate-400 pt-1">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="text-sky-500 hover:text-sky-400 transition-colors cursor-pointer"
            onClick={() => { setError(null); setMessage(null); setMode(mode === 'signin' ? 'signup' : 'signin') }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        {mode === 'signin' && (
          <p className="text-center text-xs text-slate-400">
            <a href="/forgot-password" className="text-sky-500 hover:text-sky-400 transition-colors">
              Forgot password?
            </a>
          </p>
        )}
      </form>
    </div>
  )
}
