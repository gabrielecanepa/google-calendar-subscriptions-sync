import { config } from 'dotenv'
import actions from './actions'
import subscriptions from './subscriptions'

config()

const SUBSCRIPTIONS = process.env.SUBSCRIPTIONS

const args = process.argv.slice(2)
const cmd = args[0]
const action = actions[cmd]

if (!cmd) throw Error('No command provided.')
if (!action) throw Error(`Action ${cmd} not found.`)

const ids = args.slice(1).length
  ? args.slice(1)
  : SUBSCRIPTIONS
    ? SUBSCRIPTIONS.split(',')
    : subscriptions.map(({ id }) => id)

action(ids)
