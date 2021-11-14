import { run } from './run'
import { UserSubscription } from '@/types'
import { info } from '@/utils'

export const insert = async (entries: UserSubscription[]): Promise<void> => {
  run(entries, async (client, subscriptions) => {
    for (const [i, subscription] of subscriptions.entries()) {
      info(`Inserting ${subscription.summary || subscription.id || `subscription ${i}`}...`)
      await client.subscriptions.insert({ requestBody: subscription })
      info('Subscription inserted.')
    }
  })
}
