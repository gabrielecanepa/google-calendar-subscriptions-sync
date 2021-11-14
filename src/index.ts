import 'dotenv/config'
import { readdirSync } from 'fs'
import { basename, extname, resolve } from 'path'

import actions from '@/actions'
import { UserSubscription } from '@/types'
import { getEnv, toEnv } from '@/utils'

const SUBSCRIPTIONS = getEnv('SUBSCRIPTIONS')

const [cmd, ...args] = process.argv.slice(2)
if (!cmd) throw Error('No command provided.')

const action = actions[cmd]
if (!action) throw Error(`Action ${cmd} not found.`)

const exec = async () => {
  const subscriptions: UserSubscription[] = await Promise.all(
    readdirSync(resolve(__dirname, 'subscriptions')).map(async file => {
      const name = basename(file, extname(file))
      const ID = toEnv(name)
      const calendarId = getEnv(`${ID}_CALENDAR_ID`, true)
      const url = getEnv(`${ID}_SUBSCRIPTION_URL`, true)

      const USER = getEnv(`${ID}_USER`, true)
      const client_email = getEnv(`${USER}_CLIENT_EMAIL`, true)
      const private_key = getEnv(`${USER}_PRIVATE_KEY`, true)

      const { default: fn } = await import(`./subscriptions/${name}`)

      return { id: name, url, calendarId, fn, credentials: { client_email, private_key } }
    })
  )

  const entries = subscriptions.filter(({ id }) => {
    if (args.length) return args.includes(id)
    if (SUBSCRIPTIONS) return SUBSCRIPTIONS.split(',').includes(id)
    return true
  })

  action(entries)
}

exec()
