import pluralize from 'pluralize'
import { run } from './run'
import { info, titleizeList } from '@/utils'
import { UserSubscription } from '@/types'

export const sync = async (entries: UserSubscription[]): Promise<void> =>
  run(entries, async (client, subscriptions) => {
    const names = subscriptions.map(({ id, summary }, i) => summary || id || `subscription ${i}`)
    info(`Syncing ${titleizeList(names)}...`)

    await client.subscriptions.sync({ requestBody: subscriptions })

    info(`${pluralize('Subscription', subscriptions.length)} synced.`)
  })
