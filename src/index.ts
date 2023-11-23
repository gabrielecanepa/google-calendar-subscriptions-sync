import { config } from 'dotenv'
import { auth, calendar } from 'google-calendar-subscriptions'
import subscriptions from './subscriptions'
import { titleizeList } from './utils'

config()

const CLIENT_EMAIL = process.env.CLIENT_EMAIL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const SCOPES = ['https://www.googleapis.com/auth/calendar']

if (!CLIENT_EMAIL || !PRIVATE_KEY)
  throw Error('Wrong CLIENT_EMAIL or PRIVATE_KEY.')

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
  console.info(`Syncing subscriptions ${titleizeList(subscriptions.map(s => s.summary))}...`)
  await client.subscriptions.sync({ requestBody: subscriptions })
  console.info('Subscriptions synced.')
})()
