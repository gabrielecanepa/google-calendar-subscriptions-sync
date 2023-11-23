import { config } from 'dotenv'
import { auth, calendar } from 'google-calendar-subscriptions'
import subscriptions from './subscriptions'
import { titleizeList } from './utils'

config()

const SCOPES = ['https://www.googleapis.com/auth/calendar']
const PREFIXES = Object.keys(process.env).reduce((p, k) =>
  k.endsWith('_CLIENT_EMAIL') ? [...p, k.split('_').at(0)] : p, [])
  
;(async (): Promise<void> => {
  for (const prefix of PREFIXES) {
    const client_email = process.env[`${prefix}_CLIENT_EMAIL`]
    const private_key = process.env[`${prefix}_PRIVATE_KEY`]
    
    if (!client_email || !private_key)
      throw Error(`Wrong ${prefix} credentials`)
    
    const client = calendar({
      version: 'v3',
      auth: new auth.GoogleAuth({
        credentials: { client_email, private_key },
        scopes: SCOPES,
      }),
    })

    const clientSubscriptions = subscriptions.filter(s => s.id.startsWith(`${prefix.toLowerCase()}-`))

    console.info(`Syncing subscriptions ${titleizeList(clientSubscriptions.map(s => s.summary))}...`)
    await client.subscriptions.sync({ requestBody: clientSubscriptions })
    console.info('Subscriptions synced.')
  }
})()
