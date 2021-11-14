import { auth, calendar, calendar_v3 } from 'google-calendar-subscriptions'
import { UserSubscription } from '@/types'
import { info } from '@/utils'

const SCOPES = ['https://www.googleapis.com/auth/calendar']

type SubscriptionCallback = (
  client: calendar_v3.Calendar,
  subscriptionIds: calendar_v3.Schema$Subscription[]
) => Promise<void>

type User = {
  credentials: UserSubscription['credentials']
  subscriptions: Omit<UserSubscription, 'credentials'>[]
}

export const run = async (entries: UserSubscription[], fn: SubscriptionCallback): Promise<void> => {
  const users: User[] = entries.reduce((users, { credentials, ...subscription }) => {
    const user = users.find(usr => usr.credentials.client_email === credentials.client_email)
    if (!user) return [...users, { credentials, subscriptions: [subscription] }]
    user.subscriptions.push(subscription)
    return users
  }, [])

  for (const user of users) {
    info(`Running on ${user.credentials.client_email}`)

    const subscriptions: calendar_v3.Schema$Subscription[] = await Promise.all(
      user.subscriptions.map(async subscription => {
        const fn = (await import(`@/subscriptions/${subscription.id}`)).default
        return { ...subscription, fn }
      })
    )

    const client = calendar({
      version: 'v3',
      auth: new auth.GoogleAuth({
        credentials: user.credentials,
        scopes: SCOPES,
      }),
    })

    await fn(client, subscriptions)
  }
}
