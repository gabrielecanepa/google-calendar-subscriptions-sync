import { calendar_v3 } from 'google-calendar-subscriptions'

const SUMMARY = 'Le Wagon'
const ID = 'lewagon'
const EMAIL = process.env.GC_CLIENT_EMAIL
const CALENDAR_ID = process.env.LEWAGON_CALENDAR_ID
const URL = 'http://kitt.lewagon.com/users/gabrielecanepa/calendar/49edb9f1ae4340f6908a27ea8ff05700'

const MONTH_REGEX = /\s(january|february|march|april|may|june|july|august|september|october|november|december)\s'\d{2}/i

const getSchoolAddress = (city: string): string => {
  switch (city) {
    case 'Casablanca':
      return '380 Bd Brahim Roudani, Casablanca, Morocco'
    default:
      return city
  }
}

const fn: calendar_v3.Schema$Subscription['fn'] = async events => events.map(event => {
  if (event.description) {
    const role = event.description.match(/Role: (\w+)/)?.[1]
    const roleTitle = role ? (role === 'lecturer' ? 'Lecturer' : 'TA') : null
    if (roleTitle) event.description = event.description.replace(`Role: ${role}`, `Role: ${roleTitle}`)
    if (MONTH_REGEX.test(event.description)) event.description = event.description.replace(MONTH_REGEX, '')
  }
  const location = getSchoolAddress(event.location)
  return { ...event, location }
})

const subscription = {
  summary: SUMMARY,
  id: ID,
  calendarId: CALENDAR_ID,
  email: EMAIL,
  url: URL,
  fn,
}

export default subscription
