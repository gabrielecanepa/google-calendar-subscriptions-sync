import { auth, calendar, calendar_v3 } from 'google-calendar-subscriptions'

import { Action, UserSubscription } from '@/lib/types'
import { info } from '@/lib/utils'

const SCOPES = ['https://www.googleapis.com/auth/calendar']

interface User {
  credentials: UserSubscription['credentials']
  subscriptions: Omit<UserSubscription, 'credentials'>[]
}

export const run: Action = async (entries, fn) => {
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
