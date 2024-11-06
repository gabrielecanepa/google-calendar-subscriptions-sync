import { run } from '@/actions'
import type { Action } from '@/lib/types'
import { info } from '@/lib/utils'

export const insert: Action = async entries => {
  run(entries, async (client, subscriptions) => {
    for (const [i, subscription] of subscriptions.entries()) {
      info(`Inserting ${subscription.summary || subscription.id || `subscription ${i}`}...`)
      await client.subscriptions.insert({ requestBody: subscription })
      info('Subscription inserted.')
    }
  })
}
