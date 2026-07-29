import { run } from '@/actions'
import { info, titleizeList, withRetry } from '@/lib/utils'
import { Action } from '@/lib/types'

export const sync: Action = async entries =>
  run(entries, async (client, subscriptions) => {
    const names = subscriptions.map(({ id, summary }, i) => summary || id || `subscription ${i}`)
    info(`Syncing ${titleizeList(names)}...`)

    await withRetry(() => client.subscriptions.sync({ requestBody: subscriptions }))
  })
