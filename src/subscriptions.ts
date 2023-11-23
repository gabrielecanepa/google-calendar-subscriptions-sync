import { calendar_v3 } from 'google-calendar-subscriptions'
import { titleizeList, toBase32Hex } from './utils'

const subscriptions: calendar_v3.Schema$Subscription[] = [
  {
    summary: 'holidays',
    calendarId: '2d48cbd1c86fdb9f6528e371131e4f80f9f7b293caff772ab32c19c9a5b9d7d5@group.calendar.google.com',
    url: 'https://officeholidays.com/ics-all/italy',
    fn: events =>
      events.reduce((acc, e) => {
        const id = toBase32Hex(e.summary + (e.start.dateTime?.split('T')[0] || e.start.date).slice(0, 4))
        const regionalHoliday = e.location && e.location !== 'Italy'
          ? `(${titleizeList(e.location.split(', '))} only)`
          : e.location
        const summary = e.summary
          .replace('(Not a Public Holiday)', '')
          .replace('(Regional Holiday)', regionalHoliday)
          .trim()
        let description = e.description.split('\n')[0].trim()
        description = description.endsWith('.') ? description : `${description}.`
        if (e.htmlLink) description += `\n\n${e.htmlLink.replace('www.', '')}`
        return [...acc, { ...e, id, summary, description }]
      }, []),
  },
  {
    summary: 'milan',
    calendarId: 'bdf238964f0460928364d0c3f6fb74976b4f9328ab05302a4d6fc390f66927a9@group.calendar.google.com',
    url: 'https://ics.fixtur.es/v2/ac-milan.ics',
    fn: (events): calendar_v3.Schema$Event[] => {
      const COMPETITION_REGEX = /\[(?<c>[A-Z]+)\]/
      const RESULT_REGEX = /\((?<r>\d+-\d+)\)/

      const getCompetiton = (c: string): string => {
        switch (c) {
          case 'CL':
            return 'UEFA Champions League'
          case 'EL':
            return 'UEFA Europa League'
          case 'COP':
            return 'Coppa Italia'
          default:
            return 'Serie A'
        }
      }
      
      return events.map(e => {
        const competitonCode = e.summary.match(COMPETITION_REGEX)?.groups?.c || null
        const result = e.summary.match(RESULT_REGEX)?.groups?.r || null
        const baseSummary = e.summary.replace(new RegExp(`\\[${competitonCode}\\]|\\(${result}\\)`, 'g'), '').trim()

        let id = toBase32Hex(baseSummary + (e.start.dateTime?.split('T')[0] || e.start.date))
        // Workaround for duplicate event ids.
        if (id === 'acmilanhellasveronafc20230923') id += 'v2'

        const summary = e.summary.replace(/S\.S\.\s/g, 'SS ').replace('...', 'TBD')
        const description = getCompetiton(competitonCode)

        return { ...e, id, summary, description, url: null }
      })
    },
  },
]

export default subscriptions
