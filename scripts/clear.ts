import { config } from 'dotenv'
import { auth, calendar } from 'google-calendar-subscriptions'
import subscriptions from '../src/subscriptions'

config()

const CALENDAR_IDS = process.argv.slice(2)
const SCOPES = ['https://www.googleapis.com/auth/calendar']
const MAX_CALENDAR_EVENTS = 2_500

;(async (): Promise<void> => {
  for (const calendarId of CALENDAR_IDS) {
    const subscription = subscriptions.find(s => s.calendarId === calendarId)
    if (!subscription) throw Error(`Calendar ${calendarId} not found.`)

    const prefix = subscription.id?.split('-').at(0)?.toUpperCase()
    if (!prefix) throw Error(`Prefix not found for calendar ${calendarId}.`)

    const client_email = process.env[`${prefix}_CLIENT_EMAIL`]
    const private_key = process.env[ `${prefix}_PRIVATE_KEY` ]
    if (!client_email || !private_key) throw Error('Wrong credentials')
    
    const client = calendar({
      version: 'v3',
      auth: new auth.GoogleAuth({
        credentials: { client_email, private_key },
        scopes: SCOPES,
      }),
    })

    console.info(`Clearing ${subscription.summary} calendar...`)
    const { items = [] } = (await client.events.list({ calendarId, maxResults: MAX_CALENDAR_EVENTS })).data
    for (const item of items) {
      if (!item.id) {
        console.error(`Event ${item.summary} has no id.`)
        continue
      }
      await client.events.delete({ calendarId, eventId: item.id })
    }
    console.info('Calendar cleared.')
  }
})()
