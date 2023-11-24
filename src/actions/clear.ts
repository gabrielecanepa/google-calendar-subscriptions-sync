import { run } from './run'

const MAX_CALENDAR_EVENTS = 2_500
  
export const clear = async (subscriptionIds: string[]): Promise<void> => {
  run(subscriptionIds, async (client, subscriptions) => {
    for (const subscription of subscriptions) {
      const { calendarId, id, summary } = subscription

      console.info(`Clearing ${summary || id || 'subscription'}...`)

      const { items = [] } = (await client.events.list({ calendarId, maxResults: MAX_CALENDAR_EVENTS })).data

      for (const item of items) {
        if (!item.id) {
          console.error(`Event ${item.summary} has no id.`)
          continue
        }
        await client.events.delete({ calendarId, eventId: item.id })
      }

      console.info('Calendar cleared ✅')
    }
  })
}
