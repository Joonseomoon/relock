import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardStats } from '@/types'

export default function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.streak}</p>
          <p className="text-xs text-muted-foreground mt-1">days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalProblems}</p>
          <p className="text-xs text-muted-foreground mt-1">saved</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Reviewed Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.reviewedToday}</p>
          <p className="text-xs text-muted-foreground mt-1">problems</p>
        </CardContent>
      </Card>
    </div>
  )
}
