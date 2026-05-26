import type { ReviewLog } from '@/types'

export function getTodayReviewCount(reviewLogs: ReviewLog[]): number {
  const today = new Date().toISOString().split('T')[0]
  return reviewLogs.filter((log) => log.reviewed_at === today).length
}

export function calculateStreak(reviewLogs: ReviewLog[]): number {
  if (reviewLogs.length === 0) return 0

  const reviewedDates = Array.from(
    new Set(reviewLogs.map((log) => log.reviewed_at))
  ).sort((a, b) => b.localeCompare(a))

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // Streak must include today or yesterday to be active
  if (reviewedDates[0] !== today && reviewedDates[0] !== yesterday) return 0

  let streak = 0
  let cursor = new Date(reviewedDates[0])

  for (const date of reviewedDates) {
    const d = new Date(date)
    const diff = Math.round((cursor.getTime() - d.getTime()) / 86400000)
    if (diff > 1) break
    cursor = d
    streak++
  }

  return streak
}
