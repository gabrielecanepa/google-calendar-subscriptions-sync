import { calendar_v3 } from 'google-calendar-subscriptions'
import { titleizeList, toEventId } from '@/utils'

export default events =>
  events.reduce((acc, e) => {
    if (e.location && e.location !== 'Italy') {
      if (!e.location.includes('Genoa')) return acc
      e.location = 'Genoa'
    }

    const summary =
      e.summary
        .replace('(Not a Public Holiday)', '')
        .replace('(Regional Holiday)', `(${titleizeList(e.location.split(', '))} only)`)
        .trim() + ' 🇮🇹'

    let description = e.description.split('\n')[0].trim()
    description = description.endsWith('.') ? description : `${description}.`
    if (e.htmlLink) description += `\n\n${e.htmlLink.replace('www.', '')}`

    const id = `${toEventId(e)}v2`

    return [...acc, { ...e, id, summary, description }]
  }, []) as calendar_v3.Schema$Subscription['fn']
