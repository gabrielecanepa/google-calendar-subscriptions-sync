import { clear, sync } from '@/actions'
import type { Action } from '@/lib/types'

export const reset: Action = async entries => {
  await clear(entries)
  await sync(entries)
}
