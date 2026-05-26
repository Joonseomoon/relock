import type { SupabaseClient } from '@supabase/supabase-js'
import type { ReviewLog } from '@/types'

export async function insertReviewLog(supabase: SupabaseClient, problemId: string) {
  const { error } = await supabase.from('review_logs').insert({ problem_id: problemId })
  if (error) throw error
}

export async function getReviewLogs(supabase: SupabaseClient): Promise<ReviewLog[]> {
  const { data, error } = await supabase
    .from('review_logs')
    .select('*')
    .order('reviewed_at', { ascending: false })

  if (error) throw error
  return data as ReviewLog[]
}
