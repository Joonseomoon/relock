'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createProblem, updateProblem, deleteProblem } from '@/lib/db/problems'
import type { Difficulty } from '@/types'

function parseFormData(formData: FormData) {
  return {
    title: formData.get('title') as string,
    leetcode_url: (formData.get('leetcode_url') as string) || null,
    difficulty: formData.get('difficulty') as Difficulty,
    topics: (formData.getAll('topics') as string[]).filter(Boolean),
    trick_note: (formData.get('trick_note') as string) || null,
    solve_count: parseInt(formData.get('solve_count') as string, 10) || 1,
    hint_count: parseInt(formData.get('hint_count') as string, 10) || 0,
    last_solved_at: (formData.get('last_solved_at') as string) || null,
  }
}

export async function createProblemAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthenticated')
  await createProblem(supabase, { ...parseFormData(formData), user_id: user.id })
  revalidatePath('/problems')
}

export async function updateProblemAction(id: string, formData: FormData) {
  const supabase = await createClient()
  await updateProblem(supabase, id, parseFormData(formData))
  revalidatePath('/problems')
}

export async function deleteProblemAction(id: string) {
  const supabase = await createClient()
  await deleteProblem(supabase, id)
  revalidatePath('/problems')
}
