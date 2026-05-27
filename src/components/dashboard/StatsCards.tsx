import type { DashboardStats } from '@/types'

interface StatCardProps {
  label: string
  value: number
  unit: string
  icon: React.ReactNode
  accent?: string
}

function StatCard({ label, value, unit, icon, accent = 'text-slate-400' }: StatCardProps) {
  return (
    <div className="glass rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <span className={`${accent}`}>{icon}</span>
      </div>
      <div>
        <p className="text-4xl font-bold text-slate-900 leading-none">{value}</p>
        <p className="text-xs text-slate-400 mt-1.5">{unit}</p>
      </div>
    </div>
  )
}

export default function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="Streak"
        value={stats.streak}
        unit="consecutive days"
        accent="text-orange-500"
        icon={
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
        }
      />
      <StatCard
        label="Total Problems"
        value={stats.totalProblems}
        unit="problems saved"
        accent="text-sky-400"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />
      <StatCard
        label="Reviewed Today"
        value={stats.reviewedToday}
        unit="problems reviewed"
        accent="text-green-500"
        icon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  )
}
