import { createClient } from '@/lib/supabase/server'
import { getProblems } from '@/lib/db/problems'
import ProblemTable from '@/components/problems/ProblemTable'

export default async function ProblemsPage() {
  const supabase = await createClient()
  const problems = await getProblems(supabase)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Problems</h1>
        <p className="text-sm text-slate-500 mt-1">{problems.length} problem{problems.length !== 1 ? 's' : ''} in your library</p>
      </div>
      <ProblemTable problems={problems} />
    </div>
  )
}
