import { calendar_v3 } from 'google-calendar-subscriptions'
import { MATCH_BASE_URL, TEAM_URL, TIMEZONE } from './data'
import { Match } from './types'
import { fetchMsgPack } from '@/utils'

export default (async () => {
  const matches = (await fetchMsgPack(TEAM_URL)).matches as Match[]

  return matches.map(match => {
    const event: calendar_v3.Schema$Event = {}

    const {
      id: matchId,
      home_team: { name: homeTeam },
      away_team: { name: awayTeam },
      kickoff_at,
      tournament: { name: competition },
      score,
      status,
      match_time: { length },
    } = match

    const startDatetime = new Date(kickoff_at).toISOString()
    const endDatetime = new Date(new Date(startDatetime).getTime() + (length + 15) * 60_000).toISOString()

    event.id = matchId.toString()
    event.summary = `${homeTeam} - ${awayTeam}`
    event.description = `${competition}\n\n${MATCH_BASE_URL}/${match.id}`
    event.start = { dateTime: startDatetime, timeZone: TIMEZONE }
    event.end = { dateTime: endDatetime, timeZone: TIMEZONE }

    if (status !== 'before' && score.current) {
      event.summary += ` (${score.current.join('-')})`
    }

    return event
  })
}) as calendar_v3.Schema$Subscription['fn']
