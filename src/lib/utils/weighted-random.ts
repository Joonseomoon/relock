import type { Problem } from '@/types'

export function getWeightedRandomProblem(problems: Problem[]): Problem | null {
  if (problems.length === 0) return null

  const weights = problems.map((p) => 1 / (p.solve_count + 1))
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)

  let r = Math.random() * totalWeight

  for (let i = 0; i < problems.length; i++) {
    r -= weights[i]
    if (r <= 0) return problems[i]
  }

  return problems[problems.length - 1]
}
