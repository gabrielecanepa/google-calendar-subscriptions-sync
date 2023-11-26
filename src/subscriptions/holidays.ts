import { calendar_v3 } from 'google-calendar-subscriptions'
import { titleizeList, toBase32Hex } from '../utils'

const SUMMARY = 'Holidays in Italy'
const ID = 'holidays'
const EMAIL = process.env.GMAIL_CLIENT_EMAIL
const CALENDAR_ID = process.env.HOLIDAYS_CALENDAR_ID
const URL = 'https://officeholidays.com/ics-all/italy'

const fn: calendar_v3.Schema$Subscription['fn'] = events =>
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
  }, [])

const holidays: calendar_v3.Schema$Subscription = {
  summary: SUMMARY,
  id: ID,
  email: EMAIL,
  calendarId: CALENDAR_ID,
  url: URL,
  fn,
}

export default holidays
