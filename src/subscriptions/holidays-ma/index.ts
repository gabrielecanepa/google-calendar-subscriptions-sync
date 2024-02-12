import { calendar_v3 } from 'google-calendar-subscriptions'
import { parseEvents } from './utils'

export default {
  summary: 'Holidays in Morocco',
  id: 'holidays-ma',
  email: process.env.GMAIL_CLIENT_EMAIL,
  calendarId: process.env.HOLIDAYS_MA_CALENDAR_ID,
  url: process.env.HOLIDAYS_MA_SUBSCRIPTION_URL,
  fn: parseEvents,
} as calendar_v3.Schema$Subscription
