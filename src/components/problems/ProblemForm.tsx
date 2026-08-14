'use client'

import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createProblemAction, updateProblemAction } from '@/lib/actions/problems'
import type { Problem } from '@/types'

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 rounded-lg text-sm font-medium text-sky-950
        bg-sky-300 hover:bg-sky-200
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 cursor-pointer
        shadow-[0_2px_12px_rgba(125,211,252,0.55)]"
    >
      {pending ? 'Saving…' : isEdit ? 'Save changes' : 'Add problem'}
    </button>
  )
}

interface Props {
  problem?: Problem
  onClose: () => void
}

const inputClass = `w-full px-3 py-2 rounded-lg text-sm text-slate-900 placeholder-slate-400
  bg-slate-50 border border-slate-200
  focus:outline-none focus:border-sky-300/80 focus:ring-2 focus:ring-sky-300/30
  transition-all duration-200`

const labelClass = 'block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5'

export const TOPICS = [
  'Arrays & Hashing',
  'Two Pointers',
  'Stack',
  'Binary Search',
  'Sliding Window',
  'Linked List',
  'Trees',
  'Tries',
  'Backtracking',
  'Heap / Priority Queue',
  'Graphs',
  '1-D DP',
  'Intervals',
  'Greedy',
  'Advanced Graphs',
  '2-D DP',
  'Bit Manipulation',
  'Math & Geometry',
] as const

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const

const difficultyStyles: Record<string, { active: string; idle: string }> = {
  Easy:   { active: 'bg-green-100 text-green-700 border-green-300', idle: 'bg-white text-slate-500 border-slate-200 hover:border-green-200 hover:text-green-600' },
  Medium: { active: 'bg-amber-100 text-amber-700 border-amber-300', idle: 'bg-white text-slate-500 border-slate-200 hover:border-amber-200 hover:text-amber-600' },
  Hard:   { active: 'bg-red-100 text-red-700 border-red-300',       idle: 'bg-white text-slate-500 border-slate-200 hover:border-red-200 hover:text-red-600' },
}

export default function ProblemForm({ problem, onClose }: Props) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(problem?.topics ?? [])
  const [difficulty, setDifficulty] = useState<string>(problem?.difficulty ?? 'Medium')
  const submittingRef = useRef(false)

  function toggleTopic(topic: string) {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    )
  }

  async function handleSubmit(formData: FormData) {
    if (submittingRef.current) return
    submittingRef.current = true
    selectedTopics.forEach((t) => formData.append('topics', t))
    if (problem) {
      await updateProblemAction(problem.id, formData)
    } else {
      await createProblemAction(formData)
    }
    onClose()
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">

      {/* Row 1: Title + Difficulty */}
      <div className="grid grid-cols-[1fr_200px] gap-3">
        <div>
          <label htmlFor="title" className={labelClass}>Title *</label>
          <input
            id="title"
            name="title"
            required
            defaultValue={problem?.title}
            placeholder="Two Sum"
            className={inputClass}
          />
        </div>
        <div>
          <span className={labelClass}>Difficulty *</span>
          <input type="hidden" name="difficulty" value={difficulty} />
          <div className="flex gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-200">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold border transition-all duration-150 cursor-pointer
                  ${difficulty === d ? difficultyStyles[d].active : difficultyStyles[d].idle}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: URL + Last Reviewed + Solves */}
      <div className="grid grid-cols-[1fr_160px_68px] gap-3">
        <div>
          <label htmlFor="leetcode_url" className={labelClass}>LeetCode URL</label>
          <input
            id="leetcode_url"
            name="leetcode_url"
            type="url"
            defaultValue={problem?.leetcode_url ?? ''}
            placeholder="https://leetcode.com/problems/..."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="last_solved_at" className={labelClass}>Last Reviewed</label>
          <input
            id="last_solved_at"
            name="last_solved_at"
            type="date"
            defaultValue={problem?.last_solved_at ?? ''}
            className={`${inputClass} [color-scheme:light]`}
          />
        </div>
        <div>
          <label htmlFor="solve_count" className={labelClass}>Solves</label>
          <input
            id="solve_count"
            name="solve_count"
            type="number"
            min={1}
            defaultValue={problem?.solve_count ?? 1}
            className={inputClass}
          />
        </div>
      </div>

      {/* Row 4: Topics */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className={labelClass} style={{ marginBottom: 0 }}>Topics</span>
          {selectedTopics.length > 0 && (
            <span className="text-xs text-sky-500 font-medium">{selectedTopics.length} selected</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          {TOPICS.map((topic) => {
            const active = selectedTopics.includes(topic)
            return (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-150 cursor-pointer whitespace-nowrap
                  ${active
                    ? 'bg-sky-100 text-sky-700 border-sky-300'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                  }`}
              >
                {topic}
              </button>
            )
          })}
        </div>
      </div>

      {/* Row 5: Trick / Insight */}
      <div>
        <label htmlFor="trick_note" className={labelClass}>Trick / Insight</label>
        <textarea
          id="trick_note"
          name="trick_note"
          rows={3}
          defaultValue={problem?.trick_note ?? ''}
          placeholder="Key insight or pattern to remember…"
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 pt-1 sticky bottom-0 bg-white/95 backdrop-blur-sm pb-1">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600
            hover:text-slate-900 hover:bg-slate-100
            border border-slate-200
            transition-all duration-200 cursor-pointer"
        >
          Cancel
        </button>
        <SubmitButton isEdit={!!problem} />
      </div>
    </form>
  )
}
