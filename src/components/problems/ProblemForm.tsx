'use client'

import { useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createProblemAction, updateProblemAction } from '@/lib/actions/problems'
import type { Problem } from '@/types'

interface Props {
  problem?: Problem
  onClose: () => void
}

export default function ProblemForm({ problem, onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    if (problem) {
      await updateProblemAction(problem.id, formData)
    } else {
      await createProblemAction(formData)
    }
    onClose()
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" required defaultValue={problem?.title} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="leetcode_url">LeetCode URL</Label>
        <Input
          id="leetcode_url"
          name="leetcode_url"
          type="url"
          placeholder="https://leetcode.com/problems/..."
          defaultValue={problem?.leetcode_url ?? ''}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="difficulty">Difficulty *</Label>
        <Select name="difficulty" defaultValue={problem?.difficulty ?? 'Medium'} required>
          <SelectTrigger id="difficulty">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="topics">Topics</Label>
        <Input
          id="topics"
          name="topics"
          placeholder="Array, Two Pointers, DP"
          defaultValue={problem?.topics.join(', ') ?? ''}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="trick_note">Trick / Insight</Label>
        <Textarea
          id="trick_note"
          name="trick_note"
          rows={3}
          placeholder="Key insight or pattern..."
          defaultValue={problem?.trick_note ?? ''}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="solve_count">Solve Count</Label>
        <Input
          id="solve_count"
          name="solve_count"
          type="number"
          min={1}
          defaultValue={problem?.solve_count ?? 1}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {problem ? 'Save changes' : 'Add problem'}
        </Button>
      </div>
    </form>
  )
}
