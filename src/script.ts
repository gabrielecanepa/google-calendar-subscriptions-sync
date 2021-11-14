/* eslint-disable */
import 'dotenv/config'
import { auth, calendar } from 'google-calendar-subscriptions'

const SCOPES = ['https://www.googleapis.com/auth/calendar']
const MAX_CALENDAR_EVENTS = 2_500

const client = calendar({
  version: 'v3',
  auth: new auth.GoogleAuth({
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    },
    scopes: SCOPES,
  }),
})

const calendarId = '**********@group.calendar.google.com'

export const run = async () => {
  // ...
}

run()
