'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getWeightedRandomProblem } from '@/lib/utils/weighted-random'
import { markAsReviewed } from '@/lib/actions/reviews'
import type { Problem } from '@/types'

const difficultyColor: Record<string, string> = {
  Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export default function ReviewCard({ problems }: { problems: Problem[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<Problem | null>(null)
  const [isPending, startTransition] = useTransition()

  function pick() {
    setSelected(getWeightedRandomProblem(problems))
  }

  function handleMarkReviewed() {
    if (!selected) return
    startTransition(async () => {
      await markAsReviewed(selected.id)
      setSelected(null)
      router.refresh()
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review a Problem</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selected ? (
          <div className="flex flex-col items-start gap-2">
            <Button onClick={pick} disabled={problems.length === 0}>
              Get Review Problem
            </Button>
            {problems.length === 0 && (
              <p className="text-sm text-muted-foreground">Add problems first</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {selected.leetcode_url ? (
                  <a
                    href={selected.leetcode_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold hover:underline"
                  >
                    {selected.title}
                  </a>
                ) : (
                  <span className="text-lg font-semibold">{selected.title}</span>
                )}
                <Badge className={difficultyColor[selected.difficulty]}>
                  {selected.difficulty}
                </Badge>
              </div>

              {selected.topics.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {selected.topics.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}

              {selected.trick_note && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium mb-1 text-muted-foreground text-xs uppercase tracking-wide">Trick / Insight</p>
                  <p>{selected.trick_note}</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Solved {selected.solve_count} time{selected.solve_count !== 1 ? 's' : ''}
                {selected.last_solved_at && ` · Last: ${selected.last_solved_at}`}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleMarkReviewed} disabled={isPending}>
                {isPending ? 'Saving...' : 'Mark as Reviewed'}
              </Button>
              <Button variant="outline" onClick={pick}>
                Get Another
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
