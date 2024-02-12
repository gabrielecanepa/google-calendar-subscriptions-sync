import { calendar_v3 } from 'google-calendar-subscriptions'
import { toBase32Hex } from '@/utils'

export const parseEvents = (events: calendar_v3.Schema$Event[]): calendar_v3.Schema$Event[] =>
  events.reduce((acc, e) => {
    const id = toBase32Hex(e.summary + (e.start.dateTime?.split('T')[0] || e.start.date).slice(0, 4))

    const summary = `${e.summary} 🇲🇦`

    let description = e.description.split('\n')[0].trim()
    description = description.endsWith('.') ? description : `${description}.`
    if (e.htmlLink) description += `\n\n${e.htmlLink.replace('www.', '')}`

    return [...acc, { ...e, id, summary, description }]
  }, [])
