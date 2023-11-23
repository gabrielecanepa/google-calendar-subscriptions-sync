import { config } from 'dotenv'
import { auth, calendar } from 'google-calendar-subscriptions'
import subscriptions from '../src/subscriptions'

config()

const PREFIX = process.argv[2]
const CLIENT_EMAIL = process.env[`${PREFIX}_CLIENT_EMAIL`]
const PRIVATE_KEY = process.env[`${PREFIX}_PRIVATE_KEY`]
const SCOPES = ['https://www.googleapis.com/auth/calendar']
  
if (!CLIENT_EMAIL || !PRIVATE_KEY)
  throw Error('Wrong credentials')

const client = calendar({
  version: 'v3',
  auth: new auth.GoogleAuth({
    credentials: {
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    },
    scopes: SCOPES,
  }),
})
  
;(async (): Promise<void> => {
  const newSubscriptions = subscriptions.filter(s => s.id?.startsWith(`${PREFIX.toLowerCase()}-`) && !s.calendarId)
  
  for (const subscription of newSubscriptions) {
    console.info(`Creating subscription ${subscription.summary}...`)
    await client.subscriptions.insert({ requestBody: subscription })
    console.info('Subscription created.')
  }
})()
