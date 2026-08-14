import type { SupabaseClient } from '@supabase/supabase-js'
import type { Problem } from '@/types'

export async function getProblems(supabase: SupabaseClient): Promise<Problem[]> {
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Problem[]
}

export async function createProblem(
  supabase: SupabaseClient,
  data: Omit<Problem, 'id' | 'created_at'>
) {
  const { error } = await supabase.from('problems').insert(data)
  if (error) throw error
}

export async function updateProblem(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Omit<Problem, 'id' | 'user_id' | 'created_at'>>
) {
  const { error } = await supabase.from('problems').update(data).eq('id', id)
  if (error) throw error
}

export async function deleteProblem(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('problems').delete().eq('id', id)
  if (error) throw error
}

export async function incrementSolveCount(supabase: SupabaseClient, id: string, usedHint: boolean) {
  const { data: problem, error: fetchError } = await supabase
    .from('problems')
    .select('solve_count, hint_count')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  const { error } = await supabase
    .from('problems')
    .update({
      solve_count: problem.solve_count + 1,
      hint_count: problem.hint_count + (usedHint ? 1 : 0),
      last_solved_at: new Date().toISOString().split('T')[0],
    })
    .eq('id', id)

  if (error) throw error
}
