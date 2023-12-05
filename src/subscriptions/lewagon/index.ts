import { calendar_v3 } from 'google-calendar-subscriptions'
import { parseEvents } from './utils'

const SUMMARY = 'Le Wagon'
const ID = 'lewagon'
const EMAIL = process.env.GC_CLIENT_EMAIL
const CALENDAR_ID = process.env.LEWAGON_CALENDAR_ID
const URL = process.env.LEWAGON_SUBSCRIPTION_URL

export default {
  summary: SUMMARY,
  id: ID,
  calendarId: CALENDAR_ID,
  email: EMAIL,
  url: URL,
  fn: parseEvents,
} as calendar_v3.Schema$Subscription
