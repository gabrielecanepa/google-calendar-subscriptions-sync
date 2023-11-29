import { calendar_v3 } from 'google-calendar-subscriptions'

const SUMMARY = 'Le Wagon'
const ID = 'lewagon'
const EMAIL = process.env.GC_CLIENT_EMAIL
const CALENDAR_ID = process.env.LEWAGON_CALENDAR_ID
const URL = 'http://kitt.lewagon.com/users/gabrielecanepa/calendar/49edb9f1ae4340f6908a27ea8ff05700'

const lewagon: calendar_v3.Schema$Subscription = {
  summary: SUMMARY,
  id: ID,
  calendarId: CALENDAR_ID,
  email: EMAIL,
  url: URL,
}

const MONTH_REGEX = /\s(january|february|march|april|may|june|july|august|september|october|november|december)\s'\d{2}/i

const getSchoolAddress = (city: string): string => {
  switch (city) {
    case 'Casablanca':
      return '380 Bd Brahim Roudani, Casablanca, Morocco'
    default:
      return city
  }
}

lewagon.fn = (events): calendar_v3.Schema$Event[] => events.map(event => {
  const { description, htmlLink, location } = event

  if (description) {
    const role = description.match(/Role: (\w+)/)?.[1]
    const roleTitle = role ? (role === 'lecturer' ? 'Lecturer' : 'TA') : null
    if (roleTitle) event.description = event.description.replace(`Role: ${role}`, `Role: ${roleTitle}`)
    if (MONTH_REGEX.test(description)) event.description = event.description.replace(MONTH_REGEX, '')
  }
  if (htmlLink) {
    description ? event.description += '\n\n' : event.description = ''
    event.description += htmlLink.replace(/\/calendar/, '')
  }

  event.location = getSchoolAddress(location)

  return event
})

export default lewagon
