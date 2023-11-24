import { auth, calendar, calendar_v3 } from 'google-calendar-subscriptions'
import subscriptionsList from '../subscriptions'

const SCOPES = ['https://www.googleapis.com/auth/calendar']

type RunCallback = (
  client: calendar_v3.Calendar,
  subscription: calendar_v3.Schema$Subscription[],
) => Promise<void>

export const run = async (subscriptionIds: string[], fn: RunCallback): Promise<void> => {
  const prefixSubscriptions = subscriptionIds.reduce((acc, id) => {
    if (!/[\w\d]+-[\w\d]+/.test(id)) throw Error(`Invalid prefix in ${id}.`)
    const prefix = id.split('-').at(0).toUpperCase()
    acc[prefix] ? acc[prefix].push(id) : acc[prefix] = [id]
    return acc
  }, {})

  for (const prefix in prefixSubscriptions) {
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

    const subscriptions = prefixSubscriptions[prefix].map(
      subscriptionId => subscriptionsList.find(({ id }) => id === subscriptionId),
    )

    return await fn(client, subscriptions)
  }
}
