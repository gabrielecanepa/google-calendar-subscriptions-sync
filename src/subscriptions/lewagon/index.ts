import { calendar_v3 } from 'google-calendar-subscriptions'
import { parseEvents } from './utils'

export default {
  summary: 'Le Wagon',
  id: 'lewagon',
  calendarId: process.env.LEWAGON_CALENDAR_ID,
  email: process.env.GC_CLIENT_EMAIL,
  url: process.env.LEWAGON_SUBSCRIPTION_URL,
  fn: parseEvents,
} as calendar_v3.Schema$Subscription
