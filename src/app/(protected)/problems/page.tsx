import { createClient } from '@/lib/supabase/server'
import { getProblems } from '@/lib/db/problems'
import ProblemTable from '@/components/problems/ProblemTable'

export default async function ProblemsPage() {
  const supabase = await createClient()
  const problems = await getProblems(supabase)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Problems</h1>
      <ProblemTable problems={problems} />
    </div>
  )
}
