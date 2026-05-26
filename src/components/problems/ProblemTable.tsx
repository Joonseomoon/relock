'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import ProblemForm from './ProblemForm'
import { deleteProblemAction } from '@/lib/actions/problems'
import type { Difficulty, Problem } from '@/types'

const difficultyColor: Record<string, string> = {
  Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
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
  const [, startTransition] = useTransition()

  const filtered = filter === 'All' ? problems : problems.filter((p) => p.difficulty === filter)

  function handleDelete(id: string) {
    startTransition(() => deleteProblemAction(id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-1">
          {FILTERS.map(({ label, value }) => (
            <Button
              key={value}
              size="sm"
              variant={filter === value ? 'default' : 'outline'}
              onClick={() => setFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          Add Problem
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Topics</TableHead>
              <TableHead>Trick Note</TableHead>
              <TableHead className="text-right">Solves</TableHead>
              <TableHead>Last Reviewed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No problems found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-medium max-w-[180px] truncate">
                    {problem.leetcode_url ? (
                      <a
                        href={problem.leetcode_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {problem.title}
                      </a>
                    ) : (
                      problem.title
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={difficultyColor[problem.difficulty]}>
                      {problem.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[140px]">
                    <div className="flex gap-1 flex-wrap">
                      {problem.topics.map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                    {problem.trick_note ?? '—'}
                  </TableCell>
                  <TableCell className="text-right">{problem.solve_count}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {problem.last_solved_at ?? '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditTarget(problem)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(problem.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Problem</DialogTitle>
          </DialogHeader>
          <ProblemForm onClose={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Problem</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <ProblemForm problem={editTarget} onClose={() => setEditTarget(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
