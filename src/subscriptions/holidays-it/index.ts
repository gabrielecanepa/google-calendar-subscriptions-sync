import { calendar_v3 } from 'google-calendar-subscriptions'
import { titleizeList, toBase32Hex } from '@/utils'

export default events =>
  events.reduce((acc, e) => {
    const id = toBase32Hex(e.summary + (e.start.dateTime?.split('T')[0] || e.start.date).slice(0, 4))

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

    return [...acc, { ...e, id, summary, description }]
  }, []) as calendar_v3.Schema$Subscription['fn']
