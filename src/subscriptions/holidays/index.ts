import { calendar_v3 } from 'google-calendar-subscriptions'
import { toEventId } from '@/lib/utils'
import { parseSummary } from '@/subscriptions/holidays/utils'

export default (events: calendar_v3.Schema$Event[]) =>
  events.reduce(
    (acc, e) => {
      if (e.location && e.location !== 'Italy') {
        if (!e.location.includes('Genoa')) return acc
        e.location = 'Genoa'
      }

      const summary = parseSummary(e)

      let description = e.description.split('\n')[0].trim()
      description = description.endsWith('.') ? description : `${description}.`
      if (e.htmlLink) description += `\n\n${e.htmlLink.replace('www.', '')}`

      const id = `${toEventId(e)}v2`

      return [...acc, { ...e, id, summary, description }]
    },
    [] as typeof events
  )
