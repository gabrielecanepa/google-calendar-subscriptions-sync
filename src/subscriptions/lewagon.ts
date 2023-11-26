const SUMMARY = 'Le Wagon'
const ID = 'lewagon'
const EMAIL = process.env.GC_CLIENT_EMAIL
const CALENDAR_ID = process.env.LEWAGON_CALENDAR_ID
const URL = 'http://kitt.lewagon.com/users/gabrielecanepa/calendar/49edb9f1ae4340f6908a27ea8ff05700'

const subscription = {
  summary: SUMMARY,
  id: ID,
  calendarId: CALENDAR_ID,
  email: EMAIL,
  url: URL,
}

export default subscription
