import { info } from 'console'
import { auth, calendar, calendar_v3 } from 'google-calendar-subscriptions'
import subscriptionsList from '../subscriptions'

const SCOPES = ['https://www.googleapis.com/auth/calendar']

type RunCallback = (
  client: calendar_v3.Calendar,
  subscription: calendar_v3.Schema$Subscription[],
) => Promise<void>

export const run = async (subscriptionIds: string[], fn: RunCallback): Promise<void> => {
  const emailSubscriptions = subscriptionIds.reduce((acc, id) => {
    const { email } = subscriptionsList.find(s => s.id === id) || {}
    if (!email) throw Error(`Invalid subscription ${id}.`)
    acc[email] ? acc[email].push(id) : acc[email] = [id]
    return acc
  }, {})

  for (const email in emailSubscriptions) {
    info(`Running on ${email}.`)

    const emailEnv = Object.keys(process.env).find(key => process.env[key] === email)
    if (!emailEnv) throw Error(`Can't find env for ${email}.`)

    const prefix = emailEnv.split('_').at(0)
    const client_email = process.env[`${prefix}_CLIENT_EMAIL`]
    const private_key = process.env[`${prefix}_PRIVATE_KEY`]
    if (!client_email || !private_key) throw Error('Wrong credentials.')
    
    const client = calendar({
      version: 'v3',
      auth: new auth.GoogleAuth({
        credentials: { client_email, private_key },
        scopes: SCOPES,
      }),
    })

    const subscriptions = emailSubscriptions[email].map(id => subscriptionsList.find(s => s.id === id))
    
    await fn(client, subscriptions)
    if (Object.keys(emailSubscriptions).pop() !== email) info()
  }
}
