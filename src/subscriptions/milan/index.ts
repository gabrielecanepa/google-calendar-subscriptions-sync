import { calendar_v3 } from 'google-calendar-subscriptions'
import { parseEvents } from './utils'

const SUMMARY = 'AC Milan'
const ID = 'milan'
const EMAIL = process.env.GMAIL_CLIENT_EMAIL
const CALENDAR_ID = process.env.MILAN_CALENDAR_ID
const URL = process.env.MILAN_SUBSCRIPTION_URL

export default {
  summary: SUMMARY,
  id: ID,
  email: EMAIL,
  calendarId: CALENDAR_ID,
  url: URL,
  fn: parseEvents,
} as calendar_v3.Schema$Subscription
