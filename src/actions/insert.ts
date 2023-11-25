import { info } from 'console'
import { run } from './run'
  
export const insert = async (subscriptionIds: string[]): Promise<void> => {
  run(subscriptionIds, async (client, subscriptions) => {
    for (const subscription of subscriptions) {
      info(`Inserting ${subscription.summary || subscription.id || 'subscription'}...`)
      await client.subscriptions.insert({ requestBody: subscription })
      info('Subscription inserted ✅')
    }
  })
}
