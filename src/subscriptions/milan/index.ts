import { calendar_v3, fetchCalendarEvents } from 'google-calendar-subscriptions'
import {
  COMPETITION_REGEX,
  FF_MATCH_BASE_URL,
  FF_TEAM_URL,
  PREFIX_REGEX,
  SKY_TEAM_URL,
  STADIUM_REGEX,
  TIMEZONE,
} from './data'
import { FootballCompetition, ForzaFootballMatch } from './types'
import { fetchMsgPack, isSameDate, toBase32Hex } from '@/utils'

export default (async events => {
  const ffMatches = (await fetchMsgPack(FF_TEAM_URL)).matches as ForzaFootballMatch[]
  const skyEvents = await fetchCalendarEvents(SKY_TEAM_URL)

  return events.map(event => {
    const [competitionMatch, competitionCode] = event.summary.match(COMPETITION_REGEX) || ['', '']
    const competition = competitionCode
      ? FootballCompetition[competitionCode as keyof typeof FootballCompetition]
      : 'Serie A'

    const summary = event.summary.replace(competitionMatch, '').replace(PREFIX_REGEX, '').replace(/\s\s/g, ' ').trim()

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
      if (!STADIUM_REGEX.test(location) && !location.includes(', ')) event.location += ' Stadium'
    }

    return { ...event, id, summary, description, start }
  })
}) as calendar_v3.Schema$Subscription['fn']
