import { run } from './run'
import { UserSubscription } from '@/types'
import { info, notice, warning } from '@/utils'

const MAX_CALENDAR_EVENTS = 2_500

export const clear = async (entries: UserSubscription[]): Promise<void> => {
  run(entries, async (client, subscriptions) => {
    for (const [i, subscription] of subscriptions.entries()) {
      const { calendarId, id, summary } = subscription

      info(`Clearing ${summary || id || `subscription ${i + 1}`}...`)

      const { items = [] } = (await client.events.list({ calendarId, maxResults: MAX_CALENDAR_EVENTS })).data

      if (!items.length) {
        notice('Calendar is already empty')
        continue
      }

      for (const item of items) {
        if (!item.id) {
          warning(`event ${item.summary} has no id. Skipping...`)
          continue
        }
        await client.events.delete({ calendarId, eventId: item.id })
      }

      info('Calendar cleared ✅')
    }
  })
}
