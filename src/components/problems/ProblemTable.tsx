'use client'

import { useState, useEffect, useTransition, useMemo } from 'react'

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) setValue(JSON.parse(stored) as T)
    } catch {}
  }, [key])

  function set(next: T | ((prev: T) => T)) {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
      try { localStorage.setItem(key, JSON.stringify(resolved)) } catch {}
      return resolved
    })
  }

  return [value, set] as const
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ProblemForm from './ProblemForm'
import { deleteProblemAction } from '@/lib/actions/problems'
import type { Difficulty, Problem } from '@/types'

const PAGE_SIZE = 20

const difficultyStyles: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700 border border-green-200',
  Medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  Hard: 'bg-red-100 text-red-700 border border-red-200',
}

const DIFFICULTY_FILTERS: { label: string; value: Difficulty | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Easy', value: 'Easy' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Hard', value: 'Hard' },
]

type SortKey =
  | 'title_asc'
  | 'title_desc'
  | 'difficulty_asc'
  | 'difficulty_desc'
  | 'solves_desc'
  | 'solves_asc'
  | 'reviewed_desc'
  | 'reviewed_asc'

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Title A→Z', value: 'title_asc' },
  { label: 'Title Z→A', value: 'title_desc' },
  { label: 'Difficulty Easy→Hard', value: 'difficulty_asc' },
  { label: 'Difficulty Hard→Easy', value: 'difficulty_desc' },
  { label: 'Most Solves', value: 'solves_desc' },
  { label: 'Least Solves', value: 'solves_asc' },
  { label: 'Recently Reviewed', value: 'reviewed_desc' },
  { label: 'Least Recently Reviewed', value: 'reviewed_asc' },
]

const DIFFICULTY_ORDER: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 }

function sortProblems(problems: Problem[], key: SortKey): Problem[] {
  return [...problems].sort((a, b) => {
    switch (key) {
      case 'title_asc': return a.title.localeCompare(b.title)
      case 'title_desc': return b.title.localeCompare(a.title)
      case 'difficulty_asc': return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
      case 'difficulty_desc': return DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty]
      case 'solves_desc': return b.solve_count - a.solve_count
      case 'solves_asc': return a.solve_count - b.solve_count
      case 'reviewed_desc': return (b.last_solved_at ?? '').localeCompare(a.last_solved_at ?? '')
      case 'reviewed_asc': return (a.last_solved_at ?? '').localeCompare(b.last_solved_at ?? '')
    }
  })
}

export default function ProblemTable({ problems }: { problems: Problem[] }) {
  const [diffFilter, setDiffFilter] = useLocalStorage<Difficulty | 'All'>('relock:diff', 'All')
  const [topicFilter, setTopicFilter] = useLocalStorage<string>('relock:topic', 'All')
  const [sortKey, setSortKey] = useLocalStorage<SortKey>('relock:sort', 'title_asc')
  const [hideTopics, setHideTopics] = useLocalStorage<boolean>('relock:hideTopics', false)
  const [hideTrickNotes, setHideTrickNotes] = useLocalStorage<boolean>('relock:hideTrickNotes', false)
  const [page, setPage] = useState(1)
  const [editTarget, setEditTarget] = useState<Problem | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [, startTransition] = useTransition()

  const allTopics = useMemo(() => {
    const set = new Set<string>()
    problems.forEach((p) => p.topics.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [problems])

  const processed = useMemo(() => {
    let result = problems
    if (diffFilter !== 'All') result = result.filter((p) => p.difficulty === diffFilter)
    if (topicFilter !== 'All') result = result.filter((p) => p.topics.includes(topicFilter))
    return sortProblems(result, sortKey)
  }, [problems, diffFilter, topicFilter, sortKey])

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE))
  const paginated = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function applyFilter(diff: Difficulty | 'All') {
    setDiffFilter(diff)
    setPage(1)
  }

  function applyTopicFilter(topic: string) {
    setTopicFilter(topic)
    setPage(1)
  }

  function applySort(key: SortKey) {
    setSortKey(key)
    setPage(1)
  }

  function handleDelete(id: string) {
    startTransition(() => deleteProblemAction(id))
  }

  return (
    <div className="space-y-3">
      {/* Unified toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Difficulty pills */}
        <div className="flex gap-1 p-1 rounded-lg bg-black/[0.04] border border-black/[0.06]">
          {DIFFICULTY_FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => applyFilter(value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer
                ${diffFilter === value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200 shrink-0" />

        {/* Topic filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Topic</span>
          <select
            value={topicFilter}
            onChange={(e) => applyTopicFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white/80 text-slate-700
              focus:outline-none focus:ring-2 focus:ring-sky-200 cursor-pointer
              appearance-none pr-6 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center]"
          >
            <option value="All">All Topics</option>
            {allTopics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Sort</span>
          <select
            value={sortKey}
            onChange={(e) => applySort(e.target.value as SortKey)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white/80 text-slate-700
              focus:outline-none focus:ring-2 focus:ring-sky-200 cursor-pointer
              appearance-none pr-6 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center]"
          >
            {SORT_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Result count */}
        <span className="text-xs text-slate-400">
          {processed.length} result{processed.length !== 1 ? 's' : ''}
        </span>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200 shrink-0" />

        {/* Toggle: topics */}
        <button
          onClick={() => setHideTopics((v) => !v)}
          title={hideTopics ? 'Show topics' : 'Hide topics'}
          className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer
            ${hideTopics
              ? 'border-slate-200 text-slate-300 bg-slate-50'
              : 'border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 bg-white/80'
            }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
        </button>

        {/* Toggle: trick notes */}
        <button
          onClick={() => setHideTrickNotes((v) => !v)}
          title={hideTrickNotes ? 'Show trick notes' : 'Hide trick notes'}
          className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer
            ${hideTrickNotes
              ? 'border-slate-200 text-slate-300 bg-slate-50'
              : 'border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 bg-white/80'
            }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </button>

        {/* Add Problem */}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 text-slate-500
              hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce<(number | '…')[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…')
              acc.push(p)
              return acc
            }, [])
            .map((item, i) =>
              item === '…' ? (
                <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-slate-300">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item as number)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer
                    ${page === item
                      ? 'bg-sky-300 text-sky-950 shadow-sm'
                      : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  {item}
                </button>
              )
            )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 text-slate-500
              hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            Next →
          </button>

          <span className="ml-2 text-xs text-slate-400">page {page} of {totalPages}</span>
        </div>
      )}

      {/* Table */}
      <div className="glass-strong rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60">
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Title</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Difficulty</th>
                {!hideTopics && (
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Topics</th>
                )}
                {!hideTrickNotes && (
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Trick Note</th>
                )}
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Solves</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Last Reviewed</th>
                <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                      <span className="text-sm text-slate-400">
                        {problems.length === 0 ? 'No problems yet — add your first one' : 'No problems match this filter'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((problem, i) => (
                  <tr
                    key={problem.id}
                    className={`group hover:bg-slate-50/70 transition-colors duration-150
                      ${i < paginated.length - 1 ? 'border-b border-slate-100/80' : ''}`}
                  >
                    <td className="px-4 py-3 min-w-[160px] max-w-[220px]">
                      {problem.leetcode_url ? (
                        <a
                          href={problem.leetcode_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-slate-800 hover:text-sky-500 transition-colors cursor-pointer"
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
                            <button
                              key={t}
                              onClick={() => applyTopicFilter(topicFilter === t ? 'All' : t)}
                              className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap transition-colors cursor-pointer
                                ${topicFilter === t
                                  ? 'bg-sky-100 text-sky-700 border-sky-300'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200'
                                }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}

                    {!hideTrickNotes && (
                      <td className="px-4 py-3 min-w-[260px] max-w-[500px]">
                        <span className="text-xs text-slate-500 leading-relaxed whitespace-normal">
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
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => setEditTarget(problem)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150 cursor-pointer"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(problem.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 cursor-pointer"
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
        <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-2xl lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Add Problem</DialogTitle>
          </DialogHeader>
          <ProblemForm onClose={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-2xl lg:max-w-4xl">
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
