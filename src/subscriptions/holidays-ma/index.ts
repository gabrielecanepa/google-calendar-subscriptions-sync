import { calendar_v3 } from 'google-calendar-subscriptions'
import { toEventId } from '@/utils'

export default events =>
  events.reduce((acc, e) => {
    const id = toEventId(e)

    const summary = `${e.summary} 🇲🇦`

    let description = e.description.split('\n')[0].trim()
    description = description.endsWith('.') ? description : `${description}.`
    if (e.htmlLink) description += `\n\n${e.htmlLink.replace('www.', '')}`

    return [...acc, { ...e, id, summary, description }]
  }, []) as calendar_v3.Schema$Subscription['fn']
