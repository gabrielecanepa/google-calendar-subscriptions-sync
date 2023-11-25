import { info } from 'console'
import { run } from './run'
import { titleizeList } from '../utils'

export const sync = async (subscriptionIds: string[]): Promise<void> => {
  run(subscriptionIds, async (client, subscriptions) => {
    info(`Syncing ${titleizeList(subscriptions.map(({ id, summary }) => summary || id))}...`)
    await client.subscriptions.sync({ requestBody: subscriptions })
    info('Subscriptions synced ✅')
  })
}

