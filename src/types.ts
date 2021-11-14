import { calendar_v3 } from 'google-calendar-subscriptions'

export interface UserSubscription extends calendar_v3.Schema$Subscription {
  credentials: {
    client_email: string
    private_key: string
  }
}
