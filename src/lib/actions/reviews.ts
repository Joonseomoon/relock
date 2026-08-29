'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { incrementSolveCount } from '@/lib/db/problems'
import { insertReviewLog } from '@/lib/db/reviews'

export async function markAsReviewed(problemId: string, usedHint: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthenticated')
  await incrementSolveCount(supabase, problemId, usedHint)
  await insertReviewLog(supabase, problemId, user.id, usedHint)
  revalidatePath('/')
  revalidatePath('/problems')
}
