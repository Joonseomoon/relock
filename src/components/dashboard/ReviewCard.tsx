'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getWeightedRandomProblem } from '@/lib/utils/weighted-random'
import { markAsReviewed } from '@/lib/actions/reviews'
import type { Problem } from '@/types'

const difficultyStyles: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700 border border-green-200',
  Medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  Hard: 'bg-red-100 text-red-700 border border-red-200',
}

export default function ReviewCard({ problems }: { problems: Problem[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<Problem | null>(null)
  const [isPending, startTransition] = useTransition()
  const [showHint, setShowHint] = useState(false)
  const [hasRevealedHint, setHasRevealedHint] = useState(false)

  function pick() {
    setShowHint(false)
    setHasRevealedHint(false)
    setSelected(getWeightedRandomProblem(problems))
  }

  function toggleHint() {
    setShowHint((v) => {
      const next = !v
      if (next) setHasRevealedHint(true)
      return next
    })
  }

  function handleMarkReviewed() {
    if (!selected) return
    startTransition(async () => {
      await markAsReviewed(selected.id, hasRevealedHint)
      setSelected(null)
      router.refresh()
    })
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-slate-900">Today&apos;s Review</h2>
        {selected && (
          <button
            onClick={pick}
            className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-all duration-150 active:scale-[0.97] cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Get another
          </button>
        )}
      </div>

      {!selected ? (
        <div className="flex flex-col items-start gap-3">
          <button
            onClick={pick}
            disabled={problems.length === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white
              bg-sky-300 hover:bg-sky-200 text-sky-950
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200 active:scale-[0.97] cursor-pointer
              shadow-[0_2px_16px_rgba(125,211,252,0.55)]"
          >
            Get Review Problem
          </button>
          {problems.length === 0 && (
            <p className="text-xs text-slate-400">Add some problems first to start reviewing</p>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex items-start gap-3 flex-wrap">
              {selected.leetcode_url ? (
                <a
                  href={selected.leetcode_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-semibold text-slate-900 hover:text-sky-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {selected.title}
                  <svg className="w-3.5 h-3.5 opacity-50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <span className="text-xl font-semibold text-slate-900">{selected.title}</span>
              )}
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${difficultyStyles[selected.difficulty]}`}>
                {selected.difficulty}
              </span>
            </div>

            {(selected.topics.length > 0 || selected.trick_note) && (
              <div>
                <button
                  onClick={toggleHint}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-all duration-150 active:scale-[0.97] cursor-pointer"
                >
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${showHint ? 'rotate-90' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  {showHint ? 'Hide hint' : 'Show hint'}
                </button>

                {showHint && (
                  <div className="mt-3 space-y-3">
                    {selected.topics.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {selected.topics.map((topic) => (
                          <span
                            key={topic}
                            className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                    {selected.trick_note && (
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Trick / Insight</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{selected.trick_note}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>Solved {selected.solve_count}×</span>
              {selected.last_solved_at && (
                <span>Last reviewed {selected.last_solved_at}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleMarkReviewed}
              disabled={isPending}
              className="px-4 py-2 rounded-lg text-sm font-medium text-sky-950
                bg-sky-300 hover:bg-sky-200
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 active:scale-[0.97] cursor-pointer
                shadow-[0_2px_16px_rgba(125,211,252,0.55)]"
            >
              {isPending ? 'Saving…' : 'Mark as Reviewed'}
            </button>
            <button
              onClick={() => setSelected(null)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600
                hover:text-slate-900 hover:bg-slate-100
                border border-slate-200
                transition-all duration-200 active:scale-[0.97] cursor-pointer"
            >
              Dismiss
            </button>
            {hasRevealedHint && (
              <span className="text-xs text-amber-600">Will log as reviewed with hint</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
