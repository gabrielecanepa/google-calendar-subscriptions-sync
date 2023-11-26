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
const STADIUM_REGEX = /\sstadi/i
const TIMEZONE = 'Europe/Rome'
const FF_TEAM_URL = 'https://api.forzafootball.net/v1/teams/9363/matches'
const FF_MATCH_BASE_URL = 'https://forzafootball.com/match'
const SKY_TEAM_URL = 'https://skysports.com/calendars/football/fixtures/teams/ac-milan?live=false'

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
    const match = ffMatches.find(({ kickoff_at }) => new Date(kickoff_at).getTime() === new Date(startDate).getTime())
    const description = match ? `${competition}\n\n${FF_MATCH_BASE_URL}/${match.id}` : competition

    // Add location from Sky.
    const skyEvent = skyEvents.find(e => {
      const date = new Date(e.start.dateTime || e.start.date)
      date.setHours(date.getHours() + 1)
      return date.getTime() === new Date(startDate).getTime()
    })
    if (skyEvent?.location) {
      event.location = skyEvent.location || null
      if (!STADIUM_REGEX.test(skyEvent.location)) event.location += ' Stadium'
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
