'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ProblemForm from './ProblemForm'
import { deleteProblemAction } from '@/lib/actions/problems'
import type { Difficulty, Problem } from '@/types'

const difficultyStyles: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700 border border-green-200',
  Medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  Hard: 'bg-red-100 text-red-700 border border-red-200',
}

const FILTERS: { label: string; value: Difficulty | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Easy', value: 'Easy' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Hard', value: 'Hard' },
]

export default function ProblemTable({ problems }: { problems: Problem[] }) {
  const [filter, setFilter] = useState<Difficulty | 'All'>('All')
  const [editTarget, setEditTarget] = useState<Problem | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [hideTopics, setHideTopics] = useState(false)
  const [hideTrickNotes, setHideTrickNotes] = useState(false)
  const [, startTransition] = useTransition()

  const filtered = filter === 'All' ? problems : problems.filter((p) => p.difficulty === filter)

  function handleDelete(id: string) {
    startTransition(() => deleteProblemAction(id))
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1 p-1 rounded-lg bg-black/[0.04] border border-black/[0.06]">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer
                ${filter === value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle buttons */}
          <button
            onClick={() => setHideTopics((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer
              ${hideTopics
                ? 'bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
          >
            {hideTopics ? 'Show Topics' : 'Hide Topics'}
          </button>
          <button
            onClick={() => setHideTrickNotes((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer
              ${hideTrickNotes
                ? 'bg-slate-100 text-slate-400 border-slate-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
          >
            {hideTrickNotes ? 'Show Notes' : 'Hide Notes'}
          </button>

          <button
            onClick={() => setAddOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-sky-950
              bg-sky-300 hover:bg-sky-200
              transition-all duration-200 cursor-pointer
              shadow-[0_2px_12px_rgba(125,211,252,0.55)]
              flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Problem
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/80">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Difficulty</th>
                {!hideTopics && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Topics</th>
                )}
                {!hideTrickNotes && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trick Note</th>
                )}
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Solves</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Reviewed</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                    {problems.length === 0 ? 'No problems yet — add your first one' : 'No problems match this filter'}
                  </td>
                </tr>
              ) : (
                filtered.map((problem, i) => (
                  <tr
                    key={problem.id}
                    className={`hover:bg-black/[0.02] transition-colors duration-150
                      ${i < filtered.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                    <td className="px-4 py-3 min-w-[160px] max-w-[220px]">
                      {problem.leetcode_url ? (
                        <a
                          href={problem.leetcode_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-slate-800 hover:text-sky-400 transition-colors cursor-pointer"
                        >
                          {problem.title}
                        </a>
                      ) : (
                        <span className="font-medium text-slate-800">{problem.title}</span>
                      )}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyStyles[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                    </td>

                    {!hideTopics && (
                      <td className="px-4 py-3 min-w-[140px] max-w-[200px]">
                        <div className="flex gap-1 flex-wrap">
                          {problem.topics.map((t) => (
                            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                    )}

                    {!hideTrickNotes && (
                      <td className="px-4 py-3 min-w-[260px] max-w-[500px]">
                        <span className="text-xs text-slate-600 leading-relaxed whitespace-normal">
                          {problem.trick_note ?? <span className="text-slate-300">—</span>}
                        </span>
                      </td>
                    )}

                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{problem.solve_count}</span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-slate-400">
                        {problem.last_solved_at ?? '—'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditTarget(problem)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(problem.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Add Problem</DialogTitle>
          </DialogHeader>
          <ProblemForm onClose={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Edit Problem</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <ProblemForm problem={editTarget} onClose={() => setEditTarget(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
