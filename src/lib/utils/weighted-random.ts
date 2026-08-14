import type { Problem } from '@/types'

// A hint-assisted review only counts as this fraction of a full solve toward
// mastery, so problems leaned on with hints keep resurfacing more often.
const HINT_FACTOR = 0.5

function effectiveMastery(p: Problem): number {
  const noHintCount = Math.max(0, p.solve_count - p.hint_count)
  return noHintCount + p.hint_count * HINT_FACTOR
}

// Recency boost grows with days since the problem was last touched, capped so
// it can't dwarf the mastery signal. "Last touched" is the last real review
// (last_solved_at) when one exists; otherwise it falls back to created_at, so
// a problem that's simply never been reviewed still accrues staleness from
// when it was added rather than being treated as perpetually fresh.
const RECENCY_GROWTH_DAYS = 30
const RECENCY_MAX_BOOST = 2

function recencyMultiplier(p: Problem): number {
  const anchor = p.last_solved_at ?? p.created_at
  const daysSince = (Date.now() - new Date(anchor).getTime()) / 86_400_000
  return 1 + Math.min(Math.max(daysSince, 0) / RECENCY_GROWTH_DAYS, RECENCY_MAX_BOOST)
}

export function getWeightedRandomProblem(problems: Problem[]): Problem | null {
  if (problems.length === 0) return null

  const weights = problems.map((p) => recencyMultiplier(p) / (effectiveMastery(p) + 1))
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)

  let r = Math.random() * totalWeight

  for (let i = 0; i < problems.length; i++) {
    r -= weights[i]
    if (r <= 0) return problems[i]
  }

  return problems[problems.length - 1]
}
