export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Problem {
  id: string
  user_id: string
  title: string
  leetcode_url: string | null
  difficulty: Difficulty
  topics: string[]
  trick_note: string | null
  solve_count: number
  hint_count: number
  last_solved_at: string | null
  created_at: string
}

export interface ReviewLog {
  id: string
  user_id: string
  problem_id: string
  reviewed_at: string
  used_hint: boolean
  created_at: string
}

export interface DashboardStats {
  streak: number
  totalProblems: number
  reviewedToday: number
}
