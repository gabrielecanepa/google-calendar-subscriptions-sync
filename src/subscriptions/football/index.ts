import { calendar_v3 } from 'google-calendar-subscriptions'
import { MATCH_BASE_URL, TIMEZONE, matchUrls } from './data'
import { Match } from './types'
import { fetchMsgPack } from '@/lib/utils'

const fetchMatches = async (url: string) => {
  const matches = (await fetchMsgPack(url)).matches as Match[]

  return matches.reduce((matches, match) => {
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

    if (competition === 'Club Friendly Games') return matches

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

    return [...matches, event]
  }, [])
}

export default (async () => {
  const events = await Promise.all(matchUrls.map(fetchMatches))
  return events.flat()
}) as calendar_v3.Schema$Subscription['fn']
