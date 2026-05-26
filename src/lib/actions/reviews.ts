'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { incrementSolveCount } from '@/lib/db/problems'
import { insertReviewLog } from '@/lib/db/reviews'

export async function markAsReviewed(problemId: string) {
  const supabase = await createClient()
  await incrementSolveCount(supabase, problemId)
  await insertReviewLog(supabase, problemId)
  revalidatePath('/')
}
