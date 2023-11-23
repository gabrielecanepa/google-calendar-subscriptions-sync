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
    fn: (events): calendar_v3.Schema$Event[] => events.map(e => {
      const competition = e.summary.match(/\[(?<c>[A-Z]+)\]/)?.groups?.c || null
      const result = e.summary.match(/\((?<r>\d+-\d+)\)/)?.groups?.r || null
      const baseSummary = e.summary.replace(new RegExp(`\\[${competition}\\]|\\(${result}\\)`, 'g'), '').trim()

      let competitionName = 'Serie A'
      switch (competition) {
        case 'CL':
          competitionName = 'UEFA Champions League'
        case 'EL':
          competitionName = 'UEFA Europa League'
        case 'COP':
          competitionName = 'Coppa Italia'
      }

      const id = toBase32Hex(baseSummary + (e.start.dateTime?.split('T')[0] || e.start.date))
      const summary = baseSummary.replace(/S\.S\.\s/g, 'SS ').replace('...', 'TBD')
      const description = competitionName

      return { ...e, id, summary, description }
    }),
  },
]

export default subscriptions
