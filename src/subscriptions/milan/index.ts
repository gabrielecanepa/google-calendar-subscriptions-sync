import { calendar_v3 } from 'google-calendar-subscriptions'
import { parseEvents } from './utils'

export default {
  summary: 'AC Milan',
  id: 'milan',
  email: process.env.GMAIL_CLIENT_EMAIL,
  calendarId: process.env.MILAN_CALENDAR_ID,
  url: process.env.MILAN_SUBSCRIPTION_URL,
  fn: parseEvents,
} as calendar_v3.Schema$Subscription
