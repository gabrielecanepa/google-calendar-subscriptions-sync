import { run } from './run'
import { titleizeList } from '../utils'

export const sync = async (subscriptionIds: string[]): Promise<void> => {
  run(subscriptionIds, async (client, subscriptions) => {
    console.info(`Syncing ${titleizeList(subscriptions.map(({ id, summary }) => summary || id))}...`)
    await client.subscriptions.sync({ requestBody: subscriptions })
    console.info('Subscriptions synced ✅')
  })
}

