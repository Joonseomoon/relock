import { createClient } from '@/lib/supabase/server'
import { getProblems } from '@/lib/db/problems'
import { getReviewLogs } from '@/lib/db/reviews'
import { calculateStreak, getTodayReviewCount } from '@/lib/db/stats'
import StatsCards from '@/components/dashboard/StatsCards'
import ReviewCard from '@/components/dashboard/ReviewCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const [problems, reviewLogs] = await Promise.all([
    getProblems(supabase),
    getReviewLogs(supabase),
  ])

  const stats = {
    streak: calculateStreak(reviewLogs),
    totalProblems: problems.length,
    reviewedToday: getTodayReviewCount(reviewLogs),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Track your progress and stay consistent</p>
      </div>
      <StatsCards stats={stats} />
      <ReviewCard problems={problems} />
    </div>
  )
}
