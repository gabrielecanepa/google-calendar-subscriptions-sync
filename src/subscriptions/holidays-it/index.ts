import { calendar_v3 } from 'google-calendar-subscriptions'
import { parseEvents } from './utils'

export default {
  summary: 'Holidays in Italy',
  id: 'holidays-it',
  email: process.env.GMAIL_CLIENT_EMAIL,
  calendarId: process.env.HOLIDAYS_IT_CALENDAR_ID,
  url: process.env.HOLIDAYS_IT_SUBSCRIPTION_URL,
  fn: parseEvents,
} as calendar_v3.Schema$Subscription
