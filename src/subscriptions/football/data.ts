export const MATCH_BASE_URL = 'https://forzafootball.com/match'
export const TEAM_BASE_URL = 'https://api.forzafootball.net/v1/teams'
export const TEAM_IDS = [8292, 9363]

export const STADIUM_REGEX = /[Ss]tadi(o|on|um)/
export const TIMEZONE = 'Europe/Rome'

export const matchUrls = TEAM_IDS.map(id => `${TEAM_BASE_URL}/${id}/matches`)
