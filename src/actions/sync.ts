import pluralize from 'pluralize'
import { run } from './run'
import { notice, titleizeList } from '@/utils'
import { UserSubscription } from '@/types'

export const sync = async (entries: UserSubscription[]): Promise<void> =>
  run(entries, async (client, subscriptions) => {
    const names = subscriptions.map(({ id, summary }, i) => summary || id || `subscription ${i}`)
    notice(`Syncing ${titleizeList(names)}...`)

    await client.subscriptions.sync({ requestBody: subscriptions })

    notice(`${pluralize('Subscription', subscriptions.length)} synced`)
    if (entries.length > 1 && entries[entries.length - 1]) notice('')
  })
