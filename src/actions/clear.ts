import { run } from '@/actions'
import type { Action } from '@/lib/types'
import { info, notice, warning } from '@/lib/utils'

const MAX_CALENDAR_EVENTS = 2_500

export const clear: Action = async entries => {
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

      info('Calendar cleared.')
    }
  })
}
