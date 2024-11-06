import 'dotenv/config'
import { readdirSync } from 'fs'
import { basename, extname, resolve } from 'path'

import actions from '@/actions'
import { UserSubscription } from '@/lib/types'
import { exit, getEnv, toEnv } from '@/lib/utils'

const SUBSCRIPTIONS = getEnv('SUBSCRIPTIONS')

enum Cmd {
  Action = 'action',
  Script = 'script',
}

const [cmd, arg, ...opts] = process.argv.slice(2)
if (!cmd) exit('no command provided')

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

      const { default: fn } = await import(`@/subscriptions/${name}`)

      return { id: name, url, calendarId, fn, credentials: { client_email, private_key } }
    })
  )

  switch (cmd) {
    case Cmd.Action:
      if (!arg) exit('no action provided')

      const action = actions[arg]
      if (!action) throw Error(`action ${arg} not found`)

      const entries = subscriptions.filter(({ id }) => {
        if (opts.length) return opts.includes(id)
        if (SUBSCRIPTIONS) return SUBSCRIPTIONS.split(',').includes(id)
        return true
      })

      if (!entries.length) exit('subscriptions not found.')

      action(entries)
      break

    case Cmd.Script:
      if (!arg) exit('no script provided.')

      try {
        await import(`@/scripts/${arg}`)
        break
      } catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') exit(`script ${arg}.ts not found`)
        throw e
      }

    default:
      exit(`command ${cmd} not found.`)
  }
}

exec()
