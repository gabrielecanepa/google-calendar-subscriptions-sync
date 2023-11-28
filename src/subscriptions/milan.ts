import { calendar_v3, fetchCalendarEvents } from 'google-calendar-subscriptions'
import { Competition, ForzaFootballMatch } from '../types'
import { fetchMsgPack, toBase32Hex } from '../utils'

const SUMMARY = 'AC Milan'
const ID = 'milan'
const EMAIL = process.env.GMAIL_CLIENT_EMAIL
const CALENDAR_ID = process.env.MILAN_CALENDAR_ID
const URL = 'https://ics.fixtur.es/v2/ac-milan.ics'

const COMPETITION_REGEX = /\s\[(\w+)\]/
const PREFIX_REGEX = /(a\.?c\.?|a\.?s\.?|f\.?c\.?|s\.?s\.?|u\.?s\.?)\s/ig
const STADIUM_REGEX = /stadi(o|on|um)/i
const TIMEZONE = 'Europe/Rome'
const FF_TEAM_URL = 'https://api.forzafootball.net/v1/teams/9363/matches'
const FF_MATCH_BASE_URL = 'https://forzafootball.com/match'
const SKY_TEAM_URL = 'https://skysports.com/calendars/football/fixtures/teams/ac-milan?live=false'

/**
 * Returns true if the two dates are the same.
 */
const isSameDate = (date1: string, date2: string): boolean => 
  new Date(date1).getTime() === new Date(date2).getTime()

const fn: calendar_v3.Schema$Subscription['fn'] = async events => {
  const ffMatches = (await fetchMsgPack(FF_TEAM_URL)).matches as ForzaFootballMatch[]
  const skyEvents = await fetchCalendarEvents(SKY_TEAM_URL)

  return events.map(event => {
    const [competitionMatch, competitionCode] = event.summary.match(COMPETITION_REGEX) || ['', '']
    const competition = competitionCode ? Competition[competitionCode as keyof typeof Competition] : 'Serie A'
    const summary = event.summary.replace(competitionMatch, '').replace(PREFIX_REGEX, '').trim()

    const start: calendar_v3.Schema$EventDateTime = { ...event.start, timeZone: TIMEZONE }
    const startDate = start.dateTime || start.date
    if (!startDate) return event
    const id = toBase32Hex(startDate.split('T')[0])

    // Add Forza Football match URL to description.
    const match = ffMatches.find(({ kickoff_at }) => isSameDate(kickoff_at, startDate))
    const description = match ? `${competition}\n\n${FF_MATCH_BASE_URL}/${match.id}` : competition

    // Add location from Sky.
    const skyEvent = skyEvents.find(({ start }) => isSameDate(start.dateTime || start.date, startDate))
    if (skyEvent?.location) {
      const { location } = skyEvent
      event.location = location
      if (!STADIUM_REGEX.test(location) && !location.includes(', '))
        event.location += ' Stadium'
    }

    return { ...event, id, summary, description, start }
  })
}

const milan: calendar_v3.Schema$Subscription = {
  summary: SUMMARY,
  id: ID,
  email: EMAIL,
  calendarId: CALENDAR_ID,
  url: URL,
  fn,
}

export default milan
